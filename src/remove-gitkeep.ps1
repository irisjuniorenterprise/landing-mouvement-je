# Définir le dossier racine (par défaut = dossier courant)
$root = Get-Location

# Récupérer tous les fichiers .gitkeep (y compris cachés) de manière récursive
$gitkeepFiles = Get-ChildItem -Path $root -Recurse -Force -Filter ".gitkeep"

foreach ($file in $gitkeepFiles) {
    Remove-Item -Path $file.FullName -Force
    Write-Host ".gitkeep supprimé : $($file.FullName)"
}

Write-Host "Terminé ! Tous les fichiers .gitkeep ont été effacés."