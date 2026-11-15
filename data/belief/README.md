# Apprentissage de la croyance — huitième rubrique publique

La rubrique **Apprentissage de la croyance** est un module autonome d'Athar, au même niveau que Hadiths, Al-Adhkâr et la Bibliothèque. Elle **n'a aucun rattachement à Sunan Abî Dâwûd**, ni à un autre livre de hadiths.

## Source initiale

L'utilisateur a fourni un fichier audio `videoplayback (3).m4a` dans la conversation du **15 novembre 2026** :

- Longueur mesurée avec ffprobe : **1593,307 s**, soit **26 min 33 s**.
- Format audio : AAC, 44,1 kHz, stéréo.
- Empreinte SHA-256 du fichier source : `75bb17da30fc6eaf3e985fae5a00c393e217ad2c93b6b19e6e6c21ee54fe9eee`.
- URL vidéo communiquée dans le contexte précédent : `https://youtu.be/14JeEI318Xc?si=HR3zMvUSzO0OqzGY`.

**Limite éditoriale importante :** les outils disponibles au moment de la création du module n'ont pas permis de produire une transcription textuelle fiable de la piste audio. Le fichier audio personnel n'a pas été rendu public dans ce dépôt. Le titre précis de la vidéo, son auteur et l'identité exacte audio/vidéo n'ont pas été vérifiés. Aucune citation, plan doctrinal, conclusion ni référence scripturaire n'est attribué à l'enseignant.

## Cours écrit et lexique

Le fichier `belief_course_data.js` contient pour chaque leçon les champs `transcript`, `transcriptStatus` et `sections`. La valeur de `transcriptStatus` reste `non_verifie` et `sections` demeure vide tant qu'un texte de transcription n'a pas été établi et relu.

Les cinq termes initiaux du lexique (ʿaqîda, îmân, tawhîd, dalîl, sharḥ) sont **des repères de vocabulaire généraux**, destinés à faciliter une première approche. Ils **ne sont pas présentés comme un relevé des mots prononcés**.

Pour remplir les fiches de cours :
1. Transcrire les propos réellement audibles en respectant l'ordre du cours, idéalement avec des repères temporels.
2. Distinguer clairement les paroles de l'enseignant, ses citations des textes et l'explication éditoriale.
3. Vérifier les références au Coran et aux hadiths auprès d'éditions identifiables avant de les afficher.
4. Ajouter chaque partie validée à `lessons[].sections` au format `{ heading: string, paragraphs: string[] }`.
5. En cas de passage inaudible, l'indiquer au lieu de combler le texte.

## Fonctionnement

- Huitième carte sur l'accueil, entrée du menu immersif et du menu mobile.
- Lecteur vidéo YouTube chargé **au clic**, avec lien externe de secours et petite fenêtre flottante.
- Zone de cours écrit, lexique, notes de cours et progression.
- Données personnelles sauvegardées uniquement dans `localStorage` sous `athar_belief_learning_v1`.
- Mise en page responsive en modes sombre et clair.

Les tests sont `scripts/validate-belief-learning.js` et `scripts/ux_public_release_browser_test.mjs`. Les données de hadiths existantes ne sont pas modifiées.
