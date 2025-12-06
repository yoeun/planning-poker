# Testing Guide

This guide will help you test the Planning Poker application locally.

## Quick Start (Recommended)

### Option 1: Docker Compose (Easiest)

1. **Install dependencies:**
   ```bash
   npm run install:all
   ```

2. **Start everything:**
   ```bash
   docker-compose up
   ```

3. **Open your browser:**
   - Application: http://localhost:3001

This starts Redis and the full application in production mode.

### Option 2: Development Mode (For Active Development)

1. **Install dependencies:**
   ```bash
   npm run install:all
   ```

2. **Start Redis** (in Terminal 1):
   ```bash
   # If you have Redis installed locally:
   redis-server
   
   # OR use Docker:
   docker run -d -p 6379:6379 redis:7-alpine
   ```

3. **Start the application** (in Terminal 2):
   ```bash
   npm run dev
   ```

   This starts both frontend and backend with hot-reload.

4. **Open your browser:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

## Testing the Application

### 1. Create a Session

1. Open http://localhost:5173 (or http://localhost:3001 if using Docker)
2. Enter your name (required) and email (optional)
3. Click "Create New Session"
4. You should be redirected to a session page with a unique session ID

### 2. Join a Session (Test Multi-User)

1. **First user:** Create a session and copy the session ID from the URL
   - Example: `http://localhost:5173/session/abc123def456`

2. **Second user:** Open a new browser window (or incognito/private window)
   - Go to the same URL
   - Enter a different name
   - You should see both users in the participant list

### 3. Test Voting

1. **Make a choice:**
   - Click on any point value (?, 0.5, 1, 1.5, 2, 2.5, 3+)
   - Your choice should be highlighted
   - You should see "✓ You've made your choice"

2. **Test with multiple users:**
   - Have both users make choices
   - You should see "X of Y participants have chosen" update in real-time
   - When all users have chosen, a "Reveal All Choices" button appears

3. **Reveal choices:**
   - Click "Reveal All Choices" (or wait for auto-reveal)
   - Cards should animate and reveal all choices
   - You should see all participants' estimates

### 4. Test Real-Time Updates

1. **User profile updates:**
   - Click "Edit Your Profile" in the participant list
   - Change your name or email
   - The change should appear for all users in real-time

2. **Change choice after reveal:**
   - After revealing, select a different point value
   - Your choice should update for all users

3. **Reset session:**
   - Click "Reset" button
   - All choices should be cleared
   - Session should return to voting state
   - All users should see the reset in real-time

### 5. Test Session Management

1. **Delete session:**
   - Click "Delete Session"
   - Confirm deletion
   - All users should be redirected to the home page

2. **Session expiration:**
   - Sessions expire after 24 hours automatically
   - You can test this by manually checking Redis TTL (advanced)

## Testing Checklist

- [ ] Create a new session
- [ ] Join an existing session with a different user
- [ ] Make a voting choice
- [ ] See real-time updates when other users vote
- [ ] Reveal all choices (auto and manual)
- [ ] See animated card reveal
- [ ] Change choice after reveal
- [ ] Update user profile (name/email)
- [ ] See profile updates in real-time
- [ ] Reset session
- [ ] Delete session
- [ ] Verify localStorage saves user preferences
- [ ] Verify Gravatar avatars load (if email provided)

## Testing with Multiple Browsers/Devices

To test real-time features properly:

1. **Desktop browser:** Chrome/Firefox/Safari
2. **Mobile browser:** Open on your phone (use your local IP, e.g., `http://192.168.1.x:5173`)
3. **Incognito window:** Simulates a different user
4. **Different browsers:** Test cross-browser compatibility

## Debugging

### Check Server Logs

```bash
# If using Docker:
docker-compose logs -f app

# If running separately:
# Check terminal where server is running
```

### Check Redis

```bash
# Connect to Redis CLI:
redis-cli

# List all sessions:
KEYS session:*

# Check a specific session:
GET session:abc123def456

# Check TTL (time until expiration):
TTL session:abc123def456
```

### Check Browser Console

- Open Developer Tools (F12)
- Check Console for errors
- Check Network tab for API calls
- Check Application > Local Storage for saved user data

### Common Issues

1. **"Session not found"**
   - Check Redis is running
   - Check session ID is correct
   - Session may have expired (24hr TTL)

2. **Real-time updates not working**
   - Check Socket.io connection in browser console
   - Verify CORS settings
   - Check server logs for connection errors

3. **Can't connect to Redis**
   - Verify Redis is running: `redis-cli ping` (should return PONG)
   - Check REDIS_URL environment variable
   - For Docker: ensure redis service is up

4. **Port already in use**
   - Change PORT in .env file
   - Or kill process using the port:
     ```bash
     # Find process:
     lsof -i :3001
     # Kill it:
     kill -9 <PID>
     ```

## API Testing (Optional)

You can test the API directly using curl:

```bash
# Create a session
curl -X POST http://localhost:3001/api/sessions

# Get a session (replace SESSION_ID)
curl http://localhost:3001/api/sessions/SESSION_ID

# Health check
curl http://localhost:3001/health
```

## Performance Testing

1. **Multiple users:**
   - Open 10+ browser windows
   - Join the same session
   - Test voting and real-time updates

2. **Network conditions:**
   - Use browser DevTools to simulate slow 3G
   - Test offline/online transitions

## Next Steps

Once everything works locally, you can:

1. Deploy to Render (see README.md)
2. Test the production build:
   ```bash
   npm run build
   npm start
   ```
3. Test Docker build:
   ```bash
   docker build -t planning-poker .
   docker run -p 3001:3001 -e REDIS_URL=redis://host.docker.internal:6379 planning-poker
   ```

