#!/bin/bash
# Build script for Render deployment

set -e  # Exit on error

echo "🚀 Building Christ Revolution Movement..."
echo "📍 Current directory: $(pwd)"

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

# Install Node dependencies and build frontend
echo "📦 Installing Node dependencies..."
cd frontend
npm install

echo "🔨 Building React frontend..."
npm run build

# Verify build succeeded
if [ -d "build" ]; then
    echo "✅ Frontend build directory exists"
    echo "📁 Build contents:"
    ls -la build/ | head -n 10
else
    echo "❌ Frontend build directory NOT found!"
    exit 1
fi

cd ..
echo "✅ Build complete!"
echo "📍 Final directory: $(pwd)"
