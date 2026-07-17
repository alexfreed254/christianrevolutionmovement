#!/bin/bash
# Build script for Render deployment - Christ Revolution Movement
# This script installs dependencies and builds the React frontend

set -e  # Exit immediately on any error
set -o pipefail  # Catch errors in pipes

echo "============================================"
echo "🚀 CRM Build Process Starting..."
echo "============================================"
echo "📍 Build directory: $(pwd)"
echo "📍 Python version: $(python --version 2>&1 || echo 'Python not found')"
echo "📍 Node version: $(node --version 2>&1 || echo 'Node not found')"
echo "📍 NPM version: $(npm --version 2>&1 || echo 'NPM not found')"
echo ""

# Step 1: Install Python dependencies
echo "============================================"
echo "📦 Step 1: Installing Python Dependencies"
echo "============================================"
if [ ! -f "requirements.txt" ]; then
    echo "❌ ERROR: requirements.txt not found in $(pwd)"
    exit 1
fi

pip install --no-cache-dir -r requirements.txt
echo "✅ Python dependencies installed"
echo ""

# Step 2: Verify frontend directory
echo "============================================"
echo "📂 Step 2: Verifying Frontend Structure"
echo "============================================"
if [ ! -d "frontend" ]; then
    echo "❌ ERROR: frontend directory not found!"
    echo "📁 Current directory contents:"
    ls -la
    exit 1
fi
echo "✅ Frontend directory exists"

cd frontend
echo "📍 Changed to: $(pwd)"

# Step 3: Verify package.json
if [ ! -f "package.json" ]; then
    echo "❌ ERROR: package.json not found in frontend/"
    ls -la
    exit 1
fi
echo "✅ package.json found"
echo ""

# Step 4: Install Node dependencies
echo "============================================"
echo "📦 Step 3: Installing Node Dependencies"
echo "============================================"
echo "🔍 Installing packages from package.json..."

# Use --legacy-peer-deps to avoid conflicts
npm ci --legacy-peer-deps --loglevel=verbose 2>&1 || {
    echo "⚠️  npm ci failed, trying npm install..."
    npm install --legacy-peer-deps --loglevel=verbose
}

echo "✅ Node dependencies installed"
echo ""

# Step 5: Build React frontend
echo "============================================"
echo "🔨 Step 4: Building React Frontend"
echo "============================================"
echo "🏗️  Running: npm run build"

# Set NODE_ENV for production build
export NODE_ENV=production

# Run build with verbose output
npm run build 2>&1 || {
    echo "❌ ERROR: npm run build failed!"
    echo "📁 Current directory: $(pwd)"
    echo "📁 Directory contents:"
    ls -la
    exit 1
}

echo "✅ Build command completed"
echo ""

# Step 6: Verify build output
echo "============================================"
echo "✅ Step 5: Verifying Build Output"
echo "============================================"

if [ ! -d "build" ]; then
    echo "❌ ERROR: build/ directory not created!"
    echo "📁 Frontend directory contents:"
    ls -la
    exit 1
fi

echo "✅ build/ directory exists"
echo "📁 Build directory: $(pwd)/build"
echo ""
echo "📄 Build contents:"
ls -lah build/ | head -n 20

if [ ! -f "build/index.html" ]; then
    echo "❌ ERROR: index.html not found in build/"
    echo "📁 Build directory contents:"
    ls -la build/
    exit 1
fi

echo "✅ index.html found"
echo ""

# Step 7: Show build statistics
if [ -f "build/index.html" ]; then
    BUILD_SIZE=$(du -sh build/ | cut -f1)
    FILE_COUNT=$(find build/ -type f | wc -l)
    echo "📊 Build Statistics:"
    echo "   • Total size: $BUILD_SIZE"
    echo "   • Files: $FILE_COUNT"
fi

cd ..
echo ""
echo "============================================"
echo "✅ BUILD SUCCESSFUL!"
echo "============================================"
echo "📁 Frontend build: $(pwd)/frontend/build/"
echo "🎉 Ready for deployment"
echo "============================================"
