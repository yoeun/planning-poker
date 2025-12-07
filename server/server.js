import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { createClient } from 'redis';
import cors from 'cors';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);

// Determine CORS origin
const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
const isProduction = process.env.NODE_ENV === 'production';

const io = new Server(httpServer, {
  cors: {
    origin: isProduction ? true : clientUrl,
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(cors({
  origin: isProduction ? true : clientUrl,
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// Serve static files from React app
app.use(express.static(join(__dirname, 'public')));

// Redis client
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

// Connect to Redis with retry logic
async function connectRedis() {
  try {
    await redisClient.connect();
    console.log('Connected to Redis');
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    // Retry after 2 seconds
    setTimeout(connectRedis, 2000);
  }
}

connectRedis();

// Generate unique session ID
function generateSessionId() {
  return crypto.randomBytes(8).toString('hex');
}

// API routes
app.post('/api/sessions', async (req, res) => {
  try {
    const sessionId = generateSessionId();
    const sessionData = {
      id: sessionId,
      users: {},
      choices: {},
      revealed: false,
      createdAt: Date.now()
    };
    
    await redisClient.setEx(`session:${sessionId}`, 86400, JSON.stringify(sessionData));
    res.json({ sessionId });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

app.get('/api/sessions/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const data = await redisClient.get(`session:${sessionId}`);
    
    if (!data) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

app.delete('/api/sessions/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    await redisClient.del(`session:${sessionId}`);
    io.to(sessionId).emit('sessionDeleted');
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({ error: 'Failed to delete session' });
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('joinSession', async ({ sessionId, userId, name, email, color }) => {
    try {
      const data = await redisClient.get(`session:${sessionId}`);
      if (!data) {
        socket.emit('error', { message: 'Session not found' });
        return;
      }

      const session = JSON.parse(data);
      session.users[userId] = { name, email, color, joinedAt: Date.now() };
      
      await redisClient.setEx(`session:${sessionId}`, 86400, JSON.stringify(session));
      
      socket.join(sessionId);
      socket.sessionId = sessionId;
      socket.userId = userId;
      
      io.to(sessionId).emit('userJoined', { userId, name, email, color });
      io.to(sessionId).emit('sessionUpdate', session);
    } catch (error) {
      console.error('Error joining session:', error);
      socket.emit('error', { message: 'Failed to join session' });
    }
  });

  socket.on('updateUser', async ({ sessionId, userId, name, email, color }) => {
    try {
      const data = await redisClient.get(`session:${sessionId}`);
      if (!data) return;

      const session = JSON.parse(data);
      if (session.users[userId]) {
        session.users[userId].name = name;
        session.users[userId].email = email;
        if (color !== undefined) {
          session.users[userId].color = color;
        }
        
        await redisClient.setEx(`session:${sessionId}`, 86400, JSON.stringify(session));
        io.to(sessionId).emit('userUpdated', { userId, name, email, color });
        io.to(sessionId).emit('sessionUpdate', session);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  });

  socket.on('makeChoice', async ({ sessionId, userId, choice }) => {
    try {
      const data = await redisClient.get(`session:${sessionId}`);
      if (!data) return;

      const session = JSON.parse(data);
      session.choices[userId] = choice;
      
      await redisClient.setEx(`session:${sessionId}`, 86400, JSON.stringify(session));
      
      // Check if all users have made choices
      const allUsers = Object.keys(session.users);
      const allChosen = allUsers.every(uid => session.choices[uid] !== undefined);
      
      io.to(sessionId).emit('choiceMade', { userId, choice });
      io.to(sessionId).emit('sessionUpdate', session);
      
      // Auto-reveal if all users have chosen
      if (allChosen && allUsers.length > 0 && !session.revealed) {
        session.revealed = true;
        await redisClient.setEx(`session:${sessionId}`, 86400, JSON.stringify(session));
        io.to(sessionId).emit('revealChoices', session);
      }
    } catch (error) {
      console.error('Error making choice:', error);
    }
  });

  socket.on('revealChoices', async ({ sessionId }) => {
    try {
      const data = await redisClient.get(`session:${sessionId}`);
      if (!data) return;

      const session = JSON.parse(data);
      session.revealed = true;
      
      await redisClient.setEx(`session:${sessionId}`, 86400, JSON.stringify(session));
      io.to(sessionId).emit('revealChoices', session);
    } catch (error) {
      console.error('Error revealing choices:', error);
    }
  });

  socket.on('resetSession', async ({ sessionId }) => {
    try {
      const data = await redisClient.get(`session:${sessionId}`);
      if (!data) return;

      const session = JSON.parse(data);
      session.choices = {};
      session.revealed = false;
      
      await redisClient.setEx(`session:${sessionId}`, 86400, JSON.stringify(session));
      io.to(sessionId).emit('sessionReset', session);
      io.to(sessionId).emit('sessionUpdate', session);
    } catch (error) {
      console.error('Error resetting session:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Serve React app for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

