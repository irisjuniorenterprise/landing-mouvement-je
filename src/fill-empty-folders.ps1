# Définir le dossier racine (par défaut = dossier courant)
$root = Get-Location

# Récupérer tous les dossiers (du plus profond au plus haut)
$dirs = Get-ChildItem -Path $root -Directory -Recurse | Sort-Object FullName -Descending

foreach ($dir in $dirs) {
    # Vérifier si le dossier est vide (en ignorant .gitkeep)
    $isEmpty = -not (Get-ChildItem -Path $dir.FullName -Force | Where-Object {
        $_.Name -ne ".gitkeep"
    })

    if ($isEmpty) {
        $gitkeepPath = Join-Path $dir.FullName ".gitkeep"

        # Créer le fichier .gitkeep s'il n'existe pas déjà
        if (-not (Test-Path $gitkeepPath)) {
            New-Item -ItemType File -Path $gitkeepPath | Out-Null
            Write-Host ".gitkeep created in: $($dir.FullName)"
        }
    }
}

Write-Host "Done!"