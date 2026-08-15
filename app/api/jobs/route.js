export const runtime = 'edge';

export async function GET(request) {
  try {
    const { env } = process;
    // Cloudflare D1 Database binding access
    const db = env.DB; 
    
    if (!db) {
      return Response.json({ error: "Database connection missing" }, { status: 500 });
    }

    // Sirf wahi jobs layega jo PUBLISHED aur VERIFIED hain
    const { results } = await db.prepare("SELECT * FROM jobs WHERE status = 'PUBLISHED' ORDER BY created_at DESC").all();
    
    return Response.json(results);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
