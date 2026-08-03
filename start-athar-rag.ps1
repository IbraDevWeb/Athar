param(
    [int]$PreferredPort = 8000,
    [switch]$NoBrowser
)

$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot

function Write-AtharStep {
    param([string]$Message)
    Write-Host "[Athar RAG] $Message" -ForegroundColor Cyan
}

function Test-RagApi {
    param([int]$Port)

    try {
        $request = @{
            Uri = "http://127.0.0.1:$Port/api/rag/v2/status"
            Method = 'Get'
            TimeoutSec = 2
            ErrorAction = 'Stop'
        }
        $response = Invoke-RestMethod @request
        return [bool]$response.ok
    }
    catch {
        return $false
    }
}

function Test-PortOccupied {
    param([int]$Port)

    $listener = [System.Net.Sockets.TcpListener]::new(
        [System.Net.IPAddress]::Loopback,
        $Port
    )

    try {
        $listener.Start()
        return $false
    }
    catch {
        return $true
    }
    finally {
        try { $listener.Stop() } catch { }
    }
}

$venvPython = Join-Path $PSScriptRoot '.venv-rag\Scripts\python.exe'
$requirements = Join-Path $PSScriptRoot 'rag\requirements.txt'

if (-not (Test-Path -LiteralPath $venvPython)) {
    Write-AtharStep 'Création de l’environnement Python local…'

    $pyLauncher = Get-Command py -ErrorAction SilentlyContinue
    if ($pyLauncher) {
        & $pyLauncher.Source -3 -m venv '.venv-rag'
    }
    else {
        $pythonCommand = Get-Command python -ErrorAction SilentlyContinue
        if (-not $pythonCommand) {
            throw 'Python 3 est introuvable. Installez Python puis relancez start-athar-rag.bat.'
        }
        & $pythonCommand.Source -m venv '.venv-rag'
    }

    if ($LASTEXITCODE -ne 0 -or -not (Test-Path -LiteralPath $venvPython)) {
        throw 'La création de l’environnement Python a échoué.'
    }
}

Write-AtharStep 'Vérification des dépendances…'
& $venvPython -m pip install --disable-pip-version-check -q -r $requirements
if ($LASTEXITCODE -ne 0) {
    throw 'L’installation des dépendances RAG a échoué.'
}

$selectedPort = $null
$existingRagPort = $null

foreach ($candidate in $PreferredPort..($PreferredPort + 10)) {
    if (Test-RagApi -Port $candidate) {
        $existingRagPort = $candidate
        break
    }

    if (-not (Test-PortOccupied -Port $candidate)) {
        $selectedPort = $candidate
        break
    }

    Write-Host "[Athar RAG] Le port $candidate est occupé par un autre serveur ; essai du port suivant." -ForegroundColor Yellow
}

if ($existingRagPort) {
    $existingUrl = "http://127.0.0.1:$existingRagPort/?server=rag-v2"
    Write-AtharStep "Un serveur RAG V2 fonctionne déjà sur le port $existingRagPort."
    if (-not $NoBrowser) {
        Start-Process $existingUrl
    }
    Write-Host "Adresse : $existingUrl" -ForegroundColor Green
    exit 0
}

if (-not $selectedPort) {
    throw "Aucun port libre n’a été trouvé entre $PreferredPort et $($PreferredPort + 10)."
}

Write-AtharStep "Démarrage du serveur RAG V2 sur le port $selectedPort…"
$serverArguments = @(
    'rag\server.py',
    '--host', '127.0.0.1',
    '--port', [string]$selectedPort
)
$startParameters = @{
    FilePath = $venvPython
    ArgumentList = $serverArguments
    WorkingDirectory = $PSScriptRoot
    PassThru = $true
    NoNewWindow = $true
}
$serverProcess = Start-Process @startParameters

try {
    $ready = $false
    for ($attempt = 0; $attempt -lt 60; $attempt++) {
        Start-Sleep -Milliseconds 500

        if ($serverProcess.HasExited) {
            throw "Le serveur RAG s’est arrêté pendant son démarrage (code $($serverProcess.ExitCode))."
        }

        if (Test-RagApi -Port $selectedPort) {
            $ready = $true
            break
        }
    }

    if (-not $ready) {
        throw 'Le serveur RAG n’a pas répondu après 30 secondes.'
    }

    $url = "http://127.0.0.1:$selectedPort/?server=rag-v2"
    Write-Host ''
    Write-Host 'Bibliothèque Savante V2 prête.' -ForegroundColor Green
    Write-Host "Adresse : $url" -ForegroundColor Green
    Write-Host 'Fermez cette fenêtre ou utilisez Ctrl+C pour arrêter le serveur.' -ForegroundColor DarkGray
    Write-Host ''

    if (-not $NoBrowser) {
        Start-Process $url
    }

    Wait-Process -Id $serverProcess.Id
}
finally {
    if ($serverProcess -and -not $serverProcess.HasExited) {
        Stop-Process -Id $serverProcess.Id -Force -ErrorAction SilentlyContinue
    }
}
