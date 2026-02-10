# Kill Django server processes
Write-Host "Encerrando servidor Django..." -ForegroundColor Yellow

# Primeira tentativa: Get-Process
$pythonProcesses = @()
try {
    $pythonProcesses = Get-Process python -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*manage.py*" -or $_.CommandLine -like "*runserver*" }
}
catch {
    # Fallback se o método acima falhar
}

if ($pythonProcesses -and $pythonProcesses.Count -gt 0) {
    foreach ($proc in $pythonProcesses) {
        try {
            Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
            Write-Host "Process $($proc.Id) encerrado" -ForegroundColor Green
        }
        catch {
            Write-Host "Erro ao encerrar processo $($proc.Id)" -ForegroundColor Red
        }
    }
}

# Segunda tentativa: taskkill (mais robusta)
try {
    $output = taskkill /FI "IMAGENAME eq python.exe" /FI "WINDOWTITLE eq*manage.py*" /F 2>&1 | Out-String
    if ($output -like "*Successfully*") {
        Write-Host "Servidor Django encerrado com taskkill!" -ForegroundColor Green
    }
}
catch {
    # Ignorar erros do taskkill
}

# Aguardar um pouco para garantir que finalizou
Start-Sleep -Seconds 1

Write-Host "Servidor encerrado!" -ForegroundColor Green
