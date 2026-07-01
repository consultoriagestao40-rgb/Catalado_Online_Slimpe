import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';

// Carrega .env manualmente
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const dbUrlMatch = envContent.match(/DATABASE_URL=(.*)/);
if (!dbUrlMatch) {
  console.error("DATABASE_URL não encontrada no arquivo .env");
  process.exit(1);
}
const databaseUrl = dbUrlMatch[1].trim();

const sql = neon(databaseUrl);

async function init() {
  console.log("Iniciando conexão e criação de tabelas no Neon...");
  
  // Cria tabela de categorias
  await sql`
    CREATE TABLE IF NOT EXISTS categories (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      slug VARCHAR(100) UNIQUE NOT NULL
    )
  `;
  console.log("Tabela 'categories' verificada/criada.");

  // Cria tabela de produtos
  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      price NUMERIC(10, 2),
      category VARCHAR(100) NOT NULL,
      image_url TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  console.log("Tabela 'products' verificada/criada.");

  // Insere categorias iniciais se estiver vazio
  const catCount = await sql`SELECT COUNT(*)::int as count FROM categories`;
  if (catCount[0].count === 0) {
    console.log("Inserindo categorias iniciais...");
    const initialCats = [
      { id: "1", name: "Limpeza Geral", slug: "limpeza-geral" },
      { id: "2", name: "Higiene & Cuidados", slug: "higiene-cuidados" },
      { id: "3", name: "Descartáveis", slug: "descartaveis" },
      { id: "4", name: "Utensílios & Acessórios", slug: "utensilios-acessorios" },
    ];
    for (const cat of initialCats) {
      await sql`INSERT INTO categories (id, name, slug) VALUES (${cat.id}, ${cat.name}, ${cat.slug})`;
    }
  }

  // Insere produtos iniciais se estiver vazio
  const prodCount = await sql`SELECT COUNT(*)::int as count FROM products`;
  if (prodCount[0].count === 0) {
    console.log("Inserindo produtos iniciais...");
    const initialProducts = [
      {
        id: "prod-1",
        name: "Detergente Multiuso Concentrado",
        description: "Detergente de alta performance com alto poder desengordurante. Ideal para cozinhas industriais e superfícies gerais. Rende até 50 litros.",
        price: 38.90,
        category: "limpeza-geral",
        imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "prod-2",
        name: "Desinfetante Perfumado Lavanda",
        description: "Desinfetante concentrado de lavanda. Deixa um perfume duradouro e elimina 99.9% dos germes e bactérias. Embalagem de 5 litros.",
        price: 29.90,
        category: "limpeza-geral",
        imageUrl: "https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "prod-3",
        name: "Sabonete Líquido Erva Doce Premium",
        description: "Sabonete líquido hidratante com extrato de erva doce. Fórmula suave ideal para lavatórios corporativos de alto fluxo.",
        price: 18.50,
        category: "higiene-cuidados",
        imageUrl: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "prod-4",
        name: "Álcool em Gel 70% Antisséptico",
        description: "Álcool em gel 70% com aloe vera para evitar ressecamento das mãos. Higienização rápida e eficiente. Galão de 5 litros.",
        price: 45.00,
        category: "higiene-cuidados",
        imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "prod-5",
        name: "Papel Toalha Interfolha Premium",
        description: "Papel toalha folha dupla, 100% celulose virgem. Máxima absorção e maciez. Caixa com 2400 folhas.",
        price: 64.90,
        category: "descartaveis",
        imageUrl: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "prod-6",
        name: "MOP Giratório de Limpeza Profissional",
        description: "MOP Giratório com balde espremedor de alta durabilidade. Acompanha 2 refis de microfibra laváveis. Agiliza a limpeza de pisos lisos.",
        price: 129.90,
        category: "utensilios-acessorios",
        imageUrl: "https://images.unsplash.com/photo-1585421514738-ee184b245e3e?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "prod-7",
        name: "Pano de Microfibra Multiuso (Kit c/ 10)",
        description: "Panos de microfibra de alta absorção que não soltam fiapos. Perfeitos para limpeza de vidros, poeira e polimento. Cores sortidas.",
        price: 24.90,
        category: "utensilios-acessorios",
        imageUrl: "https://images.unsplash.com/photo-1610557892470-76d74759902c?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "prod-8",
        name: "Máscara de Proteção Tripla Descartável",
        description: "Máscara descartável com elástico e clipe nasal. Caixa com 50 unidades. Alta eficiência de filtragem bacteriana (BFE > 95%).",
        price: null,
        category: "descartaveis",
        imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80"
      }
    ];
    for (const prod of initialProducts) {
      await sql`
        INSERT INTO products (id, name, description, price, category, image_url)
        VALUES (${prod.id}, ${prod.name}, ${prod.description}, ${prod.price}, ${prod.category}, ${prod.imageUrl})
      `;
    }
  }

  console.log("Banco de dados inicializado com sucesso!");
}

init().catch(err => {
  console.error("Erro ao inicializar o banco de dados:", err);
  process.exit(1);
});
