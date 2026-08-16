param(
    [Parameter(Mandatory = $false)]
    [ValidateRange(1, 8)]
    [int]$Batch = 1,

    [Parameter(Mandatory = $false)]
    [ValidateNotNullOrEmpty()]
    [string]$Reviewer = "avishka",

    [Parameter(Mandatory = $false)]
    [ValidateRange(1024, 65535)]
    [int]$Port = 8765
)

$ErrorActionPreference = "Stop"

$RagDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$BatchId = "{0:D2}" -f $Batch
$Pool = Join-Path $RagDir "data\v63d-review-batches\v63d-review-batch-$BatchId.csv"
$Db = Join-Path $RagDir "data\v63d-review-$BatchId.sqlite"
$Output = Join-Path $RagDir "data\v63d-annotations-$BatchId.csv"
$App = Join-Path $RagDir "v63d_review_app.py"

if (-not (Test-Path $Pool)) {
    Write-Host "Lot V6.3-D introuvable : $Pool" -ForegroundColor Red
    Write-Host "Décompresse d'abord l'artifact athar-human-gold-v63d-review-batches dans rag\data\v63d-review-batches\." -ForegroundColor Yellow
    exit 2
}

if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Host "Python n'est pas disponible dans le PATH." -ForegroundColor Red
    exit 2
}

Write-Host "Athar V6.3-D — lot $BatchId" -ForegroundColor Cyan
Write-Host "Reviewer : $Reviewer"
Write-Host "Pool     : $Pool"
Write-Host "Sortie   : $Output"
Write-Host "La progression est sauvegardée après chaque clic."
Write-Host ""

& python $App `
    --pool $Pool `
    --reviewer $Reviewer `
    --db $Db `
    --output $Output `
    --port $Port

exit $LASTEXITCODE
