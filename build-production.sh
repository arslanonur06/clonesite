#!/bin/bash

# iGaming Brand Protection Platform - Production Build Script

echo "🏗️  Building iGaming Brand Protection Platform for Production..."
echo ""

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist/
rm -rf frontend/dist/

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production=false

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend && npm install && cd ..

# Build backend
echo "🔨 Building backend..."
npm run build

# Build frontend
echo "🎨 Building frontend..."
cd frontend && npm run build && cd ..

# Create production directories
echo "📁 Creating production structure..."
mkdir -p dist/frontend

# Copy frontend build to dist
echo "📋 Copying frontend build..."
cp -r frontend/dist/* dist/frontend/

# Create .env template if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please configure your .env file with your API keys"
fi

echo ""
echo "✅ Production build complete!"
echo ""
echo "To run in production mode:"
echo "  npm start"
echo ""
echo "Or use the web server directly:"
echo "  node dist/web-server.js"
echo ""