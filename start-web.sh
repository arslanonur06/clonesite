#!/bin/bash

echo "🚀 Starting Brand Protection Web Interface..."

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install --no-fund --no-audit
fi

# Build frontend if not exists
if [ ! -d "dist/frontend" ]; then
    echo "🏗️  Building frontend..."
    cd frontend && npm run build && cd ..
fi

echo "🌐 Starting web server on http://localhost:3000"
echo "📊 Dashboard will be available at: http://localhost:3000"
echo "🔌 API endpoints available at: http://localhost:3000/api/*"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the server
npx tsx src/web-server.ts
