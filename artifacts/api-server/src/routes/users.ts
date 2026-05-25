import { Router } from "express";
import { getAuth } from "@clerk/express";
import pg from "pg";

const router = Router();
const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Run migrations on startup — add profile columns if they don't exist
(async () => {
  try {
    await pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(50);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT DEFAULT '';
      ALTER TABLE users ADD COLUMN IF NOT EXISTS sport VARCHAR(100) DEFAULT '';
      ALTER TABLE users ADD COLUMN IF NOT EXISTS country VARCHAR(100) DEFAULT '';
      ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_color VARCHAR(7) DEFAULT '#DC2626';
    `);
    await pool.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS users_username_unique
        ON users (username) WHERE username IS NOT NULL;
    `);
  } catch (err) {
    // columns may already exist — safe to ignore
  }
})();

// POST /api/users/sync — create or update user record from Clerk (initial auth)
router.post("/users/sync", async (req, res) => {
  const auth = getAuth(req);
  const clerkId = auth?.userId;
  if (!clerkId) return res.status(401).json({ error: "Unauthorized" });

  const { name, email, role } = req.body as { name: string; email: string; role: string };
  if (!name || !email || !role) return res.status(400).json({ error: "Missing fields" });

  try {
    const result = await pool.query(
      `INSERT INTO users (clerk_id, name, email, role)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (clerk_id) DO UPDATE
       SET name = EXCLUDED.name, email = EXCLUDED.email, role = EXCLUDED.role
       RETURNING id, clerk_id, name, email, role, username, bio, sport, country, avatar_color`,
      [clerkId, name, email, role]
    );
    return res.json(result.rows[0]);
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Failed to sync user." });
  }
});

// GET /api/users/me — get current user's full profile
router.get("/users/me", async (req, res) => {
  const auth = getAuth(req);
  const clerkId = auth?.userId;
  if (!clerkId) return res.status(401).json({ error: "Unauthorized" });

  try {
    const result = await pool.query(
      `SELECT id, clerk_id, name, email, role, username, bio, sport, country, avatar_color
       FROM users WHERE clerk_id = $1`,
      [clerkId]
    );
    if (!result.rows.length) return res.status(404).json({ error: "User not found" });
    return res.json(result.rows[0]);
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Failed to fetch user." });
  }
});

// PATCH /api/users/profile — update profile fields
router.patch("/users/profile", async (req, res) => {
  const auth = getAuth(req);
  const clerkId = auth?.userId;
  if (!clerkId) return res.status(401).json({ error: "Unauthorized" });

  const { username, bio, sport, country, avatarColor } = req.body as {
    username: string;
    bio: string;
    sport: string;
    country: string;
    avatarColor: string;
  };

  if (!username || username.trim().length < 3) {
    return res.status(400).json({ error: "Username must be at least 3 characters." });
  }
  const clean = username.trim().toLowerCase().replace(/[^a-z0-9_.]/g, "");
  if (clean !== username.trim().toLowerCase()) {
    return res.status(400).json({ error: "Username may only contain letters, numbers, dots and underscores." });
  }

  try {
    const result = await pool.query(
      `UPDATE users
       SET username = $2, bio = $3, sport = $4, country = $5, avatar_color = $6
       WHERE clerk_id = $1
       RETURNING id, clerk_id, name, email, role, username, bio, sport, country, avatar_color`,
      [clerkId, clean, bio ?? "", sport ?? "", country ?? "", avatarColor ?? "#DC2626"]
    );
    if (!result.rows.length) return res.status(404).json({ error: "User not found" });
    return res.json(result.rows[0]);
  } catch (err: unknown) {
    const pgErr = err as { code?: string };
    if (pgErr?.code === "23505") {
      return res.status(409).json({ error: "That username is already taken." });
    }
    req.log.error(err);
    return res.status(500).json({ error: "Failed to update profile." });
  }
});

// GET /api/users/check-username/:username — check availability (public)
router.get("/users/check-username/:username", async (req, res) => {
  const { username } = req.params;
  const clerkId = getAuth(req)?.userId ?? null;
  try {
    const result = await pool.query(
      `SELECT clerk_id FROM users WHERE username = $1`,
      [username.toLowerCase()]
    );
    const available = result.rows.length === 0 || result.rows[0].clerk_id === clerkId;
    return res.json({ available });
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Check failed." });
  }
});

// GET /api/users/profile/:username — public profile with stats
router.get("/users/profile/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const userResult = await pool.query(
      `SELECT id, name, username, role, bio, sport, country, avatar_color
       FROM users WHERE username = $1`,
      [username.toLowerCase()]
    );
    if (!userResult.rows.length) return res.status(404).json({ error: "User not found" });
    const user = userResult.rows[0];

    const progressResult = await pool.query(
      `SELECT module_slug AS slug, score, completed FROM progress WHERE user_id = $1`,
      [user.id]
    );
    const completedModules = progressResult.rows.filter((r) => r.completed);
    const avgScore = completedModules.length
      ? Math.round(completedModules.reduce((s: number, r: { score: number }) => s + (r.score ?? 0), 0) / completedModules.length)
      : 0;

    const rankResult = await pool.query(
      `SELECT COUNT(*) + 1 AS rank FROM (
         SELECT user_id, COUNT(*) AS cnt FROM progress WHERE completed = true GROUP BY user_id
         HAVING COUNT(*) > $1
       ) subq`,
      [completedModules.length]
    );
    const rank = parseInt(rankResult.rows[0]?.rank ?? "1", 10);

    return res.json({
      ...user,
      completedCount: completedModules.length,
      totalModules: 6,
      avgScore,
      rank,
      modules: progressResult.rows,
    });
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Failed to fetch profile." });
  }
});

export default router;
