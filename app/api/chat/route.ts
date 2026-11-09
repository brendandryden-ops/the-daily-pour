/**
 * Same-origin proxy for the n8n chat widget (components/ChatWidget.tsx).
 * The browser talks to /api/chat and this forwards to the n8n Chat Trigger,
 * so CORS never applies and the n8n URL stays off the client.
 */
const MAX_BODY_BYTES = 16 * 1024;

export async function POST(request: Request) {
  const upstream = process.env.N8N_CHAT_WEBHOOK_URL;
  if (!upstream) return Response.json({ error: "Chat is not configured." }, { status: 503 });

  const body = await request.text();
  if (body.length > MAX_BODY_BYTES) return Response.json({ error: "Message too long." }, { status: 413 });

  const url = new URL(upstream);
  new URL(request.url).searchParams.forEach((value, key) => url.searchParams.set(key, value));

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": request.headers.get("content-type") ?? "application/json" },
      body,
      signal: AbortSignal.timeout(60_000),
      cache: "no-store",
    });
    return new Response(res.body, {
      status: res.status,
      headers: { "Content-Type": res.headers.get("content-type") ?? "application/json" },
    });
  } catch (err) {
    console.error("n8n chat proxy failed:", err);
    return Response.json({ output: "Sorry, the chat is unavailable right now. Please call the shop." }, { status: 502 });
  }
}
