$ErrorActionPreference = 'Stop'
$projectRoot = $PSScriptRoot
$nodeCommand = Get-Command node -ErrorAction SilentlyContinue
if ($nodeCommand) {
    $runtimePath = $nodeCommand.Source
} else {
    $runtimePath = Join-Path $env:LOCALAPPDATA 'Programs\Microsoft VS Code\Code.exe'
    if (-not (Test-Path -LiteralPath $runtimePath)) {
        throw 'Install Node.js, or open index.html directly in your browser.'
    }
    $env:ELECTRON_RUN_AS_NODE = '1'
}
Write-Host 'Portfolio preview: http://127.0.0.1:4173'
& $runtimePath (Join-Path $projectRoot 'tools\serve.cjs')
