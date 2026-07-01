import { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';

const databaseUrl = "postgresql://neondb_owner:npg_jv7tFfWa2yul@ep-bold-sunset-ahqi0ozv-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require";
const sql = neon(databaseUrl);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Configuração de CORS para suportar compartilhamentos e chamadas externas
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { produto } = req.query;

  // SEO padrão do catálogo
  let title = "Slimpe - Catálogo de Produtos e Facilities";
  let description = "Explore o catálogo completo de produtos de limpeza e facilities da Slimpe. Qualidade, eficiência e atendimento especializado.";
  let imageUrl = "https://slimpe.com.br/wp-content/uploads/2022/08/slimpe_logo_site.png";
  
  // Constrói a URL da página atual
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const pageUrl = `${protocol}://${host}${req.url}`;

  // Se o link contiver "?produto=prod-xxx", buscamos os dados dele no Neon PostgreSQL
  if (produto && typeof produto === 'string') {
    try {
      const result = await sql`SELECT * FROM products WHERE id = ${produto}`;
      if (result.length > 0) {
        const prod = result[0];
        title = `${prod.name} | Slimpe Facilities`;
        description = prod.description;
        imageUrl = prod.image_url;
      }
    } catch (err) {
      console.error("Erro ao buscar produto para OG tags:", err);
    }
  }

  // Carrega o arquivo HTML base gerado pelo build (app.html)
  let htmlPath = path.join(process.cwd(), 'dist', 'app.html');
  if (!fs.existsSync(htmlPath)) {
    htmlPath = path.join(process.cwd(), 'app.html');
  }

  try {
    let html = fs.readFileSync(htmlPath, 'utf8');

    // Limpa tags de cabeçalho padrão para evitar duplicidade
    html = html.replace(/<title>.*?<\/title>/gi, "");
    html = html.replace(/<meta name="description" content=".*?" \/>/gi, "");

    // Injeta novas tags Open Graph e Twitter Card para gerar o card no WhatsApp
    const ogTags = `
      <title>${title}</title>
      <meta name="description" content="${description.replace(/"/g, '&quot;')}" />
      
      <!-- Open Graph / Facebook / WhatsApp -->
      <meta property="og:type" content="website" />
      <meta property="og:title" content="${title.replace(/"/g, '&quot;')}" />
      <meta property="og:description" content="${description.replace(/"/g, '&quot;')}" />
      <meta property="og:image" content="${imageUrl}" />
      <meta property="og:url" content="${pageUrl}" />
      
      <!-- Twitter / X -->
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="${title.replace(/"/g, '&quot;')}" />
      <meta name="twitter:description" content="${description.replace(/"/g, '&quot;')}" />
      <meta name="twitter:image" content="${imageUrl}" />
    `;

    // Inserindo logo após a tag <head>
    html = html.replace("<head>", `<head>${ogTags}`);

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(html);
  } catch (error) {
    console.error("Erro ao renderizar HTML com OG tags:", error);
    
    // Fallback caso ocorra falha na leitura do arquivo físico
    return res.status(200).send(`
      <!DOCTYPE html>
      <html lang="pt-BR">
        <head>
          <meta charset="UTF-8" />
          <title>${title}</title>
          <meta name="description" content="${description}" />
          <meta property="og:title" content="${title}" />
          <meta property="og:description" content="${description}" />
          <meta property="og:image" content="${imageUrl}" />
          <meta property="og:url" content="${pageUrl}" />
        </head>
        <body>
          <script>window.location.href = "${pageUrl}";</script>
        </body>
      </html>
    `);
  }
}
