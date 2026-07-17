#!/bin/bash

# Christ Revolution Movement - Setup Script
# This script sets up the development environment for Flask + React

echo "🚀 Setting up Christ Revolution Movement (Flask + React)..."

# Check Python version
python_version=$(python3 --version 2>&1 | awk '{print $2}')
echo "✓ Python version: $python_version"

# Check Node version
node_version=$(node --version 2>&1)
echo "✓ Node version: $node_version"

# Create virtual environment
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
    echo "✓ Virtual environment created"
else
    echo "✓ Virtual environment already exists"
fi

# Activate virtual environment
echo "🔄 Activating virtual environment..."
source venv/bin/activate

# Install backend dependencies
echo "📥 Installing Python dependencies..."
pip install --upgrade pip
pip install -r backend/requirements.txt
echo "✓ Python dependencies installed"

# Install frontend dependencies
echo "📥 Installing Node dependencies..."
cd frontend
npm install
cd ..
echo "✓ Node dependencies installed"

# Check for .env file
if [ ! -f ".env" ]; then
    echo "⚠️  No .env file found"
    echo "📝 Copying .env.example to .env..."
    cp .env.example .env
    echo ""
    echo "⚠️  IMPORTANT: Edit .env file with your Supabase credentials!"
    echo "   1. Go to https://supabase.com"
    echo "   2. Get your Project URL and service_role key"
    echo "   3. Update SUPABASE_URL and SUPABASE_SERVICE_KEY in .env"
    echo ""
else
    echo "✓ .env file exists"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env with your Supabase credentials"
echo "2. Run database schema in Supabase SQL Editor (database/schema.sql)"
echo ""
echo "Start development servers:"
echo "  Terminal 1 (Backend):  cd backend && python app.py"
echo "  Terminal 2 (Frontend): cd frontend && npm run dev"
echo ""
echo "📖 For detailed instructions, see START_HERE.md"
echo ""
