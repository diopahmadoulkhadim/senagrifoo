# 🇸🇳 SEN-AGRI-FOOD

## Le goût du Sénégal, directement chez vous.

### 📝 Description

Sen-Agri-Food (siège à Touba, Sénégal) est une boutique en ligne de **produits locaux sénégalais transformés**, livrés partout dans le monde : bissap, bouye, boissons traditionnelles, mélanges (accras, beignets, neuteuri), snacks et huile de baobab.

### 💻 Technologies

- HTML5, CSS3 + Bootstrap 5, JavaScript ES6+ (sans framework, sans serveur)
- Catalogue dans `data/products.js`
- localStorage (panier, favoris, commandes, messages)

### 📁 Structure du projet

```
index.html        Accueil (produits populaires, catégories)
boutique.html     Boutique : recherche, filtres par catégorie, tri
produits.html     Catalogue complet ; produits.html?id=3 = fiche produit
panier.html       Panier (quantités, totaux, livraison)
commande.html     Commande (envoyée sur WhatsApp)
favoris.html      Produits favoris
contact.html      Formulaire de contact
css/style.css     Feuille de style unique (chargée par toutes les pages)
data/products.js  Catalogue produits (à modifier pour ajouter/changer un produit)
js/app.js         Fonctions communes (stockage, compteurs, notifications)
js/products.js    Affichage produits, filtres, ajout panier, favoris
js/cart.js        Page panier
js/checkout.js    Page commande
js/favorites.js   Page favoris
js/contact.js     Formulaire de contact
images/           Logo, photo d'accueil, photos produits
```

### 🎨 Identité visuelle

- **Couleur principale** : Vert #176B55
- **Accent** : Or #E0A11A
- **Typographies** : Montserrat (titres) + Poppins (textes)

### ✨ Fonctionnalités

- Catalogue, recherche (sans accents), filtres par catégorie, tri ; cartes produit épurées (image, nom, prix), clic sur la carte = fiche produit
- Fiche produit détaillée (mode d'emploi, DLC, suggestions)
- Panier interactif : quantités, stock, livraison offerte dès 10 000 FCFA (sinon 1 000 FCFA)
- Favoris
- Commande avec validation (téléphone sénégalais) : le récapitulatif est envoyé **directement sur le WhatsApp de la gérante** (76 824 88 38)
- Formulaire de contact : le message s'ouvre dans WhatsApp, vers le même numéro
- Responsive (mobile, tablette, ordinateur)

### 🚀 Installation

1. Télécharger le projet
2. Ouvrir `index.html` dans un navigateur (aucun serveur nécessaire)

### 📝 Notes importantes

- Livraison partout dans le monde : le tarif fixe du panier (1 000 FCFA, gratuit dès 10 000 FCFA) est indicatif ; pour l'international, la gérante confirme les frais sur WhatsApp.
- Il n'y a pas de paiement en ligne : la gérante confirme commande, paiement et livraison avec le client sur WhatsApp.
- Le numéro WhatsApp se change à un seul endroit : `WHATSAPP_NUMBER` en haut de `js/app.js` (et le texte du pied de page / de `contact.html`).
- Réseaux sociaux : Instagram `sen_agri_food_officiel` et TikTok `@senagrifood` (pied de page et page Contact).
- À personnaliser avant publication : e-mail et horaires (valeurs d'exemple) et `stock` de chaque produit dans `data/products.js` (valeur provisoire de 50).

### 👨‍💻 Auteur

Élève au centre de formation Ndartech — Saint-Louis, Sénégal

### 📅 Date

Septembre 2026
