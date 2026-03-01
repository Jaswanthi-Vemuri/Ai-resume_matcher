@echo off
REM AI Resume Matcher - Complete Startup Script for Windows
REM This script starts all three components: Endee server, Backend, and Frontend

setlocal enabledelayedexpansion

echo ========================================
echo AI Resume Matcher - Startup Script
echo ========================================
echo.

REM Check if required directories exist
if not exist "frontend" (
    echo Error: frontend directory not found
    pause
    exit /b 1
)

if not exist "backend" (
    echo Error: backend directory not found
    pause
    exit /b 1
)

REM Check backend .env
if not exist "backend\.env" (
    echo Warning: backend\.env not found
    if exist "backend\.env.example" (
        copy "backend\.env.example" "backend\.env"
        echo Created backend\.env from template
        echo Please update it with your OpenAI API key
    ) else (
        echo Error: backend\.env.example not found
        pause
        exit /b 1
    )
)

REM Install frontend dependencies if needed
echo.
echo Checking frontend dependencies...
if not exist "frontend\node_modules" (
    echo Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
)

REM Install backend dependencies if needed
echo.
echo Checking backend dependencies...
if not exist "backend\node_modules" (
    echo Installing backend dependencies...
    cd backend
    call npm install
    cd ..
)

echo.
echo ========================================
echo Starting services...
echo ========================================
echo.

REM Start Endee server
echo Starting Endee server (port 8000)...
cd backend
start "Endee Server" cmd /k npm run endee
echo Waiting for Endee to start...
timeout /t 3 /nobreak
cd ..

REM Start Backend
echo Starting Backend (port 5000)...
cd backend
start "Backend Server" cmd /k npm start
echo Waiting for Backend to start...
timeout /t 3 /nobreak
cd ..

REM Start Frontend
echo Starting Frontend (port 3000)...
cd frontend
start "Frontend" cmd /k npm start
cd ..

echo.
echo ========================================
echo All services started successfully!
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo Endee:    http://localhost:8000
echo.
echo You can close this window. Services will continue running in separate terminals.
echo.
pause
