@echo off
REM CoderQuest Game - Complete Startup Script for Windows

echo.
echo ========================================
echo   🎮 CoderQuest - Complete Game Start
echo ========================================
echo.

REM Kill existing node processes
echo Cleaning up existing processes...
taskkill /F /IM node.exe 2>nul

REM Wait a moment
timeout /t 1 /nobreak

REM Start backend server in a new window
echo.
echo 🚀 Starting Backend Server (Port 3001)...
start "CoderQuest Backend" cmd /k "cd /d %~dp0server && node index.js"

REM Wait for backend to start
timeout /t 3 /nobreak

REM Start frontend dev server in a new window
echo.
echo 🎨 Starting Frontend Dev Server (Port 5173)...
start "CoderQuest Frontend" cmd /k "cd /d %~dp0 && npm run dev"

echo.
echo ========================================
echo   ✅ Game Starting!
echo ========================================
echo.
echo Backend: http://127.0.0.1:3001
echo Frontend: http://localhost:5173
echo.
echo Close these windows when done playing.
echo.
