export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number; // euros
  category: string;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  quartier: string;
  address: string;
  pitch: string;
  color: string; // accent hex for the restaurant's card/header
  pickupMinutes: number;
  menu: MenuItem[];
}

export const QUARTIERS = [
  "Vieux Lyon",
  "Presqu'île",
  "Croix-Rousse",
  "Part-Dieu",
  "Guillotière",
] as const;

export const CUISINES = [
  "Bouchon lyonnais",
  "Italien",
  "Street food",
  "Végétarien",
  "Pâtisserie",
] as const;

export const RESTAURANTS: Restaurant[] = [
  {
    id: "chez-the-rese",
    name: "Chez Thérèse",
    cuisine: "Bouchon lyonnais",
    quartier: "Vieux Lyon",
    address: "12 rue du Bœuf, 69005 Lyon",
    pitch: "Le bouchon familial depuis 1987 : quenelles, tablier de sapeur et vin en pichet.",
    color: "#3f2a18",
    pickupMinutes: 25,
    menu: [
      { id: "1", name: "Quenelle de brochet, sauce Nantua", description: "Servie avec riz pilaf", price: 16.5, category: "Plats" },
      { id: "2", name: "Tablier de sapeur", description: "Pané maison, sauce gribiche", price: 15, category: "Plats" },
      { id: "3", name: "Salade lyonnaise", description: "Lardons, œuf poché, croûtons", price: 12, category: "Entrées" },
      { id: "4", name: "Tarte à la praline", description: "Praline rose de la Croix-Rousse", price: 7, category: "Desserts" },
    ],
  },
  {
    id: "la-piadina-croix-rousse",
    name: "La Piadina des Pentes",
    cuisine: "Italien",
    quartier: "Croix-Rousse",
    address: "4 montée de la Grande-Côte, 69001 Lyon",
    pitch: "Pâtes fraîches et piadine roulées minute, par un couple d'anciens canuts passionnés.",
    color: "#1f6b3a",
    pickupMinutes: 15,
    menu: [
      { id: "1", name: "Tagliatelles au ragù", description: "Pâtes fraîches maison", price: 13, category: "Plats" },
      { id: "2", name: "Piadina burrata", description: "Burrata, roquette, tomates séchées", price: 10, category: "Plats" },
      { id: "3", name: "Bruschette (x3)", description: "Tomate basilic, tapenade, chèvre miel", price: 8, category: "Entrées" },
      { id: "4", name: "Tiramisu maison", description: "Recette de la nonna", price: 6, category: "Desserts" },
    ],
  },
  {
    id: "banh-mi-guillotiere",
    name: "Bánh Mì Guill'",
    cuisine: "Street food",
    quartier: "Guillotière",
    address: "27 rue Pasteur, 69007 Lyon",
    pitch: "Sandwichs vietnamiens croustillants, préparés devant vous en moins de 10 minutes.",
    color: "#a8542e",
    pickupMinutes: 10,
    menu: [
      { id: "1", name: "Bánh mì poulet caramel", description: "Coriandre, carotte, daikon, piment", price: 7.5, category: "Sandwichs" },
      { id: "2", name: "Bánh mì tofu grillé", description: "Version végétarienne", price: 7, category: "Sandwichs" },
      { id: "3", name: "Nems (x4)", description: "Sauce nuoc-mâm maison", price: 5, category: "Entrées" },
      { id: "4", name: "Thé glacé jasmin", description: "Infusé maison", price: 3, category: "Boissons" },
    ],
  },
  {
    id: "les-racines-presquile",
    name: "Les Racines",
    cuisine: "Végétarien",
    quartier: "Presqu'île",
    address: "18 rue de la République, 69002 Lyon",
    pitch: "Cuisine végétale et locavore, produits des maraîchers du Val de Saône.",
    color: "#3a6b1f",
    pickupMinutes: 20,
    menu: [
      { id: "1", name: "Bowl de saison", description: "Légumes rôtis, céréales, houmous maison", price: 14, category: "Plats" },
      { id: "2", name: "Soupe du marché", description: "Recette selon arrivage", price: 6.5, category: "Entrées" },
      { id: "3", name: "Burger de lentilles", description: "Pain brioché maison, frites patate douce", price: 13.5, category: "Plats" },
      { id: "4", name: "Cheesecake vegan citron", description: "Sans lactose", price: 6, category: "Desserts" },
    ],
  },
  {
    id: "patisserie-part-dieu",
    name: "Douceurs de la Part-Dieu",
    cuisine: "Pâtisserie",
    quartier: "Part-Dieu",
    address: "56 rue Garibaldi, 69003 Lyon",
    pitch: "Viennoiseries et entremets artisanaux, à commander la veille pour un retrait minute.",
    color: "#8a4b9e",
    pickupMinutes: 10,
    menu: [
      { id: "1", name: "Coussin de Lyon (x6)", description: "Ganache chocolat-curaçao, praline", price: 14, category: "Spécialités" },
      { id: "2", name: "Croissant au beurre", description: "Pur beurre AOP Charentes-Poitou", price: 1.7, category: "Viennoiseries" },
      { id: "3", name: "Tarte aux pralines roses", description: "Part individuelle", price: 4.5, category: "Desserts" },
      { id: "4", name: "Brioche aux pralines", description: "La part", price: 3.5, category: "Viennoiseries" },
    ],
  },
  {
    id: "le-bouchon-moderne",
    name: "Le Bouchon Moderne",
    cuisine: "Bouchon lyonnais",
    quartier: "Presqu'île",
    address: "9 rue des Marronniers, 69002 Lyon",
    pitch: "La tradition du bouchon revisitée par un jeune chef formé à l'Institut Paul Bocuse.",
    color: "#6b4423",
    pickupMinutes: 30,
    menu: [
      { id: "1", name: "Quenelle revisitée, bisque de homard", description: "Création maison", price: 19, category: "Plats" },
      { id: "2", name: "Andouillette AAAA", description: "Sauce moutarde à l'ancienne", price: 17, category: "Plats" },
      { id: "3", name: "Œufs meurette", description: "Sauce au vin rouge, pain grillé", price: 11, category: "Entrées" },
      { id: "4", name: "Quenelle sucrée, coulis framboise", description: "Dessert signature", price: 8, category: "Desserts" },
    ],
  },
];
