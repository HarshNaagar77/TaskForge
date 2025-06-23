import express, { Request, Response } from "express";
import { generateTasks } from "../config/gemini";
import { verifyFirebaseToken } from "../middleware/auth";
import { db } from "../db";
import { tasks } from "../db/schema/tasks";
import { eq, and } from "drizzle-orm";

const router = express.Router();

router.post("/generate-tasks", verifyFirebaseToken, async (req: Request, res: Response): Promise<void> => {
  const { topic } = req.body;
  const generated = await generateTasks(topic);
  res.json({ tasks: generated });
});

router.post("/save", verifyFirebaseToken, async (req: Request, res: Response): Promise<void> => {
  const { title, topic } = req.body;
  const userId = (req as any).user?.uid;

  if (!title || !topic || !userId) {
    res.status(400).json({ error: "Missing fields" });
    return;
  }

  const existing = await db
    .select()
    .from(tasks)
    .where(
      and(
        eq(tasks.userId, userId),
        eq(tasks.title, title),
        eq(tasks.topic, topic)
      )
    );

  if (existing.length > 0) {
    res.status(409).json({ error: "Task already exists" });
    return;
  }

  const saved = await db
    .insert(tasks)
    .values({
      userId,
      title,
      topic,
      status: "incomplete",
      createdAt: new Date(),
    })
    .returning();

  res.status(201).json({ task: saved[0] });
});

router.patch("/:id", verifyFirebaseToken, async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { status } = req.body;

  await db.update(tasks).set({ status }).where(eq(tasks.id, id));
  res.json({ success: true });
});

router.get("/my", verifyFirebaseToken, async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).user?.uid;
  const allTasks = await db.select().from(tasks).where(eq(tasks.userId, userId));
  res.json({ tasks: allTasks });
});

export default router;
