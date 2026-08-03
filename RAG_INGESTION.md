# Pipeline d’ingestion de la Bibliothèque Savante

La Bibliothèque Savante ne scrape jamais Kutub au moment où une question est posée. Les pages publiques autorisées sont synchronisées séparément, puis enregistrées dans la base locale d’Athar.

## Démarrer une synchronisation

Sous Windows :

```powershell
$env:ATHAR_BOT_CONTACT="votre-adresse@email.com"
.\sync-kutub.bat
```

Chaque lancement traite au maximum 25 nouvelles pages par ouvrage activé. Le collecteur :

- consulte `robots.txt` avant toute page ;
- utilise un User-Agent identifiable ;
- attend au minimum 1,25 seconde entre deux requêtes ;
- respecte `Retry-After` ;
- s’arrête sur une interdiction, un CAPTCHA ou une protection anti-bot ;
- reprend au premier trou réel de pagination ;
- retente en priorité les pages temporairement en erreur ;
- détecte les pages et passages dupliqués par empreinte SHA-256 ;
- ne supprime jamais les données déjà indexées.

## Synchroniser un seul ouvrage

```powershell
.\.venv-rag\Scripts\python.exe rag\ingest_kutub.py sync --book 21739 --batch-size 25
```

Plusieurs options `--book` peuvent être répétées.

## Voir l’état du corpus

```powershell
.\status-kutub.bat
```

Ou en JSON :

```powershell
.\.venv-rag\Scripts\python.exe rag\ingest_kutub.py status --json
```

L’API locale expose également :

```text
/api/rag/v2/ingestion
```

## États possibles d’une page

- `imported` : au moins un passage a été indexé ;
- `duplicate` : le contenu existe déjà ailleurs dans le même ouvrage ;
- `empty` : aucun texte suffisamment exploitable n’a été extrait ;
- `error` : erreur temporaire ou HTML inattendu ;
- `blocked` : robots.txt, refus HTTP ou protection anti-bot ;
- `skipped` : page volontairement ignorée après contrôle.

## Score de qualité

Le score de 0 à 100 tient compte de :

- la quantité de texte arabe ;
- la présence d’une traduction française ;
- le nombre de passages produits ;
- la détection d’un chapitre ou d’un titre.

Ce score mesure uniquement la qualité technique de l’extraction. Il ne certifie ni la traduction ni la valeur religieuse du contenu.

## Vérification éditoriale

Les traductions Kutub importées restent marquées `kutub_ai_unreviewed`. Elles doivent toujours être affichées avec le texte arabe et ne deviennent « relues » qu’après une vérification humaine explicite.

Les conditions publiques de Kutub décrivent leur contenu comme open source et demandent de préserver l’intégrité des œuvres et de citer Kutub. Le collecteur conserve donc l’URL exacte de chaque page et ne tente jamais de contourner une restriction d’accès.
