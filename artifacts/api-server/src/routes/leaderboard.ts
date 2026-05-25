import { Router } from "express";
import { getAuth } from "@clerk/express";
import pg from "pg";

const router = Router();
const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// GET /api/leaderboard — top athletes ranked by compliance score
router.get("/leaderboard", async (req, res) => {
  const auth = getAuth(req);
  const clerkId = auth?.userId;

  try {
    const totalModules = await pool.query("SELECT COUNT(*) FROM modules");
    const total = parseInt(totalModules.rows[0].count, 10) || 1;

    const result = await pool.query(`
      SELECT
        u.id,
        u.clerk_id,
        u.name,
        u.role,
        COUNT(p.module_slug) FILTER (WHERE p.completed = true) AS completed_count,
        ROUND(COUNT(p.module_slug) FILTER (WHERE p.completed = true) * 100.0 / $1) AS compliance_score
      FROM users u
      LEFT JOIN progress p ON p.user_id = u.id
      GROUP BY u.id, u.clerk_id, u.name, u.role
      ORDER BY compliance_score DESC, completed_count DESC, u.name ASC
      LIMIT 50
    `, [total]);

    const rows = result.rows.map((r: any, i: number) => ({
      rank: i + 1,
      id: r.id,
      name: r.name,
      role: r.role,
      completedCount: parseInt(r.completed_count, 10),
      totalModules: total,
      complianceScore: parseInt(r.compliance_score, 10) || 0,
      isCurrentUser: clerkId ? r.clerk_id === clerkId : false,
    }));

    return res.json({ entries: rows, totalModules: total });
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Failed to fetch leaderboard." });
  }
});

export default router;
