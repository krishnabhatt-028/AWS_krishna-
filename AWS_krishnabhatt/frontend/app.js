const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

app.use(express.urlencoded({ extended: true }));

const page = (body) => `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>AWS Deployment Demo</title>
<style>
 body{font-family:Arial,sans-serif;background:#f4f6f8;display:flex;justify-content:center;padding:40px}
 .card{background:#fff;padding:28px;border-radius:10px;box-shadow:0 2px 10px #0002;width:420px}
 input,textarea{width:100%;padding:8px;margin:6px 0 14px;box-sizing:border-box}
 button{background:#ff9900;border:0;padding:10px 18px;border-radius:6px;font-weight:bold;cursor:pointer}
 .ok{color:#1a7f37}.err{color:#c62828}
</style></head><body><div class="card">${body}</div></body></html>`;

app.get("/", async (req, res) => {
  let status = "unreachable";
  try {
    const r = await fetch(`${BACKEND_URL}/api`);
    const j = await r.json();
    status = j.message;
  } catch (e) {}
  res.send(page(`
    <h2>Express Frontend</h2>
    <p>Backend says: <b>${status}</b></p>
    <form method="POST" action="/submit">
      <label>Name</label><input name="name" required>
      <label>Message</label><textarea name="message" required></textarea>
      <button type="submit">Send to Flask</button>
    </form>`));
});

app.post("/submit", async (req, res) => {
  try {
    const r = await fetch(`${BACKEND_URL}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: req.body.name, message: req.body.message }),
    });
    const j = await r.json();
    if (j.success) {
      return res.send(page(`<h2 class="ok">Success!</h2>
        <p>Saved by Flask: <b>${j.saved.name}</b> – ${j.saved.message}</p>
        <p>Total submissions: ${j.total}</p><a href="/">Back</a>`));
    }
    res.status(400).send(page(`<h2 class="err">Error</h2><p>${j.error}</p><a href="/">Back</a>`));
  } catch (e) {
    res.status(502).send(page(`<h2 class="err">Backend unreachable</h2><p>${BACKEND_URL}</p><a href="/">Back</a>`));
  }
});

app.listen(PORT, "0.0.0.0", () => console.log(`Frontend on ${PORT}, backend ${BACKEND_URL}`));
