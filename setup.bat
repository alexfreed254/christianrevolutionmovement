@echo off
REM Christ Revolution Movement - Setup Script for Windows
REM This script sets up the development environment

echo 🚀 Setting up Christ Revolution Movement...

REM Check Python version
python --version
if %errorlevel% neq 0 (
    echo ❌ Python not found. Please install Python 3.11 or higher
    exit /b 1
)

REM Create virtual environment
if not exist "venv" (
    echo 📦 Creating virtual environment...
    python -m venv venv
    echo ✓ Virtual environment created
) else (
    echo ✓ Virtual environment already exists
)

REM Activate virtual environment
echo 🔄 Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo 📥 Installing dependencies...
python -m pip install --upgrade pip
pip install -r backend\requirements.txt
echo ✓ Dependencies installed

REM Check for .env file
if not exist ".env" (
    echo ⚠️  No .env file found
    echo 📝 Copying .env.example to .env...
    copy .env.example .env
    echo.
    echo ⚠️  IMPORTANT: Edit .env file with your Supabase credentials!
    echo    1. Go to https://supabase.com
    echo    2. Get your Project URL and service_role key
    echo    3. Update SUPABASE_URL and SUPABASE_SERVICE_KEY in .env
    echo.
) else (
    echo ✓ .env file exists
)

echo.
echo ✅ Setup complete!
echo.
echo Next steps:
echo 1. Activate virtual environment: venv\Scripts\activate
echo 2. Edit .env with your Supabase credentials
echo 3. Run the database schema in Supabase SQL Editor (database\schema.sql)
echo 4. Start the server: cd backend ^&^& uvicorn main:app --reload
echo.
echo 📖 For deployment instructions, see DEPLOYMENT.md
echo.
pause
