param(
  [string]$Text = 'Identity Confirm. Welcome User.'
)

$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$audioDirectory = Join-Path $projectRoot 'public/audio'
$outputPath = Join-Path $audioDirectory 'connection-voice.wav'
$rawPath = Join-Path ([System.IO.Path]::GetTempPath()) ('intro-voice-' + [guid]::NewGuid().ToString('N') + '.wav')
$node = (Get-Command node -ErrorAction Stop).Source
$voice = $null
$stream = $null

try {
  $voice = New-Object -ComObject SAPI.SpVoice
  $englishVoice = @($voice.GetVoices()) | Where-Object {
    $_.GetDescription() -eq 'Microsoft Zira Desktop - English (United States)'
  } | Select-Object -First 1
  if (-not $englishVoice) {
    throw 'Install the Microsoft Zira English desktop voice before regenerating this clip.'
  }
  $voice.Voice = $englishVoice
  $voice.Rate = 0
  $voice.Volume = 100
  $stream = New-Object -ComObject SAPI.SpFileStream
  $stream.Format.Type = 22
  $stream.Open($rawPath, 3, $false)
  $voice.AudioOutputStream = $stream
  $escapedText = [System.Security.SecurityElement]::Escape($Text)
  $null = $voice.Speak('<pitch absmiddle="-3">' + $escapedText + '</pitch>', 8)
  $stream.Close()
  $null = New-Item -ItemType Directory -Path $audioDirectory -Force

  & $node (Join-Path $PSScriptRoot 'process-intro-voice.mjs') $rawPath $outputPath
  if ($LASTEXITCODE -ne 0) { throw 'Failed to process the intro voice.' }
  Write-Output ('Generated ' + $outputPath)
} finally {
  if ($stream) {
    try { $stream.Close() } catch { }
    [void][System.Runtime.InteropServices.Marshal]::FinalReleaseComObject($stream)
  }
  if ($voice) { [void][System.Runtime.InteropServices.Marshal]::FinalReleaseComObject($voice) }
  if (Test-Path -LiteralPath $rawPath) { Remove-Item -LiteralPath $rawPath -ErrorAction SilentlyContinue }
}
