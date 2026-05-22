export default async function handler(req: any, res: any) {
  try {
    const mod = await import("../src/app");
    const app = mod && (mod.default ?? mod);

    if (typeof req.url === "string" && !req.url.startsWith("/api")) {
      req.url = req.url.startsWith("/") ? `/api${req.url}` : `/api/${req.url}`;
    }

    return app(req, res);
  } catch (err: any) {
    console.error("Vercel function wrapper failed to load app or handle request:", err && (err.stack || err.message || err));
    try {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "FUNCTION_INVOCATION_FAILED", message: String(err && err.message ? err.message : err) }));
    } catch (_) {
      // ignore secondary errors while sending response
    }
    return;
  }
}