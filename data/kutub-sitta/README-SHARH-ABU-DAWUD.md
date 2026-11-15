# Parcours de Sharh — Sunan Abî Dâwûd

## Objet

Ce module est accessible dans **Hadiths → Kutub as-Sitta → Sunan Abî Dâwûd → Étudier le Sharh**. Son interface réutilise les fonctionnalités éprouvées de l'ancien cours d'Usûl al-Fiqh tout en privilégiant une présentation plus sobre : programme, lecteur, sommaire, notes et progression locale.

Il ne remplace pas les 50 hadiths du recueil ni leur lecteur bilingue.

## Leçon initiale

Une seule vidéo a été communiquée pour ce parcours :

- URL source : https://youtu.be/14JeEI318Xc?si=HR3zMvUSzO0OqzGY
- Identifiant vidéo : `14JeEI318Xc`
- Intégration à la demande : `https://www.youtube-nocookie.com/embed/14JeEI318Xc`

**Limite de vérification :** le titre YouTube, le nom de l'intervenant, la correspondance précise avec Sunan Abî Dâwûd et le contenu oral n'ont pas pu être vérifiés automatiquement. Le programme indique donc simplement **« Leçon 01 — cours vidéo »** : aucune transcription, citation, traduction ni explication fictive n'a été produite. L'association au recueil est fondée sur le contexte de la demande, non sur une vérification de la vidéo.

Avant de publier des résumés, chapitres, marqueurs temporels ou fiches de révision, contrôler le sujet exact, l'enseignant et la série sur YouTube.

## Fonctionnalités

- Page d'accueil du cours avec liste des leçons et recherche.
- Reprise de la dernière leçon et marquage « terminée ».
- Lecteur vidéo intégré **uniquement après clic**, avec lien externe de secours.
- Affichage en petite fenêtre flottante sans recréer l'iframe lors du changement de mode.
- Notes par leçon et progression sauvegardées dans `localStorage` sous `athar_sharh_abu_dawud_v1`.
- Sommaire, navigation entre leçons préparée pour des ajouts futurs, interface mobile et thème sombre.
- Repères méthodologiques éditoriaux explicitement distincts du contenu de la vidéo.

**Confidentialité :** les notes ne sont pas envoyées à Athar. Le chargement volontaire du lecteur YouTube est susceptible d'impliquer une connexion au service externe selon ses propres règles.

## Ajouter une leçon

Modifier `sharh_course_data.js` et ajouter un objet avec un identifiant distinct, `number`, `title`, `subtitle`, `videoId` et `videoUrl`. S'assurer au préalable du contenu réel et de l'auteur. Ne pas déduire les parties de l'ouvrage, les positions de l'enseignant ou des explications à partir d'un lien seul.

## Tests

Les contrôles statiques incluent `scripts/validate-sharh-study.js`. Le test navigateur vérifie l'accès au cours depuis Abî Dâwûd, le chargement volontaire du lecteur, le mode flottant, les notes, la progression et le retour au recueil.
