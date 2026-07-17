#!/bin/bash
# Build script for Render deployment

set -e  # Exit on error

echo "🚀 Building Christ Revolution Movement..."
echo "📍 Current directory: $(pwd)"
echo "📍 Directory contents:"
ls -la

# Install Python dependencies
echo ""
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

# Check if frontend directory exists
if [ ! -d "frontend" ]; then
    echo "❌ ERROR: frontend directory not found!"
    ls -la
    exit 1
fi

# Install Node dependencies and build frontend
echo ""
echo "📦 Installing Node dependencies..."
cd frontend

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ ERROR: package.json not found!"
    ls -la
    exit 1
fi

echo "📍 Installing from: $(pwd)/package.json"
npm install --verbose

echo ""
echo "🔨 Building React frontend..."
npm run build --verbose

# Verify build succeeded
if [ -d "build" ]; then
    echo "✅ Frontend build directory exists"
    echo "📁 Build directory: $(pwd)/build"
    echo "📁 Build contents:"
    ls -la build/ | head -n 10
    
    # Check if index.html exists
    if [ -f "build/index.html" ]; then
        echo "✅ index.html found in build"
    else
        echo "❌ ERROR: index.html NOT found in build!"
        exit 1
    fi
else
    echo "❌ ERROR: Frontend build directory NOT found!"
    echo "📁 Current directory contents:"
    ls -la
    exit 1
fi

cd ..
echo ""
echo "✅ Build complete!"
echo "📍 Final directory: $(pwd)"
echo "📁 Final directory structure:"
ls -la frontend/build/ 2>/dev/null || echo "Could not list frontend/build"
