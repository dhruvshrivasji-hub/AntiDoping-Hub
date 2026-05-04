import { Router } from "express";
import { getAuth } from "@clerk/express";
import pg from "pg";

const router = Router();
const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// POST /api/users/sync — create or update user record from Clerk
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
       RETURNING id, clerk_id, name, email, role`,
      [clerkId, name, email, role]
    );
    return res.json(result.rows[0]);
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Failed to sync user." });
  }
});

// GET /api/users/me — get current user's role from DB
router.get("/users/me", async (req, res) => {
  const auth = getAuth(req);
  const clerkId = auth?.userId;
  if (!clerkId) return res.status(401).json({ error: "Unauthorized" });

  try {
    const result = await pool.query(
      "SELECT id, clerk_id, name, email, role FROM users WHERE clerk_id = $1",
      [clerkId]
    );
    if (!result.rows.length) return res.status(404).json({ error: "User not found" });
    return res.json(result.rows[0]);
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Failed to fetch user." });
  }
});

export default router;
