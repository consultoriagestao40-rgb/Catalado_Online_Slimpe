import React, { useState, useMemo } from "react";
import { useProducts } from "../../context/ProductContext";
import { Product } from "../../types";
import { Edit2, Trash2, Search } from "lucide-react";

interface ProductListProps {
  onEdit: (product: Product) => void;
}

export const ProductList: React.FC<ProductListProps> = ({ onEdit }) => {
  const { products, categories, deleteProduct } = useProducts();
  
  // Estado para busca rápida interna do admin
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCat, setSelectedCat] = useState("");

  const handleConfirmDelete = (id: string, name: string) => {
    if (confirm(`Tem certeza de que deseja excluir o produto "${name}"?`)) {
      deleteProduct(id);
    }
  };

  // Mapeia categorias por slug para exibir o nome formatado na tabela
  const categoryNames = useMemo(() => {
    const map: Record<string, string> = {};
    categories.forEach((cat) => {
      map[cat.slug] = cat.name;
    });
    return map;
  }, [categories]);

  // Filtra itens na lista administrativa
  const filteredList = useMemo(() => {
    return products.filter((prod) => {
      const matchesSearch = prod.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            prod.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat = selectedCat ? prod.category === selectedCat : true;
      return matchesSearch && matchesCat;
    });
  }, [products, searchTerm, selectedCat]);

  return (
    <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xs">
      {/* Filtros e Busca no Admin */}
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50/50">
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            placeholder="Buscar nos produtos cadastrados..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <select
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 focus:outline-none cursor-pointer"
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
          >
            <option value="">Todas as categorias</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista / Tabela */}
      {filteredList.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-50/30">
                <th className="py-4 px-6">Produto</th>
                <th className="py-4 px-6">Categoria</th>
                <th className="py-4 px-6 text-right">Preço</th>
                <th className="py-4 px-6 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.map((product) => {
                const formattedPrice = product.price !== undefined
                  ? product.price.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })
                  : "Sob Consulta";

                return (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Thumbnail + Nome */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-12 w-12 rounded-lg object-cover bg-slate-100 border border-slate-100"
                          loading="lazy"
                        />
                        <div>
                          <div className="font-bold text-slate-800 line-clamp-1">{product.name}</div>
                          <div className="text-xs text-slate-400 line-clamp-1 max-w-sm">
                            {product.description}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Categoria */}
                    <td className="py-4 px-6">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                        {categoryNames[product.category] || product.category}
                      </span>
                    </td>

                    {/* Preço */}
                    <td className="py-4 px-6 text-right">
                      <span className={`font-bold ${
                        product.price !== undefined ? "text-slate-800" : "text-amber-600 text-xs"
                      }`}>
                        {formattedPrice}
                      </span>
                    </td>

                    {/* Ações */}
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onEdit(product)}
                          id={`edit-btn-${product.id}`}
                          title="Editar produto"
                          className="p-2 rounded-lg border border-slate-100 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 hover:border-emerald-100 transition-colors cursor-pointer"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleConfirmDelete(product.id, product.name)}
                          id={`delete-btn-${product.id}`}
                          title="Excluir produto"
                          className="p-2 rounded-lg border border-slate-100 text-slate-600 hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* Sem itens correspondentes */
        <div className="text-center py-16 px-6">
          <p className="text-sm text-slate-400">Nenhum produto cadastrado com os termos buscados.</p>
        </div>
      )}
    </div>
  );
};
