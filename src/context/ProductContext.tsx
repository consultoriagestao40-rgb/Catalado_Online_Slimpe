import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, Category } from "../types";

interface ProductContextType {
  products: Product[];
  categories: Category[];
  loading: boolean;
  addProduct: (product: Omit<Product, "id" | "createdAt">) => Promise<void>;
  updateProduct: (id: string, product: Omit<Product, "id" | "createdAt">) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addCategory: (name: string) => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Carrega os dados reais do banco de dados (Neon PostgreSQL) via rotas de API do Vercel
  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [resProducts, resCategories] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/categories")
      ]);

      if (resProducts.ok && resCategories.ok) {
        const prodData = await resProducts.json();
        const catData = await resCategories.json();
        setProducts(prodData);
        setCategories(catData);
      } else {
        console.error("Falha ao carregar dados da API");
      }
    } catch (err) {
      console.error("Erro ao conectar com API do banco:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const addProduct = async (productData: Omit<Product, "id" | "createdAt">) => {
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        const newProduct = await response.json();
        setProducts((prev) => [newProduct, ...prev]);
      } else {
        const err = await response.json();
        alert(`Erro ao adicionar produto: ${err.error || "Desconhecido"}`);
      }
    } catch (error) {
      console.error(error);
      alert("Erro de conexão ao adicionar produto.");
    }
  };

  const updateProduct = async (id: string, productData: Omit<Product, "id" | "createdAt">) => {
    try {
      const response = await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...productData }),
      });

      if (response.ok) {
        const updatedProduct = await response.json();
        setProducts((prev) =>
          prev.map((prod) => (prod.id === id ? { ...prod, ...updatedProduct } : prod))
        );
      } else {
        const err = await response.json();
        alert(`Erro ao atualizar produto: ${err.error || "Desconhecido"}`);
      }
    } catch (error) {
      console.error(error);
      alert("Erro de conexão ao atualizar produto.");
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/products?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProducts((prev) => prev.filter((prod) => prod.id !== id));
      } else {
        const err = await response.json();
        alert(`Erro ao excluir produto: ${err.error || "Desconhecido"}`);
      }
    } catch (error) {
      console.error(error);
      alert("Erro de conexão ao excluir produto.");
    }
  };

  const addCategory = async (name: string) => {
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (response.ok) {
        const newCategory = await response.json();
        setCategories((prev) => [...prev, newCategory]);
      } else {
        const err = await response.json();
        alert(`Erro ao criar categoria: ${err.error || "Desconhecido"}`);
      }
    } catch (error) {
      console.error(error);
      alert("Erro de conexão ao criar categoria.");
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        loading,
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
