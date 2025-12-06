# Planning Poker

A real-time sprint planning poker application for teams to estimate stories together. Built with React, TypeScript, Node.js, Socket.io, and Redis.

## Features

- 🎯 Create and join planning sessions with unique URLs
- 👥 Real-time user synchronization
- 🎴 Hidden voting with animated card reveal
- 🔄 Reset sessions to play multiple rounds
- 💾 Local storage for user preferences
- 🖼️ Gravatar avatar support
- ⏰ Automatic session expiration (24 hours)

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Node.js + Express
- **Real-time**: Socket.io
- **Storage**: Redis (server) + LocalStorage (client)
- **Deployment**: Docker + Render

## Getting Started

### Prerequisites

- Node.js 20+
- Docker and Docker Compose (for local development)
- Redis (or use Docker Compose)

### Local Development

1. **Install dependencies:**
   ```bash
   npm run install:all
   ```

2. **Start with Docker Compose:**
   ```bash
   docker-compose up
   ```

   This will start:
   - Redis on port 6379
   - Application server on port 3001

3. **Or run separately:**

   Terminal 1 - Start Redis:
   ```bash
   redis-server
   ```

   Terminal 2 - Start backend:
   ```bash
   cd server
   npm run dev
   ```

   Terminal 3 - Start frontend:
   ```bash
   cd client
   npm run dev
   ```

4. **Open your browser:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

### Environment Variables

Create a `.env` file in the root directory:

```env
REDIS_URL=redis://localhost:6379
CLIENT_URL=http://localhost:5173
PORT=3001
NODE_ENV=development
```

For production, set:
```env
VITE_API_URL=https://your-app.onrender.com
```

## Deployment to Render

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo>
   git push -u origin main
   ```

2. **Create Render Services:**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Create a new Web Service
   - Connect your GitHub repository
   - Select the main branch
   - Render will automatically detect the `render.yaml` file

3. **Configure Environment Variables:**
   - The `render.yaml` file automatically sets up Redis and environment variables
   - Update `CLIENT_URL` in `render.yaml` with your actual Render URL

4. **Deploy:**
   - Render will automatically deploy on every push to main branch
   - The Dockerfile will build and serve the application

## Usage

1. **Create a Session:**
   - Enter your name (required) and email (optional)
   - Click "Create New Session"
   - Share the session URL with your team

2. **Join a Session:**
   - Enter your name and the session ID
   - Click "Join Existing Session"

3. **Vote:**
   - Select a point value (?, 0.5, 1, 1.5, 2, 2.5, 3+)
   - Your choice is hidden from others
   - When all users have voted, choices are automatically revealed
   - Or click "Reveal All Choices" to reveal manually

4. **After Reveal:**
   - View all team members' estimates
   - Change your choice if needed
   - Reset the session to start a new round
   - Delete the session when done

## Project Structure

```
planning-poker/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   └── utils/         # Utilities
│   └── package.json
├── server/                # Node.js backend
│   ├── server.js          # Express + Socket.io server
│   └── package.json
├── Dockerfile             # Docker configuration
├── docker-compose.yml     # Local development setup
├── render.yaml            # Render deployment config
└── package.json           # Root package.json
```

## Development Scripts

- `npm run dev` - Run both client and server in development mode
- `npm run dev:server` - Run only the server
- `npm run dev:client` - Run only the client
- `npm run build` - Build the client for production
- `npm start` - Start the production server

## License

MIT

