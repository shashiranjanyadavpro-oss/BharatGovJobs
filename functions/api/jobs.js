export async function onRequestGet(context) {
  try {
    // Cloudflare natively environment variables aur DB ko context me pass karta hai
    const db = context.env.DB;
    
    if (!db) {
      return new Response(JSON.stringify({ error: "Database not bound" }), { status: 500 });
    }

    const { results } = await db.prepare("SELECT * FROM jobs WHERE status = 'PUBLISHED' ORDER BY created_at DESC").all();
    
    return new Response(JSON.stringify(results), {
      headers: { 
        "Content-Type": "application/json",
        "Cache-Control": "no-cache"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
