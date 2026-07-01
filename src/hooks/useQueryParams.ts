import { useState, useEffect, useCallback } from "react";

interface Filters {
  busca: string;
  categoria: string;
  produtoId: string;
}

/**
 * Hook para sincronizar o estado dos filtros com a URL em tempo real usando Query Strings.
 */
export function useQueryParams() {
  // Inicializa o estado lendo os parâmetros diretamente da URL
  const [filters, setFilters] = useState<Filters>(() => {
    const params = new URLSearchParams(window.location.search);
    return {
      busca: params.get("busca") || "",
      categoria: params.get("categoria") || "",
      produtoId: params.get("produto") || "",
    };
  });

  // Atualiza a URL quando o estado dos filtros muda
  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.busca.trim()) {
      params.set("busca", filters.busca);
    }
    if (filters.categoria) {
      params.set("categoria", filters.categoria);
    }
    if (filters.produtoId) {
      params.set("produto", filters.produtoId);
    }

    const newSearch = params.toString();
    const newUrl = `${window.location.pathname}${newSearch ? `?${newSearch}` : ""}`;
    
    // Atualiza a barra de endereço sem recarregar a página
    window.history.replaceState(null, "", newUrl);
  }, [filters]);

  // Escuta o evento de "popstate" (botões voltar/avançar do navegador) para sincronizar de volta
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      setFilters({
        busca: params.get("busca") || "",
        categoria: params.get("categoria") || "",
        produtoId: params.get("produto") || "",
      });
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const setBusca = useCallback((busca: string) => {
    setFilters((prev) => ({ ...prev, busca, produtoId: "" })); // Limpa foco de produto ao buscar
  }, []);

  const setCategoria = useCallback((categoria: string) => {
    setFilters((prev) => ({ ...prev, categoria, produtoId: "" })); // Limpa foco de produto ao mudar categoria
  }, []);

  const setProdutoId = useCallback((produtoId: string) => {
    setFilters((prev) => ({ ...prev, produtoId }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ busca: "", categoria: "", produtoId: "" });
  }, []);

  // Retorna a URL completa atual com os filtros aplicados
  const getCurrentShareUrl = useCallback(() => {
    return window.location.href;
  }, []);

  return {
    busca: filters.busca,
    categoria: filters.categoria,
    produtoId: filters.produtoId,
    setBusca,
    setCategoria,
    setProdutoId,
    clearFilters,
    getCurrentShareUrl,
  };
}
