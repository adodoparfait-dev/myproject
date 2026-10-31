# LeBonResto — prototype

Prototype codé (React/TypeScript/Tailwind) pour visualiser le concept d'une
alternative locale à Uber Eats / Deliveroo pour les restaurants lyonnais :
page vitrine par restaurant, commande en click & collect sans commission,
et une formule d'abonnement pour les restaurateurs.

**Ce prototype sert à visualiser et démontrer le concept** — il ne remplace
pas la plateforme réelle, qui doit tourner sur Odoo (site, boutique,
emailing, facturation) sans développement sur-mesure. Utile pour :

- se projeter sur le parcours client et restaurateur avant de construire sur Odoo
- avoir un support visuel pour démarcher un restaurant pilote
- tester l'expérience de commande en click & collect

## Pages

- **Accueil** — pitch, problème/solution, avantages
- **Restaurants** — liste filtrable par quartier et type de cuisine
- **Détail restaurant** — menu, panier, commande en click & collect (mock, aucun paiement réel)
- **Comment ça marche** — parcours client et parcours restaurateur
- **Rejoindre la plateforme** — formules tarifaires et formulaire de contact (mock)

Toutes les données (restaurants, menus) sont statiques et fictives, dans
`src/data/restaurants.ts`.

## Démarrer

```bash
npm install
npm run dev
```

## Build de production

```bash
npm run build
```
