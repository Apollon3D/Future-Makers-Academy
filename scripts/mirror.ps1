# Continuously mirrors the project source into the Google Drive Apps folder,
# so the Drive copy is always a current source backup.
# node_modules / .git / .vite / dist are intentionally NOT mirrored
# (Google Drive's virtual filesystem can't host them and breaks npm).
param(
  [string]$Source = "C:\Users\lucas\Projects\3DPrintingAcademy",
  [string]$Dest   = "G:\My Drive\Apollon3D\Apps\Future Makers Academy",
  [int]$IntervalSeconds = 2
)

$excludeDirs  = @("node_modules", ".git", ".vite", "dist", "dist-ssr", ".claude", "build")
$excludeFiles = @("*.log", "*.tmp", "*.local")

Write-Host "Mirroring`n  $Source`n  -> $Dest`n(every $IntervalSeconds s; Ctrl+C to stop)`n"

while ($true) {
  robocopy $Source $Dest /MIR /FFT /R:2 /W:2 /NFL /NDL /NJH /NJS /NP `
    /XD $excludeDirs /XF $excludeFiles | Out-Null
  $code = $LASTEXITCODE
  if ($code -ge 8) { Write-Host "[mirror] robocopy reported errors (code $code)" -ForegroundColor Yellow }
  elseif ($code -gt 0) { Write-Host ("[mirror] synced changes @ {0:HH:mm:ss}" -f (Get-Date)) -ForegroundColor DarkGray }
  Start-Sleep -Seconds $IntervalSeconds
}
