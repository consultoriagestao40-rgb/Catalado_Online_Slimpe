import React, { useMemo, useState } from "react";
import { useProducts } from "../../context/ProductContext";
import { SearchBar } from "./SearchBar";
import { CategoryFilter } from "./CategoryFilter";
import { ProductCard } from "./ProductCard";
import { copyTextToClipboard } from "../../utils/whatsapp";
import { Copy, Check, RotateCcw, ArrowLeft, MessageCircle, Share2 } from "lucide-react";
import { getWhatsAppLink, shareLink } from "../../utils/whatsapp";

interface ClientCatalogProps {
  busca: string;
  setBusca: (busca: string) => void;
  categoria: string;
  setCategoria: (categoria: string) => void;
  produtoId: string;
  setProdutoId: (id: string) => void;
  clearFilters: () => void;
}

export const ClientCatalog: React.FC<ClientCatalogProps> = ({
  busca,
  setBusca,
  categoria,
  setCategoria,
  produtoId,
  setProdutoId,
  clearFilters,
}) => {
  const { products, categories } = useProducts();
  const [catalogCopied, setCatalogCopied] = useState(false);
  const [focusedCopied, setFocusedCopied] = useState(false);

  // Filtra os produtos
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Filtro de Categoria
      if (categoria && product.category !== categoria) {
        return false;
      }
      // Filtro de Busca por Texto
      if (busca.trim()) {
        const query = busca.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc) {
          return false;
        }
      }
      return true;
    });
  }, [products, categoria, busca]);

  // Busca o produto focado por ID se houver deep linking de produto específico
  const focusedProduct = useMemo(() => {
    if (!produtoId) return null;
    return products.find((p) => p.id === produtoId) || null;
  }, [products, produtoId]);

  // Função para compartilhar o link atual do catálogo com todos os filtros
  const handleShareCatalog = async () => {
    const currentUrl = window.location.href;
    const success = await copyTextToClipboard(currentUrl);
    if (success) {
      setCatalogCopied(true);
      setTimeout(() => setCatalogCopied(false), 2000);
    }
  };

  // Função para compartilhar o link do produto focado
  const handleShareFocusedProduct = async () => {
    if (!focusedProduct) return;
    const currentUrl = window.location.href;
    const success = await shareLink(
      focusedProduct.name,
      `Confira ${focusedProduct.name} na Slimpe!`,
      currentUrl
    );
    if (success) {
      setFocusedCopied(true);
      setTimeout(() => setFocusedCopied(false), 2000);
    }
  };

  // Se o cliente acessou o link direto de um produto específico (Deep Linking)
  if (focusedProduct) {
    const formattedPrice = focusedProduct.price !== undefined
      ? focusedProduct.price.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })
      : "Sob Consulta";

    const activeCategory = categories.find((c) => c.slug === focusedProduct.category);

    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Botão de Voltar */}
        <button
          onClick={() => setProdutoId("")}
          className="group mb-8 flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium cursor-pointer"
        >
          <ArrowLeft className="h-4.5 w-4.5 group-hover:-translate-x-1 transition-transform" />
          <span>Voltar para o catálogo completo</span>
        </button>

        {/* Card Detalhado do Produto */}
        <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-xl shadow-slate-100/50 grid grid-cols-1 md:grid-cols-2">
          {/* Lado Esquerdo: Imagem */}
          <div className="relative aspect-4/3 md:aspect-square bg-slate-50">
            <img
              src={focusedProduct.imageUrl}
              alt={focusedProduct.name}
              className="w-full h-full object-cover"
            />
            {focusedProduct.price === undefined && (
              <div className="absolute top-6 right-6 px-4 py-1.5 rounded-full bg-amber-500 text-white text-sm font-semibold shadow-md">
                Sob Consulta
              </div>
            )}
          </div>

          {/* Lado Direito: Conteúdo e Ações */}
          <div className="p-8 flex flex-col justify-between">
            <div>
              {activeCategory && (
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold uppercase tracking-wider mb-4">
                  {activeCategory.name}
                </span>
              )}
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800">
                {focusedProduct.name}
              </h1>
              <p className="mt-4 text-slate-500 leading-relaxed text-sm md:text-base">
                {focusedProduct.description}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-sm text-slate-400 font-medium">Preço sugerido:</span>
                <span className={`text-2xl md:text-3xl font-black ${
                  focusedProduct.price !== undefined ? "text-slate-800" : "text-emerald-700"
                }`}>
                  {formattedPrice}
                </span>
              </div>

              {/* Botões de Ações do Produto Focado */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <button
                  onClick={() => {
                    const link = getWhatsAppLink(focusedProduct.name, focusedProduct.price);
                    window.open(link, "_blank", "noopener,noreferrer");
                  }}
                  className="sm:col-span-3 flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-base transition-all shadow-md shadow-emerald-600/10 cursor-pointer"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Pedir no WhatsApp</span>
                </button>

                <button
                  onClick={handleShareFocusedProduct}
                  className={`sm:col-span-1 flex items-center justify-center gap-2 py-4 px-6 rounded-2xl border font-semibold text-base transition-all cursor-pointer ${
                    focusedCopied
                      ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                      : "bg-white border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800"
                  }`}
                >
                  {focusedCopied ? (
                    <>
                      <Check className="h-5 w-5" />
                      <span className="sm:hidden">Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="h-5 w-5" />
                      <span className="sm:hidden">Compartilhar</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Banner Principal com Apresentação */}
      <div className="text-center max-w-3xl mx-auto px-4 py-8 md:py-12">
        <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">
          Catálogo de Soluções <span className="text-emerald-600">Slimpe</span>
        </h1>
        <p className="mt-4 text-base md:text-lg text-slate-500 leading-relaxed">
          Tudo o que sua empresa precisa em produtos de limpeza de alta performance, 
          higiene, descartáveis e utensílios profissionais. Agilidade e qualidade.
        </p>

        {/* Botão para Compartilhar Link do Catálogo atual com Filtros */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleShareCatalog}
            id="share-catalog-btn"
            className={`flex items-center gap-2 py-2.5 px-5 rounded-full border text-sm font-semibold transition-all duration-200 cursor-pointer ${
              catalogCopied
                ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                : "bg-white border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 shadow-xs"
            }`}
          >
            {catalogCopied ? (
              <>
                <Check className="h-4 w-4 animate-scale" />
                <span>Link do Catálogo Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Compartilhar Link do Catálogo</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Seção de Filtros e Busca */}
      <div className="max-w-7xl mx-auto px-4 mb-10 flex flex-col gap-6">
        <SearchBar value={busca} onChange={setBusca} />
        
        <CategoryFilter
          categories={categories}
          selectedCategory={categoria}
          onSelectCategory={setCategoria}
          products={products}
        />
      </div>

      {/* Grid de Produtos */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onFocusProduct={setProdutoId}
              />
            ))}
          </div>
        ) : (
          /* Estado Vazio */
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-xs max-w-xl mx-auto px-6">
            <div className="h-14 w-14 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4">
              <RotateCcw className="h-6 w-6 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Nenhum produto encontrado</h3>
            <p className="mt-2 text-sm text-slate-400">
              Não encontramos nenhum item correspondente aos filtros aplicados. tente remover os filtros.
            </p>
            <button
              onClick={clearFilters}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              <span>Limpar Filtros e Buscar Tudo</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
