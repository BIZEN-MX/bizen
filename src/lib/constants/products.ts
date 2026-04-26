export interface ProductDefinition {
    id: number;
    name: string;
    price: number;
    category: string;
}

export const OFFICIAL_PRODUCTS: ProductDefinition[] = [
    { id: 5, name: "Bolsa de Valores desde Cero", price: 350, category: "Ebooks" },
    { id: 6, name: "Inflación vs Rendimiento", price: 450, category: "Ebooks" },
    { id: 7, name: "Finanzas Personales desde Cero", price: 300, category: "Ebooks" },
    { id: 8, name: "El Costo de Esperar", price: 700, category: "Ebooks" },
    { id: 20, name: "Historia del Dinero", price: 400, category: "Ebooks" },
    { id: 9, name: "Calculadora de ROI", price: 500, category: "Herramientas" },
    { id: 10, name: "Planeador Financiero", price: 800, category: "Herramientas" },
    { id: 11, name: "Analizador de Riesgo", price: 650, category: "Herramientas" },
    { id: 15, name: "Insignia Pionero", price: 250, category: "Insignias" },
    { id: 16, name: "Maestro Finance", price: 800, category: "Insignias" },
    { id: 17, name: "Millennial Rico", price: 1200, category: "Insignias" },
];
