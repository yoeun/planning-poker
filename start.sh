#!/bin/sh

# Start Redis in the background
redis-server --daemonize yes --port 6379 --protected-mode no

# Wait for Redis to be ready
echo "Waiting for Redis to start..."
until redis-cli ping > /dev/null 2>&1; do
  sleep 1
done
echo "Redis is ready"

# Start the Node.js server
exec node server.js

