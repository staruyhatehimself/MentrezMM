import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());

// --------------------
// пути
// --------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --------------------
// раздача фронта
// --------------------
app.use(express.static(__dirname));

// главная страница
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// --------------------
// TELEGRAM
// --------------------
const TOKEN = "8584752558:AAH_FAFKhuTzp7E8AP9oelHTl_TZoX5LLEg";
const CHAT_ID = "743385247";

// --------------------
// обработка формы
// --------------------
app.post("/send", async (req, res) => {
  const data = req.body;

  let text = "🎵 *Итоги года*\n\n";

  for (const key in data) {
    if (data[key]?.length) {
      text += `*${key}:*\n`;
      data[key].forEach(item => {
        text += `• ${item}\n`;
      });
      text += "\n";
    }
  }

  try {
    const tgResponse = await fetch(
      `https://api.telegram.org/bot${TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text,
          parse_mode: "Markdown"
        })
      }
    );

    const tgData = await tgResponse.json();
    console.log("🤖 Telegram:", tgData);

    res.json({ ok: true });
  } catch (err) {
    console.error("❌ Telegram error:", err);
    res.status(500).json({ ok: false });
  }
});

// --------------------
// запуск сервера
// --------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("✅ Server started on port", PORT);
});
