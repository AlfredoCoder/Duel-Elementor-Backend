export default async function handler(req: any, res: any) {
  try {
    let mod: any;
    let app: any;

    try {
      mod = await import("../src/app");
      app = mod && (mod.default ?? mod);
    } catch (e1) {
      console.warn("Import ../src/app failed, attempting ../dist/index.mjs", e1 && (e1 && (e1.stack || e1.message || e1)));
      try {
        mod = await import("../dist/index.mjs");
        app = mod && (mod.default ?? mod);
      } catch (e2) {
        console.error("Both ../src/app and ../dist/index.mjs failed to import:", e1, e2 && (e2.stack || e2.message || e2));
        throw e1;
      }
    }

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