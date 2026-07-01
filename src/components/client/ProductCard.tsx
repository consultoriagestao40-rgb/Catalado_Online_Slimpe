import React, { useState } from "react";
import { MessageCircle, Share2, Check } from "lucide-react";
import { Product } from "../../types";
import { getWhatsAppLink, shareLink } from "../../utils/whatsapp";

interface ProductCardProps {
  product: Product;
  onFocusProduct?: (id: string) => void;
  isFocused?: boolean;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
  showSelectCheckbox?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onFocusProduct,
  isFocused = false,
  isSelected = false,
  onToggleSelect,
  showSelectCheckbox = false
}) => {
  const [copied, setCopied] = useState(false);

  // Formatação do preço ou "Sob Consulta"
  const formattedPrice = product.price !== undefined && product.price !== null
    ? product.price.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })
    : "Sob Consulta";

  // Gera o link para este produto específico no catálogo
  const getProductShareUrl = () => {
    const url = new URL(window.location.href);
    url.searchParams.set("produto", product.id);
    return url.toString();
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = getProductShareUrl();
    const isCopied = await shareLink(
      product.name,
      `Confira o produto ${product.name} na Slimpe!`,
      shareUrl
    );
    
    if (isCopied) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = getWhatsAppLink(product.name, product.price);
    window.open(link, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      onClick={() => onFocusProduct?.(product.id)}
      className={`group flex flex-col bg-white rounded-3xl overflow-hidden border transition-all duration-300 hover-lift cursor-pointer relative ${
        isSelected
          ? "border-emerald-600 ring-2 ring-emerald-600/10 shadow-md shadow-emerald-600/5 bg-emerald-50/10"
          : isFocused
            ? "border-emerald-500 ring-2 ring-emerald-500/20 shadow-lg shadow-emerald-500/5"
            : "border-slate-100 shadow-xs hover:border-slate-200"
      }`}
    >
      {/* Imagem do Produto */}
      <div className="relative aspect-4/3 w-full bg-white overflow-hidden p-3 flex items-center justify-center border-b border-slate-100/50">
        <img
          src={product.imageUrl || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80"}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-[1.03] transition-transform duration-500"
          loading="lazy"
        />
        {/* Checkbox de Seleção Personalizada */}
        {showSelectCheckbox && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSelect?.(product.id);
            }}
            className={`absolute top-4 left-4 h-6 w-6 rounded-lg flex items-center justify-center border transition-all duration-200 shadow-sm cursor-pointer z-10 ${
              isSelected
                ? "bg-emerald-600 border-emerald-600 text-white"
                : "bg-white/90 backdrop-blur-xs border-slate-200 text-transparent hover:scale-105"
            }`}
          >
            <Check className={`h-3.5 w-3.5 stroke-[3] ${isSelected ? "text-white" : "hover:text-slate-400"}`} />
          </button>
        )}

        {product.price === undefined && (
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-semibold shadow-xs">
            Sob Consulta
          </div>
        )}
      </div>

      {/* Detalhes do Produto */}
      <div className="flex flex-col flex-1 p-5 md:p-6">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-800 line-clamp-1 group-hover:text-emerald-700 transition-colors">
            {product.name}
          </h3>
          <p className="mt-2 text-sm text-slate-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Preço */}
        <div className="mt-4 pt-4 border-t border-slate-50 flex items-baseline gap-1">
          <span className="text-xs text-slate-400 font-medium">Preço:</span>
          <span className={`text-xl font-extrabold ${
            product.price !== undefined ? "text-slate-800" : "text-emerald-700 font-semibold"
          }`}>
            {formattedPrice}
          </span>
        </div>

        {/* Botões de Ação */}
        <div className="mt-5 grid grid-cols-5 gap-2">
          {/* WhatsApp / Comprar */}
          <button
            onClick={handleWhatsApp}
            id={`whatsapp-btn-${product.id}`}
            className="col-span-4 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-sm transition-colors shadow-xs cursor-pointer"
          >
            <MessageCircle className="h-4.5 w-4.5" />
            <span>Comprar no WhatsApp</span>
          </button>

          {/* Compartilhar */}
          <button
            onClick={handleShare}
            id={`share-btn-${product.id}`}
            title="Compartilhar item"
            className={`col-span-1 flex items-center justify-center rounded-xl border transition-all cursor-pointer ${
              copied
                ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                : "bg-white border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-700"
            }`}
          >
            {copied ? (
              <Check className="h-4.5 w-4.5 animate-scale" />
            ) : (
              <Share2 className="h-4.5 w-4.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
