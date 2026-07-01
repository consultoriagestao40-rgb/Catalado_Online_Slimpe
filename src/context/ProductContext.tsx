import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, Category } from "../types";

interface ProductContextType {
  products: Product[];
  categories: Category[];
  addProduct: (product: Omit<Product, "id" | "createdAt">) => void;
  updateProduct: (id: string, product: Omit<Product, "id" | "createdAt">) => void;
  deleteProduct: (id: string) => void;
  addCategory: (name: string) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Categorias padrão inicial
const INITIAL_CATEGORIES: Category[] = [
  { id: "1", name: "Limpeza Geral", slug: "limpeza-geral" },
  { id: "2", name: "Higiene & Cuidados", slug: "higiene-cuidados" },
  { id: "3", name: "Descartáveis", slug: "descartaveis" },
  { id: "4", name: "Utensílios & Acessórios", slug: "utensilios-acessorios" },
];

// Produtos padrão inicial para a Slimpe (com imagens reais e de alta qualidade do Unsplash)
const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Detergente Multiuso Concentrado",
    description: "Detergente de alta performance com alto poder desengordurante. Ideal para cozinhas industriais e superfícies gerais. Rende até 50 litros.",
    price: 38.90,
    category: "limpeza-geral",
    imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80",
    createdAt: new Date().toISOString()
  },
  {
    id: "prod-2",
    name: "Desinfetante Perfumado Lavanda",
    description: "Desinfetante concentrado de lavanda. Deixa um perfume duradouro e elimina 99.9% dos germes e bactérias. Embalagem de 5 litros.",
    price: 29.90,
    category: "limpeza-geral",
    imageUrl: "https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=600&q=80",
    createdAt: new Date().toISOString()
  },
  {
    id: "prod-3",
    name: "Sabonete Líquido Erva Doce Premium",
    description: "Sabonete líquido hidratante com extrato de erva doce. Fórmula suave ideal para lavatórios corporativos de alto fluxo.",
    price: 18.50,
    category: "higiene-cuidados",
    imageUrl: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=600&q=80",
    createdAt: new Date().toISOString()
  },
  {
    id: "prod-4",
    name: "Álcool em Gel 70% Antisséptico",
    description: "Álcool em gel 70% com aloe vera para evitar ressecamento das mãos. Higienização rápida e eficiente. Galão de 5 litros.",
    price: 45.00,
    category: "higiene-cuidados",
    imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80",
    createdAt: new Date().toISOString()
  },
  {
    id: "prod-5",
    name: "Papel Toalha Interfolha Premium",
    description: "Papel toalha folha dupla, 100% celulose virgem. Máxima absorção e maciez. Caixa com 2400 folhas.",
    price: 64.90,
    category: "descartaveis",
    imageUrl: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=600&q=80",
    createdAt: new Date().toISOString()
  },
  {
    id: "prod-6",
    name: "MOP Giratório de Limpeza Profissional",
    description: "MOP Giratório com balde espremedor de alta durabilidade. Acompanha 2 refis de microfibra laváveis. Agiliza a limpeza de pisos lisos.",
    price: 129.90,
    category: "utensilios-acessorios",
    imageUrl: "https://images.unsplash.com/photo-1585421514738-ee184b245e3e?auto=format&fit=crop&w=600&q=80",
    createdAt: new Date().toISOString()
  },
  {
    id: "prod-7",
    name: "Pano de Microfibra Multiuso (Kit c/ 10)",
    description: "Panos de microfibra de alta absorção que não soltam fiapos. Perfeitos para limpeza de vidros, poeira e polimento. Cores sortidas.",
    price: 24.90,
    category: "utensilios-acessorios",
    imageUrl: "https://images.unsplash.com/photo-1610557892470-76d74759902c?auto=format&fit=crop&w=600&q=80",
    createdAt: new Date().toISOString()
  },
  {
    id: "prod-8",
    name: "Máscara de Proteção Tripla Descartável",
    description: "Máscara descartável com elástico e clipe nasal. Caixa com 50 unidades. Alta eficiência de filtragem bacteriana (BFE > 95%).",
    category: "descartaveis",
    // Sem preço cadastrado para demonstrar a regra de negócio "Sob Consulta"
    imageUrl: "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=600&q=80",
    createdAt: new Date().toISOString()
  }
];

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Carrega os dados iniciais do localStorage ou cria-os a partir dos mocks
  useEffect(() => {
    const storedProducts = localStorage.getItem("slimpe_products");
    const storedCategories = localStorage.getItem("slimpe_categories");

    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      setProducts(INITIAL_PRODUCTS);
      localStorage.setItem("slimpe_products", JSON.stringify(INITIAL_PRODUCTS));
    }

    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    } else {
      setCategories(INITIAL_CATEGORIES);
      localStorage.setItem("slimpe_categories", JSON.stringify(INITIAL_CATEGORIES));
    }
  }, []);

  // Salva no localStorage sempre que os produtos mudarem
  const saveProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem("slimpe_products", JSON.stringify(newProducts));
  };

  // Salva no localStorage sempre que as categorias mudarem
  const saveCategories = (newCategories: Category[]) => {
    setCategories(newCategories);
    localStorage.setItem("slimpe_categories", JSON.stringify(newCategories));
  };

  const addProduct = (productData: Omit<Product, "id" | "createdAt">) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    saveProducts([newProduct, ...products]);
  };

  const updateProduct = (id: string, productData: Omit<Product, "id" | "createdAt">) => {
    const updated = products.map((prod) =>
      prod.id === id
        ? { ...prod, ...productData } // mantém id e createdAt original
        : prod
    );
    saveProducts(updated);
  };

  const deleteProduct = (id: string) => {
    const filtered = products.filter((prod) => prod.id !== id);
    saveProducts(filtered);
  };

  const addCategory = (name: string) => {
    // Evita duplicados
    const slug = name
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // remove acentos
      .replace(/[^a-z0-9]+/g, "-") // substitui caracteres especiais por hífens
      .replace(/(^-|-$)+/g, ""); // remove hífens no início e fim

    if (categories.some((cat) => cat.slug === slug)) return;

    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      name: name.trim(),
      slug,
    };
    saveCategories([...categories, newCategory]);
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts deve ser usado dentro de um ProductProvider");
  }
  return context;
};
