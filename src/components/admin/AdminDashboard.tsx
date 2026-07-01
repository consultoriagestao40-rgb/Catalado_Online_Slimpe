import React, { useState } from "react";
import { useProducts } from "../../context/ProductContext";
import { ProductList } from "./ProductList";
import { ProductForm } from "./ProductForm";
import { Product } from "../../types";
import { Lock, Package, Tags, HelpCircle, Plus, List, LogOut } from "lucide-react";

export const AdminDashboard: React.FC = () => {
  const { products, categories } = useProducts();

  // Estados de autenticação
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Estados de navegação interna do Dashboard
  // "list" | "form"
  const [currentView, setCurrentView] = useState<"list" | "form">("list");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Senha simples mockada para proteção
    if (password === "admin123") {
      setIsAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Senha incorreta. Dica: use 'admin123'");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword("");
    setCurrentView("list");
    setEditingProduct(null);
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setCurrentView("form");
  };

  const handleCreateClick = () => {
    setEditingProduct(null);
    setCurrentView("form");
  };

  const handleFormSaveSuccess = () => {
    setCurrentView("list");
    setEditingProduct(null);
  };

  const handleFormCancel = () => {
    setCurrentView("list");
    setEditingProduct(null);
  };

  // Contagem de produtos "Sob Consulta"
  const underConsultationCount = products.filter((p) => p.price === undefined || p.price === null).length;

  // Tela de Login (Mock)
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-16 px-4">
        <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-xl shadow-slate-100/50 text-center">
          <div className="h-14 w-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-6">
            <Lock className="h-6 w-6" />
          </div>
          
          <h2 className="text-2xl font-bold text-slate-800">Painel do Lojista</h2>
          <p className="mt-2 text-sm text-slate-400">
            Acesse para cadastrar, editar e gerenciar o catálogo de produtos da Slimpe.
          </p>

          <form onSubmit={handleLogin} className="mt-8 space-y-4">
            <div className="text-left">
              <label htmlFor="login-pass" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Senha de Acesso
              </label>
              <input
                type="password"
                id="login-pass"
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                placeholder="Digite a senha..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {loginError && (
                <p className="mt-2 text-xs text-red-500 font-semibold">{loginError}</p>
              )}
            </div>

            <button
              type="submit"
              id="login-btn-submit"
              className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-colors shadow-sm cursor-pointer"
            >
              Entrar no Painel
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-xs text-slate-400">
            Senha padrão de demonstração: <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-emerald-700">admin123</code>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard Administrador Autenticado
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header do Painel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800">Painel do Lojista</h1>
          <p className="text-sm text-slate-400 mt-1">Gerencie o estoque e o catálogo público em tempo real.</p>
        </div>

        <button
          onClick={handleLogout}
          id="admin-logout-btn"
          className="flex items-center gap-2 py-2 px-4 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 text-sm font-semibold transition-colors cursor-pointer bg-white"
        >
          <LogOut className="h-4 w-4" />
          <span>Sair do Painel</span>
        </button>
      </div>

      {/* Cards de Métricas / Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {/* Total de Produtos */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Produtos</span>
            <span className="text-2xl font-extrabold text-slate-800">{products.length}</span>
          </div>
        </div>

        {/* Total de Categorias */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <Tags className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Categorias</span>
            <span className="text-2xl font-extrabold text-slate-800">{categories.length}</span>
          </div>
        </div>

        {/* Total Sob Consulta */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <HelpCircle className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Sob Consulta</span>
            <span className="text-2xl font-extrabold text-slate-800">{underConsultationCount}</span>
          </div>
        </div>
      </div>

      {/* Barra de Ações (Mudar telas) */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setCurrentView("list")}
          id="btn-view-list"
          className={`flex items-center gap-2 py-2.5 px-5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
            currentView === "list"
              ? "bg-slate-900 text-white"
              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          <List className="h-4 w-4" />
          <span>Ver Produtos</span>
        </button>

        <button
          onClick={handleCreateClick}
          id="btn-view-form"
          className={`flex items-center gap-2 py-2.5 px-5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
            currentView === "form" && !editingProduct
              ? "bg-slate-900 text-white"
              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Plus className="h-4 w-4" />
          <span>Cadastrar Produto</span>
        </button>
      </div>

      {/* Renderização Condicional das Telas */}
      {currentView === "list" ? (
        <ProductList onEdit={handleEditClick} />
      ) : (
        <ProductForm
          editingProduct={editingProduct}
          onCancel={handleFormCancel}
          onSaveSuccess={handleFormSaveSuccess}
        />
      )}
    </div>
  );
};
