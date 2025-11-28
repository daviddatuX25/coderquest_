# CoderQuest Component Documentation Generator (PowerShell)
# Converts all React components and SCSS files to organized Markdown
# Usage: .\generate-docs.ps1

param(
    [string]$OutputDir = "./docs",
    [string]$OutputFile = "CODERQUEST_COMPONENTS.md"
)

# Configuration
$srcDirs = @{
    components = "./src/components"
    hooks = "./src/hooks"
    styles = "./src/styles"
}

# Create output directory if it doesn't exist
if (-not (Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir | Out-Null
    Write-Host "📁 Created output directory: $OutputDir" -ForegroundColor Green
}

# Initialize markdown
$markdown = "# CoderQuest - React Components & SCSS Documentation`n`n"
$markdown += "**Generated:** $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')`n`n"

# Table of Contents
$markdown += "## Table of Contents`n`n"
$markdown += "- [React Components](#react-components)`n"
$markdown += "- [Custom Hooks](#custom-hooks)`n"
$markdown += "- [SCSS Styles](#scss-styles)`n"
$markdown += "- [Summary](#summary)`n`n"

# Helper function to generate sections
function Generate-Section {
    param(
        [string]$Title,
        [string]$Description,
        [string]$Directory,
        [string]$Extension,
        [string]$Language
    )
    
    $md = "---`n`n## $Title`n`n"
    $md += "$Description`n`n"
    
    if (-not (Test-Path $Directory)) {
        $md += "*No files found in $Directory*`n`n"
        return $md
    }
    
    $files = Get-ChildItem -Path $Directory -Filter "*$Extension" -ErrorAction SilentlyContinue
    
    if ($files.Count -eq 0) {
        $md += "*No $Extension files found*`n`n"
        return $md
    }
    
    $index = 1
    foreach ($file in $files) {
        $content = Get-Content -Path $file.FullName -Raw
        $md += "### $index. $($file.Name)`n`n"
        $md += "**Path:** ``$($file.FullName)``n`n"
        $md += "**Size:** $($content.Length) bytes`n`n"
        $md += "````$Language`n"
        $md += $content
        $md += "`n````n`n"
        $index++
    }
    
    return $md
}

# Generate React Components section
Write-Host "📝 Processing React Components..." -ForegroundColor Cyan
$markdown += Generate-Section `
    -Title "React Components" `
    -Description "React components for the CoderQuest learning system." `
    -Directory $srcDirs.components `
    -Extension ".jsx" `
    -Language "jsx"

# Generate Custom Hooks section
Write-Host "📝 Processing Custom Hooks..." -ForegroundColor Cyan
$markdown += Generate-Section `
    -Title "Custom Hooks" `
    -Description "Custom React hooks for game integration and event handling." `
    -Directory $srcDirs.hooks `
    -Extension ".js" `
    -Language "javascript"

# Generate SCSS Styles section
Write-Host "📝 Processing SCSS Files..." -ForegroundColor Cyan
$markdown += Generate-Section `
    -Title "SCSS Styles" `
    -Description "SCSS stylesheets organized by component." `
    -Directory $srcDirs.styles `
    -Extension ".scss" `
    -Language "scss"

# Generate Summary
$compCount = @(Get-ChildItem -Path $srcDirs.components -Filter "*.jsx" -ErrorAction SilentlyContinue).Count
$hookCount = @(Get-ChildItem -Path $srcDirs.hooks -Filter "*.js" -ErrorAction SilentlyContinue).Count
$scssCount = @(Get-ChildItem -Path $srcDirs.styles -Filter "*.scss" -ErrorAction SilentlyContinue).Count

$markdown += "---`n`n## Summary`n`n"
$markdown += "**Total React Components:** $compCount`n`n"
$markdown += "**Total Custom Hooks:** $hookCount`n`n"
$markdown += "**Total SCSS Files:** $scssCount`n`n"
$markdown += "**Total Files:** $($compCount + $hookCount + $scssCount)`n`n"
$markdown += "**Generated:** $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')`n"

# Save to file
$outputPath = Join-Path $OutputDir $OutputFile
$markdown | Out-File -FilePath $outputPath -Encoding UTF8

# Display results
Write-Host "`n✅ Documentation generated successfully!`n" -ForegroundColor Green
Write-Host "📄 Output file: $outputPath`n" -ForegroundColor Yellow
Write-Host "📊 Summary:" -ForegroundColor Cyan
Write-Host "   - React Components: $compCount"
Write-Host "   - Custom Hooks: $hookCount"
Write-Host "   - SCSS Files: $scssCount"
Write-Host ""
Write-Host "💡 Next steps:" -ForegroundColor Green
Write-Host "   1. View the markdown:"
Write-Host "      Get-Content $outputPath"
Write-Host ""
Write-Host "   2. Convert to PDF using pandoc:"
Write-Host "      pandoc $outputPath -o $(Join-Path $OutputDir 'CODERQUEST_COMPONENTS.pdf')"
Write-Host ""
Write-Host "   3. Or open in VS Code:"
Write-Host "      code $outputPath`n"
