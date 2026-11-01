# Memo

Application personnelle de prise de notes et de révision par répétition espacée.

## Fonctionnalités

- **Notes** en markdown, organisées par tags, avec aperçu de rendu.
- **Flashcards** avec planification par algorithme SM-2 (type Anki).
- **Génération automatique de flashcards** depuis une note via l'API Claude
  (nécessite ta propre clé API Anthropic, configurée dans Réglages).
- **Statistiques** : cartes dues, taux de rétention, série de jours, activité
  des 14 derniers jours.

Toutes les données (notes, cartes, historique de révisions) sont stockées
localement dans le navigateur (`localStorage`) — rien n'est envoyé à un
serveur, à l'exception des appels optionnels à l'API Anthropic pour la
génération de flashcards.

## Démarrer

```bash
npm install
npm run dev
```

## Build de production

```bash
npm run build
```
