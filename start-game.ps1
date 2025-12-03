# CoderQuest Game - Startup Script for PowerShell
# Run as: powershell -ExecutionPolicy Bypass -File start-game.ps1

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  🎮 CoderQuest - Complete Game Start" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Kill existing node processes
Write-Host "🧹 Cleaning up existing processes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

Start-Sleep -Seconds 1

# Navigate to project root
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot

Write-Host ""
Write-Host "📁 Project: $projectRoot" -ForegroundColor Gray
Write-Host ""

# Start backend server
Write-Host "🚀 Starting Backend Server (http://127.0.0.1:3001)..." -ForegroundColor Green
$backendProcess = Start-Process -NoNewWindow -PassThru -FilePath "powershell.exe" -ArgumentList "-NoProfile", "-Command", "cd `"$projectRoot\server`"; node index.js"

Start-Sleep -Seconds 3

# Start frontend dev server
Write-Host "🎨 Starting Frontend Dev Server (http://localhost:5173)..." -ForegroundColor Green
$frontendProcess = Start-Process -NoNewWindow -PassThru -FilePath "powershell.exe" -ArgumentList "-NoProfile", "-Command", "cd `"$projectRoot`"; npm run dev"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   ✅ Game Started!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔗 Backend:  http://127.0.0.1:3001" -ForegroundColor Cyan
Write-Host "🔗 Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 Database: server/coderquest.db" -ForegroundColor Gray
Write-Host ""
Write-Host "Press Ctrl+C to stop both servers..." -ForegroundColor Yellow
Write-Host ""

# Wait for processes to complete
try {
    Wait-Process -Id $backendProcess.Id, $frontendProcess.Id
} catch {
    # Process closed, clean up
}

Write-Host ""
Write-Host "Game stopped." -ForegroundColor Yellow
