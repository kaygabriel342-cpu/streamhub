@echo off
title StreamHub - Starting...
color 0A

echo ============================================
echo    StreamHub - Movie & TV Streaming
echo ============================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo.
    echo Please download and install Node.js from:
    echo https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js found: 
node --version
echo.

REM Check if dependencies are installed
if not exist "node_modules" (
    echo [INFO] Installing dependencies...
    echo This may take a few minutes on first run.
    echo.
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to install dependencies!
        pause
        exit /b 1
    )
    echo.
)

REM Check if .env file exists
if not exist ".env" (
    echo [WARN] .env file not found!
    echo Creating default .env file...
    echo.
    (
        echo DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/app_db
        echo TMDB_API_KEY=8cf03ecf0cacc0582ea33c57b5efd815
        echo TMDB_ACCESS_TOKEN=eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4Y2YwM2VjZjBjYWNjMDU4MmVhMzNjNTdiNWVmZDgxNSIsIm5iZiI6MTc4NjE3MzI5OC45NzEsInN1YiI6IjZhNzZkNzcyN2Q4ZjE5NDVjOTRkNjQ4OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1d6kNfrQOFoQkf5qFbOKOdHvfzwSL-DScbGz8ZQ3yVY
    ) > .env
    echo [OK] .env file created
    echo.
    echo [WARN] Please ensure PostgreSQL is running on port 5432
    echo.
)

REM Build if needed
if not exist ".next" (
    echo [INFO] Building application...
    echo.
    call npm run build
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Build failed!
        pause
        exit /b 1
    )
    echo.
)

echo ============================================
echo    Starting StreamHub Server...
echo ============================================
echo.
echo Server will start at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the server
call npm run dev

pause
