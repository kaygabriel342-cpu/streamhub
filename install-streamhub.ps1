# StreamHub Windows Installer Script
# Run this script in PowerShell to set up StreamHub

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   StreamHub - Installation Script" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")
if (-not $isAdmin) {
    Write-Host "[INFO] Running as non-administrator. This is fine for user-level installation." -ForegroundColor Yellow
    Write-Host ""
}

# Check if Node.js is installed
Write-Host "[1/5] Checking Node.js installation..." -ForegroundColor Cyan
try {
    $nodeVersion = node --version
    Write-Host "[OK] Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Node.js is not installed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Node.js from: https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "Download the Windows Installer (.msi) - LTS version recommended" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Press any key to open the download page..." -ForegroundColor Cyan
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    Start-Process "https://nodejs.org/"
    exit 1
}
Write-Host ""

# Check if PostgreSQL is running
Write-Host "[2/5] Checking PostgreSQL..." -ForegroundColor Cyan
try {
    $pgStatus = Get-Service -Name "postgresql*" -ErrorAction SilentlyContinue
    if ($pgStatus) {
        Write-Host "[OK] PostgreSQL service found: $($pgStatus.Status)" -ForegroundColor Green
    } else {
        Write-Host "[WARN] PostgreSQL service not found" -ForegroundColor Yellow
        Write-Host "You can install PostgreSQL from: https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
        Write-Host "Or use Docker (see README.md for instructions)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "[WARN] Could not check PostgreSQL status" -ForegroundColor Yellow
}
Write-Host ""

# Create .env file
Write-Host "[3/5] Creating .env configuration..." -ForegroundColor Cyan
if (-not (Test-Path ".env")) {
    @"
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/app_db
TMDB_API_KEY=8cf03ecf0cacc0582ea33c57b5efd815
TMDB_ACCESS_TOKEN=eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4Y2YwM2VjZjBjYWNjMDU4MmVhMzNjNTdiNWVmZDgxNSIsIm5iZiI6MTc4NjE3MzI5OC45NzEsInN1YiI6IjZhNzZkNzcyN2Q4ZjE5NDVjOTRkNjQ4OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1d6kNfrQOFoQkf5qFbOKOdHvfzwSL-DScbGz8ZQ3yVY
"@ | Out-File -FilePath ".env" -Encoding UTF8
    Write-Host "[OK] .env file created" -ForegroundColor Green
} else {
    Write-Host "[OK] .env file already exists" -ForegroundColor Green
}
Write-Host ""

# Install npm dependencies
Write-Host "[4/5] Installing dependencies..." -ForegroundColor Cyan
Write-Host "This may take a few minutes..." -ForegroundColor Gray
try {
    npm install --loglevel=error
    Write-Host "[OK] Dependencies installed successfully" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Failed to install dependencies!" -ForegroundColor Red
    Write-Host "Try running: npm install" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# Build the application
Write-Host "[5/5] Building application..." -ForegroundColor Cyan
try {
    npm run build --loglevel=error
    Write-Host "[OK] Build completed successfully" -ForegroundColor Green
} catch {
    Write-Host "[WARN] Build encountered issues, but continuing..." -ForegroundColor Yellow
}
Write-Host ""

# Create desktop shortcut
Write-Host "[BONUS] Creating desktop shortcut..." -ForegroundColor Cyan
$WshShell = New-Object -ComObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut("$env:USERPROFILE\Desktop\StreamHub.lnk")
$Shortcut.TargetPath = "http://localhost:3000"
$Shortcut.Description = "StreamHub - Movie & TV Streaming Platform"
$Shortcut.Save()
Write-Host "[OK] Desktop shortcut created!" -ForegroundColor Green
Write-Host ""

# Summary
Write-Host "============================================" -ForegroundColor Green
Write-Host "   Installation Complete!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "To start StreamHub:" -ForegroundColor Cyan
Write-Host "  1. Ensure PostgreSQL is running" -ForegroundColor White
Write-Host "  2. Run: npm run dev" -ForegroundColor White
Write-Host "  3. Open: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "Or simply double-click: start-streamhub.bat" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Optionally open browser
Write-Host ""
Write-Host "Would you like to start StreamHub now? (Y/N)" -ForegroundColor Cyan
$response = Read-Host
if ($response -eq "Y" -or $response -eq "y") {
    Write-Host "Starting StreamHub..." -ForegroundColor Cyan
    npm run dev
}
