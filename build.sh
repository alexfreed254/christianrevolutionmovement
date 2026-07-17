#!/bin/bash
# Build script for Render deployment

set -e  # Exit on error

echo "🚀 Building Christ Revolution Movement..."

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

# Install Node dependencies and build frontend
echo "📦 Installing Node dependencies..."
cd frontend
npm install

echo "🔨 Building React frontend..."
npm run build

echo "✅ Build complete!"
