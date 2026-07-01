import { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

const databaseUrl = "postgresql://neondb_owner:npg_jv7tFfWa2yul@ep-bold-sunset-ahqi0ozv-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require";
const sql = neon(databaseUrl);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Conexão direta estabelecida

  try {
    // GET: Listar todas as categorias
    if (req.method === 'GET') {
      const result = await sql`SELECT * FROM categories ORDER BY name ASC`;
      return res.status(200).json(result);
    }

    // POST: Criar nova categoria
    if (req.method === 'POST') {
      const { name } = req.body;
      
      if (!name || !name.trim()) {
        return res.status(400).json({ error: 'Nome da categoria não fornecido' });
      }

      const slug = name
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

      // Verifica se já existe
      const existing = await sql`SELECT * FROM categories WHERE slug = ${slug}`;
      if (existing.length > 0) {
        return res.status(400).json({ error: 'Uma categoria com este nome/slug já existe' });
      }

      const id = `cat-${Date.now()}`;
      await sql`
        INSERT INTO categories (id, name, slug)
        VALUES (${id}, ${name.trim()}, ${slug})
      `;

      return res.status(201).json({ id, name: name.trim(), slug });
    }

    return res.status(405).json({ error: 'Método não permitido' });
  } catch (error) {
    console.error('Erro no handler api/categories:', error);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
}
