# Starts the Laravel API and the Vite SPA in separate persistent windows.
# Safe to run more than once: servers that are already up are left alone.

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backend = Join-Path $root 'backend'
$frontend = Join-Path $root 'frontend'

$api = Get-NetTCPConnection -LocalPort 8100 -State Listen -ErrorAction SilentlyContinue
if (-not $api) {
    Write-Host 'Starting API on http://127.0.0.1:8100 ...' -ForegroundColor Cyan
    Start-Process powershell -ArgumentList @(
        '-NoExit',
        '-Command',
        "cd '$backend'; php artisan serve --host=127.0.0.1 --port=8100"
    )
} else {
    Write-Host 'API already running on port 8100' -ForegroundColor Green
}

$spa = Get-NetTCPConnection -LocalPort 5400 -State Listen -ErrorAction SilentlyContinue
if (-not $spa) {
    Write-Host 'Starting SPA on http://127.0.0.1:5400 ...' -ForegroundColor Cyan
    Start-Process powershell -ArgumentList @(
        '-NoExit',
        '-Command',
        "cd '$frontend'; npm run dev"
    )
} else {
    Write-Host 'SPA already running on port 5400' -ForegroundColor Green
}

Write-Host ''
Write-Host 'Open http://127.0.0.1:5400/signup' -ForegroundColor Yellow
