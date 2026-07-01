import React, { useState, useEffect } from "react";
import { useProducts } from "../../context/ProductContext";
import { Product } from "../../types";
import { Save } from "lucide-react";

interface ProductFormProps {
  editingProduct?: Product | null;
  onCancel: () => void;
  onSaveSuccess: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  editingProduct,
  onCancel,
  onSaveSuccess,
}) => {
  const { categories, addProduct, updateProduct, addCategory } = useProducts();

  // Estados dos campos do formulário
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [priceInput, setPriceInput] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // Estado para adicionar nova categoria rápida
  const [showAddCat, setShowAddCat] = useState(false);
  const [newCatName, setNewCatName] = useState("");

  // Preenche os campos se estiver editando
  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setDescription(editingProduct.description);
      setCategory(editingProduct.category);
      setPriceInput(editingProduct.price !== undefined ? editingProduct.price.toString() : "");
      setImageUrl(editingProduct.imageUrl);
    } else {
      setName("");
      setDescription("");
      setCategory(categories[0]?.slug || "");
      setPriceInput("");
      setImageUrl("");
    }
  }, [editingProduct, categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !description.trim() || !category) {
      alert("Por favor, preencha os campos obrigatórios (*).");
      return;
    }

    const price = priceInput.trim() !== "" ? parseFloat(priceInput) : undefined;
    if (price !== undefined && isNaN(price)) {
      alert("Por favor, insira um preço válido ou deixe vazio.");
      return;
    }

    const productData = {
      name: name.trim(),
      description: description.trim(),
      category,
      price,
      imageUrl: imageUrl.trim() || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80", // Fallback de imagem
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
    } else {
      addProduct(productData);
    }

    onSaveSuccess();
  };

  const handleAddCategorySubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    addCategory(newCatName.trim());
    
    // Define a categoria ativa como a nova categoria criada (gerando o slug dela)
    const newSlug = newCatName
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
      
    setCategory(newSlug);
    setNewCatName("");
    setShowAddCat(false);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 max-w-2xl mx-auto shadow-xs">
      <h2 className="text-xl font-bold text-slate-800 mb-6">
        {editingProduct ? "Editar Produto" : "Cadastrar Novo Produto"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nome do Produto */}
        <div>
          <label htmlFor="prod-name" className="block text-sm font-bold text-slate-700 mb-2">
            Nome do Produto *
          </label>
          <input
            type="text"
            id="prod-name"
            required
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
            placeholder="Ex: Detergente de Limão 5L"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Categoria do Produto */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="prod-category" className="block text-sm font-bold text-slate-700">
              Categoria *
            </label>
            <button
              type="button"
              onClick={() => setShowAddCat(!showAddCat)}
              className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1 cursor-pointer"
            >
              {showAddCat ? "Cancelar" : "+ Nova Categoria"}
            </button>
          </div>

          {showAddCat ? (
            <div className="flex gap-2 mb-3 animate-fade-in">
              <input
                type="text"
                className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                placeholder="Nome da categoria"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
              />
              <button
                type="button"
                onClick={handleAddCategorySubmit}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-colors cursor-pointer"
              >
                Criar
              </button>
            </div>
          ) : null}

          <select
            id="prod-category"
            required
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors cursor-pointer"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="" disabled>Selecione uma categoria</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Preço do Produto */}
        <div>
          <label htmlFor="prod-price" className="block text-sm font-bold text-slate-700 mb-2">
            Preço (R$) <span className="text-slate-400 font-normal text-xs">(Deixe vazio para "Sob Consulta")</span>
          </label>
          <input
            type="number"
            id="prod-price"
            step="0.01"
            min="0"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
            placeholder="Ex: 29.90 (vazio = Sob Consulta)"
            value={priceInput}
            onChange={(e) => setPriceInput(e.target.value)}
          />
        </div>

        {/* URL da Foto */}
        <div>
          <label htmlFor="prod-image" className="block text-sm font-bold text-slate-700 mb-2">
            URL da Foto do Produto
          </label>
          <input
            type="url"
            id="prod-image"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
            placeholder="Passe a URL da imagem. Ex: https://images.unsplash.com/..."
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          {imageUrl && (
            <div className="mt-3 aspect-16/9 rounded-xl overflow-hidden border border-slate-100 bg-slate-50 relative group">
              <img
                src={imageUrl}
                alt="Pré-visualização"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80";
                }}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-xs font-semibold">Pré-visualização da Imagem</span>
              </div>
            </div>
          )}
        </div>

        {/* Descrição Detalhada */}
        <div>
          <label htmlFor="prod-desc" className="block text-sm font-bold text-slate-700 mb-2">
            Descrição Detalhada *
          </label>
          <textarea
            id="prod-desc"
            required
            rows={4}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors resize-y leading-relaxed"
            placeholder="Descreva as especificações do produto, quantidade, rendimento..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Botões do Formulário */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-sm transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>Salvar Produto</span>
          </button>
        </div>
      </form>
    </div>
  );
};
