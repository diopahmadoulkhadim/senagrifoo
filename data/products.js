/* ============================================================
   SEN-AGRI-FOOD — Catalogue produits
   Fichier chargé par <script> : fonctionne aussi en ouvrant le site
   directement (file://), contrairement à fetch('products.json').
   Pour ajouter un produit : copier un bloc, changer l'id et l'image.
   `stock` est une valeur provisoire à ajuster.
   ============================================================ */
const CATEGORIES = {
    bissap: 'Bissap',
    bouye: 'Bouye',
    boissons: 'Boissons',
    epices: 'Épices & Mélanges',
    snacks: 'Snacks',
    huiles: 'Huiles'
};

const PRODUCTS = [
    {
        id: 1, name: 'Bissap Menthe', category: 'bissap', price: 2500, unit: '250 g', stock: 50,
        image: 'bissap.jpeg', badge: 'Meilleure vente', isPopular: true, dlc: '12/2027',
        description: "Poudre d'hibiscus rouge infusée à la menthe et à la citronnelle. Une boisson rafraîchissante aux saveurs authentiques du Sénégal.",
        usage: "Versez la poudre dans 7 L d'eau chaude, laissez infuser 30 minutes, filtrez et sucrez."
    },
    {
        id: 2, name: 'Poudre de Bouye', category: 'bouye', price: 2500, unit: '400 g', stock: 50,
        image: 'bouy.jpeg', badge: '100% Naturel', isPopular: true, dlc: '12/2027',
        description: "Poudre de fruit de baobab 100% naturelle, riche en vitamine C et en antioxydants.",
        usage: "Versez la poudre dans 4 L d'eau tiède, mixez, sucrez, ajoutez du lait et de la vanille, puis placez au frais."
    },
    {
        id: 3, name: 'Wass Bouye', category: 'boissons', price: 3000, unit: '125 g', stock: 50,
        image: 'wass.jpeg', badge: 'Coup de cœur', isPopular: true, dlc: '12/2027',
        description: "Infusion traditionnelle à base de bouye, gingembre, clou de girofle, citron, menthe et citronnelle. Renforce l'immunité, facilite la digestion et apporte énergie et bien-être.",
        usage: "À consommer chaud ou froid."
    },
    {
        id: 4, name: "Poudre d'Accra", category: 'epices', price: 2500, unit: '500 g', stock: 50,
        image: 'accra.jpeg', badge: 'Nouveauté', isPopular: false, dlc: '12/2027',
        description: "Mélange d'épices et de légumes déshydratés pour préparer des accras croustillants. Un délice sénégalais authentique.",
        usage: "Ajoutez de l'eau et du sel, laissez reposer, puis faites frire dans l'huile chaude."
    },
    {
        id: 5, name: 'Poudre de Beignet Dougoup', category: 'epices', price: 2000, unit: '1 kg', stock: 50,
        image: 'beignet.jpeg', badge: 'Tradition', isPopular: false, dlc: '12/2027',
        description: "Mélange prêt à l'emploi pour réaliser de délicieux beignets Dougoup. Composé de farine de mil, farine de blé, levure et muscade.",
        usage: "Ajoutez 400 ml d'eau et du sucre, laissez reposer 15 minutes, puis faites frire."
    },
    {
        id: 6, name: 'Mbouraké Mbeeté', category: 'snacks', price: 2500, unit: '500 g', stock: 50,
        image: 'mbrourake.jpeg', badge: 'Gourmandise', isPopular: false, dlc: '12/2027',
        description: "Une délicieuse préparation à base de pain sec, de pâte d'arachide, de chocolat et de sucre. Une gourmandise sénégalaise authentique, parfaite pour le goûter.",
        usage: "Se déguste telle quelle, en snack."
    },
    {
        id: 7, name: 'Poudre Neuteuri', category: 'epices', price: 2500, unit: '500 g', stock: 50,
        image: 'neutri.jpeg', badge: 'Naturel', isPopular: false, dlc: '12/2027',
        description: "Mélange nutritif à base de pâte d'arachides et de poudre de bouye (fruit du baobab). Une boisson énergétique naturelle.",
        usage: "Versez dans 1,5 L d'eau et mélangez jusqu'à obtention d'une texture homogène."
    },
    {
        id: 8, name: 'Huile de Baobab', category: 'huiles', price: 1500, unit: '100 ml', stock: 50,
        image: 'huile.jpeg', badge: 'Premium', isPopular: true, dlc: '12/2027',
        description: "Huile 100% pure pressée à froid. Riche en vitamines A, D, E ainsi qu'en Oméga 3, 6 et 9. Nourrit, répare et protège la peau et les cheveux.",
        usage: "Idéale pour les soins corporels et capillaires."
    }
];
