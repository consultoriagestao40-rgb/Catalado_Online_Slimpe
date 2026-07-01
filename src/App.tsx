import React, { useState } from "react";
import { ProductProvider } from "./context/ProductContext";
import { useQueryParams } from "./hooks/useQueryParams";
import { ClientCatalog } from "./components/client/ClientCatalog";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { User, ShieldCheck } from "lucide-react";

export const AppContent: React.FC = () => {
  // Estado para persistir se o usuário é administrador na sessão atual (inicia como true se a URL contiver /admin ou parâmetros)
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    const params = new URLSearchParams(window.location.search);
    const isPathAdmin = window.location.pathname === "/admin" || window.location.pathname === "/admin/";
    const isParamAdmin = params.get("admin") === "true" || params.get("painel") === "true";
    return isPathAdmin || isParamAdmin;
  });

  // Estado para alternar entre visão do cliente e visão administrativa
  const [viewMode, setViewMode] = useState<"client" | "admin">(() => {
    const params = new URLSearchParams(window.location.search);
    const isPathAdmin = window.location.pathname === "/admin" || window.location.pathname === "/admin/";
    const isParamAdmin = params.get("admin") === "true" || params.get("painel") === "true";
    return isPathAdmin || isParamAdmin ? "admin" : "client";
  });

  const showAdminToggle = isAdmin || viewMode === "admin";

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setViewMode("client");
    window.history.replaceState(null, "", "/");
  };

  // Hook para sincronizar os filtros na URL do navegador
  const {
    busca,
    categoria,
    produtoId,
    itens,
    setBusca,
    setCategoria,
    setProdutoId,
    setItens,
    clearFilters,
  } = useQueryParams();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-16 md:h-20 flex justify-between items-center">
          {/* Logo e Nome */}
          <div 
            onClick={() => {
              setViewMode("client");
              window.history.replaceState(null, "", "/");
              clearFilters();
            }}
            className="flex items-center gap-3.5 cursor-pointer select-none group"
          >
            <img 
              src="https://slimpe.com.br/wp-content/uploads/2022/08/slimpe_logo_site.png" 
              alt="Slimpe Logo" 
              className="h-10 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
            />
            <span className="hidden sm:inline-block font-extrabold text-slate-800 text-sm md:text-lg tracking-tight border-l border-slate-200 pl-3.5">
              Catálogo de Soluções <span className="text-emerald-600 font-black">Slimpe</span>
            </span>
          </div>

          {/* Seletor de Visão (Pública vs Administrativa) - Visível apenas para o Lojista (?admin=true na URL) */}
          {showAdminToggle && (
            <div className="flex gap-1.5 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/55">
              <button
                onClick={() => {
                  setViewMode("client");
                  window.history.replaceState(null, "", "/");
                }}
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
                onClick={() => {
                  setViewMode("admin");
                  window.history.replaceState(null, "", "/admin");
                }}
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
          )}
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
            itens={itens}
            setItens={setItens}
            clearFilters={clearFilters}
            isAdmin={isAdmin}
          />
        ) : (
          <AdminDashboard onLogout={handleAdminLogout} />
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
