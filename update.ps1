# Polski Szlak - Update einspielen (wird von update.bat aufgerufen)
# Sucht die neueste PolskiSzlak*.zip in Downloads / Desktop / Cowork, entpackt sie und
# ueberschreibt die Projektdateien in diesem Ordner. Eigene Dateien bleiben erhalten.
$ErrorActionPreference = 'Stop'
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$orte = @("$env:USERPROFILE\Downloads", "$env:USERPROFILE\Desktop", "$env:USERPROFILE\Desktop\Cowork", "$env:USERPROFILE\OneDrive\Desktop\Cowork") | Where-Object { Test-Path $_ }
$zip = Get-ChildItem -Path $orte -Filter 'PolskiSzlak*.zip' -File -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending | Select-Object -First 1
if (-not $zip) {
  Write-Host "Keine PolskiSzlak.zip gefunden." -ForegroundColor Yellow
  Write-Host "Im Chat auf die Datei PolskiSzlak.zip klicken (landet in Downloads), dann update.bat nochmal starten."
  exit 1
}
Write-Host ("Gefunden: {0}  ({1:dd.MM.yyyy HH:mm})" -f $zip.FullName, $zip.LastWriteTime)
$tmp = Join-Path $env:TEMP 'polski_update'
if (Test-Path $tmp) { Remove-Item $tmp -Recurse -Force }
Expand-Archive -LiteralPath $zip.FullName -DestinationPath $tmp -Force
$src = Join-Path $tmp 'PolskiSzlak'
if (-not (Test-Path (Join-Path $src 'index.html'))) { Write-Host "Die Zip ist nicht Polski Szlak. Nichts veraendert." -ForegroundColor Red; exit 1 }
$n = 0
Get-ChildItem -Path $src -Recurse -File | ForEach-Object {
  $rel = $_.FullName.Substring($src.Length + 1)
  if ($rel -in @('update.bat', 'update.ps1')) { return }
  $ziel = Join-Path $here $rel
  New-Item -ItemType Directory -Force -Path (Split-Path -Parent $ziel) | Out-Null
  Copy-Item -LiteralPath $_.FullName -Destination $ziel -Force
  $n++
}
Remove-Item $tmp -Recurse -Force
Write-Host "$n Dateien aktualisiert." -ForegroundColor Green
$prot = Join-Path $here 'docs\AENDERUNGSPROTOKOLL.md'
if (Test-Path $prot) { (Select-String -Path $prot -Pattern '^## \d' | Select-Object -First 1).Line | Write-Host }
exit 0
