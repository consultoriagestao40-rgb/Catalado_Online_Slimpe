export interface Product {
  id: string;
  name: string;
  description: string;
  price?: number; // Opcional, se ausente será exibido como "Sob Consulta"
  category: string;
  imageUrl: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}
