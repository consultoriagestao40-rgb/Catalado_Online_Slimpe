import React from "react";
import { Category, Product } from "../../types";

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
    <div className="w-full flex flex-col items-center">
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
        Filtrar por Categoria
      </span>
      <div className="flex flex-wrap justify-center gap-2 max-w-4xl px-4">
        {/* Opção "Todas" */}
        <button
          onClick={() => onSelectCategory("")}
          id="category-btn-all"
          className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
            selectedCategory === ""
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/10"
              : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
          }`}
        >
          <span>Todos os Itens</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              selectedCategory === ""
                ? "bg-emerald-500 text-white"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {getProductCount("")}
          </span>
        </button>

        {/* Categorias Dinâmicas */}
        {categories.map((category) => {
          const isSelected = selectedCategory === category.slug;
          const count = getProductCount(category.slug);
          
          return (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.slug)}
              id={`category-btn-${category.slug}`}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                isSelected
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/10"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <span>{category.name}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  isSelected
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
