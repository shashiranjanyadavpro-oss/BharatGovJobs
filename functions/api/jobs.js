export async function onRequest(context) {
  try {
    // DB se jobs nikalna (DRAFT aur LIVE dono)
    const { results } = await context.env.DB.prepare("SELECT * FROM jobs ORDER BY id DESC").all();
    
    return new Response(JSON.stringify(results), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
