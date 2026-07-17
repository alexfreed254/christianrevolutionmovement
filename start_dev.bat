@echo off
REM Quick start script for Windows development

echo 🚀 Starting Christ Revolution Movement Development Server...
echo.

REM Check if virtual environment exists
if not exist "venv" (
    echo ❌ Virtual environment not found!
    echo Please run setup.bat first
    pause
    exit /b 1
)

REM Check if .env exists
if not exist ".env" (
    echo ⚠️  Warning: .env file not found
    echo Copying from .env.example...
    copy .env.example .env
    echo.
    echo ⚠️  IMPORTANT: Edit .env file with your Supabase credentials before continuing!
    echo.
    pause
)

REM Activate virtual environment
echo 🔄 Activating virtual environment...
call venv\Scripts\activate.bat

REM Change to backend directory and start server
echo 🌐 Starting FastAPI server...
echo.
echo Server will be available at:
echo   - Local:   http://localhost:8000
echo   - API Docs: http://localhost:8000/api/docs
echo.
echo Press Ctrl+C to stop the server
echo.

cd backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
