import React from "react";
import { Category, Product } from "../../types";
import { ChevronDown } from "lucide-react";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categorySlug: string) => void;
  products: Product[]; // Para contagem de itens por categoria
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  products,
}) => {
  // Função para contar produtos por categoria
  const getProductCount = (categorySlug: string) => {
    if (!categorySlug) return products.length;
    return products.filter((p) => p.category === categorySlug).length;
  };

  return (
    <div className="w-full flex flex-col items-center max-w-sm mx-auto px-4">
      <label htmlFor="category-select" className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
        Filtrar por Categoria
      </label>
      <div className="relative w-full">
        <select
          id="category-select"
          value={selectedCategory}
          onChange={(e) => onSelectCategory(e.target.value)}
          className="w-full pl-5 pr-12 py-3.5 bg-white border border-slate-200 rounded-2xl text-slate-700 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none cursor-pointer shadow-xs hover:border-slate-300"
        >
          <option value="">Todas as Categorias ({getProductCount("")})</option>
          {categories.map((category) => (
            <option key={category.id} value={category.slug}>
              {category.name} ({getProductCount(category.slug)})
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <ChevronDown className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};
