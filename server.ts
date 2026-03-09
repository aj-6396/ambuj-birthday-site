import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database("wishes.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS wishes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    message TEXT NOT NULL,
    timestamp INTEGER NOT NULL,
    type TEXT NOT NULL,
    love INTEGER DEFAULT 0,
    celebrate INTEGER DEFAULT 0,
    cheer INTEGER DEFAULT 0,
    laugh INTEGER DEFAULT 0,
    rofl INTEGER DEFAULT 0,
    savage INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS stats (
    key TEXT PRIMARY KEY,
    value INTEGER DEFAULT 0
  );

  INSERT OR IGNORE INTO stats (key, value) VALUES ('visitors', 0);
`);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/wishes", (req, res) => {
    const wishes = db.prepare("SELECT * FROM wishes ORDER BY timestamp DESC").all();
    const formattedWishes = wishes.map((w: any) => ({
      id: w.id,
      name: w.name,
      message: w.message,
      timestamp: w.timestamp,
      type: w.type,
      reactions: {
        love: w.love,
        celebrate: w.celebrate,
        cheer: w.cheer,
        laugh: w.laugh,
        rofl: w.rofl,
        savage: w.savage
      }
    }));
    res.json(formattedWishes);
  });

  app.post("/api/wishes", (req, res) => {
    const { id, name, message, timestamp, type, reactions } = req.body;
    const stmt = db.prepare(`
      INSERT INTO wishes (id, name, message, timestamp, type, love, celebrate, cheer, laugh, rofl, savage)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      id, 
      name, 
      message, 
      timestamp, 
      type, 
      reactions.love || 0,
      reactions.celebrate || 0,
      reactions.cheer || 0,
      reactions.laugh || 0,
      reactions.rofl || 0,
      reactions.savage || 0
    );
    res.status(201).json({ success: true });
  });

  app.post("/api/wishes/:id/react", (req, res) => {
    const { id } = req.params;
    const { reactionType } = req.body;
    
    // Validate reaction type to prevent SQL injection or invalid columns
    const validReactions = ['love', 'celebrate', 'cheer', 'laugh', 'rofl', 'savage'];
    if (!validReactions.includes(reactionType)) {
      return res.status(400).json({ error: "Invalid reaction type" });
    }

    const stmt = db.prepare(`UPDATE wishes SET ${reactionType} = ${reactionType} + 1 WHERE id = ?`);
    stmt.run(id);
    res.json({ success: true });
  });

  app.get("/api/stats", (req, res) => {
    // Increment visitor count on each request to this endpoint
    db.prepare("UPDATE stats SET value = value + 1 WHERE key = 'visitors'").run();
    const stats = db.prepare("SELECT value FROM stats WHERE key = 'visitors'").get() as { value: number };
    res.json({ visitors: stats.value });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
