import { Router } from "express";
import jwt from "jsonwebtoken";
import pg from "pg";

const router = Router();
const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const JWT_SECRET = process.env.SESSION_SECRET ?? "cleansport-secret-2024";

function getUserId(req: any): number | null {
  const auth = req.headers.authorization as string | undefined;
  if (!auth?.startsWith("Bearer ")) return null;
  try {
    const payload = jwt.verify(auth.slice(7), JWT_SECRET) as { userId: number };
    return payload.userId;
  } catch {
    return null;
  }
}

// GET /api/progress — get current user's module progress
router.get("/progress", async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  try {
    const modules = await pool.query("SELECT * FROM modules ORDER BY id");
    const progress = await pool.query("SELECT * FROM progress WHERE user_id = $1", [userId]);
    const progressMap: Record<string, any> = {};
    for (const row of progress.rows) progressMap[row.module_slug] = row;

    const result = modules.rows.map((m: any) => ({
      slug: m.slug,
      title: m.title,
      durationMinutes: m.duration_minutes,
      roleTarget: m.role_target,
      completed: progressMap[m.slug]?.completed ?? false,
      score: progressMap[m.slug]?.score ?? 0,
      completedAt: progressMap[m.slug]?.completed_at ?? null,
    }));

    return res.json(result);
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Failed to fetch progress." });
  }
});

// POST /api/progress/:slug — mark a module complete
router.post("/progress/:slug", async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const { slug } = req.params;
  const { score } = req.body as { score?: number };

  try {
    await pool.query(
      `INSERT INTO progress (user_id, module_slug, completed, score, completed_at)
       VALUES ($1, $2, true, $3, NOW())
       ON CONFLICT (user_id, module_slug) DO UPDATE
       SET completed = true, score = $3, completed_at = NOW()`,
      [userId, slug, score ?? 100]
    );
    return res.json({ success: true });
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Failed to update progress." });
  }
});

// GET /api/tests — get user's test records
router.get("/tests", async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  try {
    const result = await pool.query(
      "SELECT * FROM test_records WHERE user_id = $1 ORDER BY test_date DESC",
      [userId]
    );
    return res.json(result.rows);
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Failed to fetch test records." });
  }
});

// GET /api/dashboard — full dashboard data
router.get("/dashboard", async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  try {
    const userResult = await pool.query("SELECT id, name, email, role FROM users WHERE id = $1", [userId]);
    if (!userResult.rows.length) return res.status(404).json({ error: "User not found" });

    const user = userResult.rows[0];
    const modules = await pool.query("SELECT * FROM modules ORDER BY id");
    const progress = await pool.query("SELECT * FROM progress WHERE user_id = $1", [userId]);
    const tests = await pool.query(
      "SELECT * FROM test_records WHERE user_id = $1 ORDER BY test_date DESC LIMIT 5",
      [userId]
    );

    const progressMap: Record<string, any> = {};
    for (const row of progress.rows) progressMap[row.module_slug] = row;

    const moduleData = modules.rows.map((m: any) => ({
      slug: m.slug,
      title: m.title,
      durationMinutes: m.duration_minutes,
      roleTarget: m.role_target,
      completed: progressMap[m.slug]?.completed ?? false,
      score: progressMap[m.slug]?.score ?? 0,
    }));

    const completedCount = progress.rows.filter((p: any) => p.completed).length;
    const totalModules = modules.rows.length;
    const complianceScore = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;

    return res.json({
      user,
      stats: {
        modulesCompleted: completedCount,
        totalModules,
        complianceScore,
        testsCount: tests.rows.length,
      },
      modules: moduleData,
      recentTests: tests.rows,
    });
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Failed to fetch dashboard." });
  }
});

export default router;
