// Vercel Function: proxies model calls to Groq using the site owner's
// key from the GROQ_API_KEY environment variable. The key never
// reaches the browser. Only the one small model is allowed.
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "POST only" });
    return;
  }
  const key = process.env.GROQ_API_KEY;
  if (!key) {
    res.status(500).json({
      error: "GROQ_API_KEY is not set in the Vercel project settings" });
    return;
  }
  try {
    const body = typeof req.body === "string"
      ? JSON.parse(req.body) : (req.body || {});
    const payload = {
      model: "openai/gpt-oss-20b",
      temperature: 0,
      max_tokens: Math.min(body.max_tokens || 6000, 6000),
      response_format: { type: "json_object" },
      messages: body.messages || []
    };
    const r = await fetch(
      "https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json",
          "Authorization": "Bearer " + key },
        body: JSON.stringify(payload)
      });
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (e) {
    res.status(502).json({ error: "proxy failed: " + e.message });
  }
}
