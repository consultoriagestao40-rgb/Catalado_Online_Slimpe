import { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL;
const sql = databaseUrl ? neon(databaseUrl) : null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Configuração de CORS para suportar desenvolvimento local e múltiplos ambientes
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

  if (!sql) {
    return res.status(500).json({ error: 'Configuração do banco de dados (DATABASE_URL) ausente' });
  }

  try {
    // GET: Listar todos os produtos
    if (req.method === 'GET') {
      const result = await sql`SELECT * FROM products ORDER BY created_at DESC`;
      
      // Mapeia do banco de dados (snake_case) para o frontend (camelCase)
      const products = result.map((row) => ({
        id: row.id,
        name: row.name,
        description: row.description,
        price: row.price !== null ? parseFloat(row.price) : undefined,
        category: row.category,
        imageUrl: row.image_url,
        createdAt: row.created_at,
      }));
      
      return res.status(200).json(products);
    }

    // POST: Adicionar novo produto
    if (req.method === 'POST') {
      const { name, description, price, category, imageUrl } = req.body;
      const id = `prod-${Date.now()}`;
      
      await sql`
        INSERT INTO products (id, name, description, price, category, image_url)
        VALUES (${id}, ${name}, ${description}, ${price !== undefined && price !== null ? price : null}, ${category}, ${imageUrl})
      `;
      
      return res.status(201).json({ id, name, description, price, category, imageUrl });
    }

    // PUT: Editar produto existente
    if (req.method === 'PUT') {
      const { id, name, description, price, category, imageUrl } = req.body;
      
      await sql`
        UPDATE products 
        SET name = ${name}, description = ${description}, price = ${price !== undefined && price !== null ? price : null}, category = ${category}, image_url = ${imageUrl}
        WHERE id = ${id}
      `;
      
      return res.status(200).json({ id, name, description, price, category, imageUrl });
    }

    // DELETE: Excluir produto
    if (req.method === 'DELETE') {
      const { id } = req.query;
      
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'ID do produto não fornecido' });
      }
      
      await sql`DELETE FROM products WHERE id = ${id}`;
      return res.status(200).json({ message: 'Produto excluído com sucesso' });
    }

    return res.status(405).json({ error: 'Método não permitido' });
  } catch (error) {
    console.error('Erro no handler api/products:', error);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
}
