#!/usr/bin/env powershell

# CoderQuest HTML to PDF Converter
# Converts COMPLETE_SYSTEM_SUBMISSION.html to PDF using Chrome/Edge

param(
    [string]$InputHTML = "COMPLETE_SYSTEM_SUBMISSION.html",
    [string]$OutputPDF = "COMPLETE_SYSTEM_SUBMISSION.pdf"
)

# ============================================
# MAIN CONVERSION
# ============================================

Write-Host ""
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "   CoderQuest HTML to PDF Converter" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host ""

# Verify input file exists
if (-not (Test-Path $InputHTML)) {
    Write-Host "   ERROR: Input file not found: $InputHTML" -ForegroundColor Red
    exit 1
}

Write-Host "   Converting: $InputHTML" -ForegroundColor Green
Write-Host "   Output: $OutputPDF" -ForegroundColor Green
Write-Host ""

# Find Chrome or Edge browser
$ChromePath = $null
$EdgePath = $null

# Check for Chrome
if (Test-Path "C:\Program Files\Google\Chrome\Application\chrome.exe") {
    $ChromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
}
elseif (Test-Path "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe") {
    $ChromePath = "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
}

# Check for Edge
if (Test-Path "C:\Program Files\Microsoft\Edge\Application\msedge.exe") {
    $EdgePath = "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
}

if ($ChromePath) {
    $BrowserPath = $ChromePath
} elseif ($EdgePath) {
    $BrowserPath = $EdgePath
} else {
    $BrowserPath = $null
}

if (-not $BrowserPath) {
    Write-Host "   ERROR: Chrome or Edge not found" -ForegroundColor Red
    Write-Host "   Please install Chrome or Microsoft Edge" -ForegroundColor Yellow
    Write-Host "" 
    Write-Host "   Alternative: Open the HTML file manually and print as PDF" -ForegroundColor Yellow
    exit 1
}

Write-Host "   Browser found: $BrowserPath" -ForegroundColor Green
Write-Host ""

# Get absolute paths
$InputPath = (Get-Item $InputHTML).FullName
$OutputPath = Join-Path (Get-Location) $OutputPDF

Write-Host "   Generating PDF..." -ForegroundColor Cyan

try {
    $Arguments = @(
        "--headless=new",
        "--disable-gpu",
        "--print-to-pdf=$OutputPath",
        "--print-to-pdf-no-header",
        $InputPath
    )

    & $BrowserPath $Arguments 2>&1 | Out-Null
    
    Start-Sleep -Seconds 3

    if (Test-Path $OutputPath) {
        $PDFSize = (Get-Item $OutputPath).Length / 1024
        Write-Host ""
        Write-Host "   SUCCESS: PDF generated!" -ForegroundColor Green
        Write-Host "   File size: $([math]::Round($PDFSize, 2)) KB" -ForegroundColor Green
        Write-Host ""
        Write-Host "=====================================================" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "   Output: $OutputPath" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "   Document Features:" -ForegroundColor Cyan
        Write-Host "   - A4 format with 2cm margins" -ForegroundColor Gray
        Write-Host "   - Professional layout with brand colors" -ForegroundColor Gray
        Write-Host "   - Auto-paginated for printing" -ForegroundColor Gray
        Write-Host "   - High quality PDF output" -ForegroundColor Gray
        Write-Host ""
        Write-Host "=====================================================" -ForegroundColor Cyan
        Write-Host ""
    } else {
        throw "PDF file was not created"
    }
}
catch {
    Write-Host "   ERROR: Failed to generate PDF" -ForegroundColor Red
    Write-Host "   $_" -ForegroundColor Red
    exit 1
}
