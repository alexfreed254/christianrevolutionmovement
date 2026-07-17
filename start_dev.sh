#!/bin/bash

# Quick start script for Linux/Mac development

echo "🚀 Starting Christ Revolution Movement Development Server..."
echo ""

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "❌ Virtual environment not found!"
    echo "Please run ./setup.sh first"
    exit 1
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found"
    echo "Copying from .env.example..."
    cp .env.example .env
    echo ""
    echo "⚠️  IMPORTANT: Edit .env file with your Supabase credentials before continuing!"
    echo ""
    read -p "Press Enter to continue..."
fi

# Activate virtual environment
echo "🔄 Activating virtual environment..."
source venv/bin/activate

# Change to backend directory and start server
echo "🌐 Starting FastAPI server..."
echo ""
echo "Server will be available at:"
echo "  - Local:   http://localhost:8000"
echo "  - API Docs: http://localhost:8000/api/docs"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

cd backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
