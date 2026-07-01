import React, { useState } from "react";
import { ProductProvider } from "./context/ProductContext";
import { useQueryParams } from "./hooks/useQueryParams";
import { ClientCatalog } from "./components/client/ClientCatalog";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { Sparkles, User, ShieldCheck } from "lucide-react";

export const AppContent: React.FC = () => {
  // Estado para alternar entre visão do cliente e visão administrativa
  const [viewMode, setViewMode] = useState<"client" | "admin">("client");

  // Hook para sincronizar os filtros na URL do navegador
  const {
    busca,
    categoria,
    produtoId,
    setBusca,
    setCategoria,
    setProdutoId,
    clearFilters,
  } = useQueryParams();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 glassmorphism border-b border-slate-100/80">
        <div className="max-w-7xl mx-auto px-4 h-16 md:h-20 flex justify-between items-center">
          {/* Logo */}
          <div 
            onClick={() => {
              setViewMode("client");
              clearFilters();
            }}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="h-10 w-10 md:h-11 md:w-11 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/10 group-hover:rotate-6 transition-transform">
              <Sparkles className="h-5 w-5 md:h-5.5 md:w-5.5" />
            </div>
            <div>
              <span className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                Slimpe
              </span>
              <span className="block text-[9px] md:text-[10px] font-bold text-emerald-600 uppercase tracking-widest leading-none">
                Facilities
              </span>
            </div>
          </div>

          {/* Seletor de Visão (Pública vs Administrativa) */}
          <div className="flex gap-1.5 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/55">
            <button
              onClick={() => setViewMode("client")}
              id="nav-btn-client"
              className={`flex items-center gap-1.5 py-2 px-4 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
                viewMode === "client"
                  ? "bg-white text-slate-800 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <User className="h-3.5 w-3.5" />
              <span>Ver Catálogo</span>
            </button>

            <button
              onClick={() => setViewMode("admin")}
              id="nav-btn-admin"
              className={`flex items-center gap-1.5 py-2 px-4 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
                viewMode === "admin"
                  ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Painel Lojista</span>
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 bg-radial from-slate-50 to-slate-100/50">
        {viewMode === "client" ? (
          <ClientCatalog
            busca={busca}
            setBusca={setBusca}
            categoria={categoria}
            setCategoria={setCategoria}
            produtoId={produtoId}
            setProdutoId={setProdutoId}
            clearFilters={clearFilters}
          />
        ) : (
          <AdminDashboard />
        )}
      </main>

      {/* Rodapé */}
      <footer className="bg-white border-t border-slate-100 py-8 text-center text-xs md:text-sm text-slate-400 font-medium">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Slimpe Facilities. Todos os direitos reservados.</p>
          <div className="flex gap-4">
            <span className="hover:text-slate-600 transition-colors cursor-pointer" onClick={() => setViewMode("client")}>Termos de Uso</span>
            <span className="hover:text-slate-600 transition-colors cursor-pointer" onClick={() => setViewMode("client")}>Suporte</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <ProductProvider>
      <AppContent />
    </ProductProvider>
  );
}
