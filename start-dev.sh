#!/bin/bash

# iGaming Brand Protection Platform - Development Server
# This script starts both the backend and frontend in development mode

echo "🚀 Starting iGaming Brand Protection Platform..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if frontend node_modules exists
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

# Kill any existing processes on port 3000
echo "🔍 Checking for existing processes..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# Start the backend server
echo "🌐 Starting backend server..."
npm run web &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Open browser
echo "🌏 Opening browser..."
if command -v xdg-open > /dev/null; then
    xdg-open http://localhost:3000
elif command -v open > /dev/null; then
    open http://localhost:3000
fi

echo ""
echo "✅ Platform is running at http://localhost:3000"
echo ""
echo "📊 Dashboard: http://localhost:3000"
echo "🔍 Scanner: http://localhost:3000/scanner"
echo "🎰 iGaming Tools: http://localhost:3000/igaming-tools"
echo ""
echo "Press Ctrl+C to stop the server"

# Wait for backend process
wait $BACKEND_PID