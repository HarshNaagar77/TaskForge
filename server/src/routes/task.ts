import express, { Request, Response } from "express";
import { generateTasks } from "../config/gemini";
import { verifyFirebaseToken } from "../middleware/auth";
import { db } from "../db";
import { tasks } from "../db/schema/tasks";
import { eq , and } from "drizzle-orm";

const router = express.Router();

// Generate Tasks (but not saved in DB)
router.post("/generate-tasks", verifyFirebaseToken, async (req: Request, res: Response): Promise<void> => {
  const { topic } = req.body;
  const generatedTasks = await generateTasks(topic);
  res.json({ tasks: generatedTasks });
});

// Save Task (prevent duplicates)
router.post("/save", verifyFirebaseToken, async (req: Request, res: Response): Promise<void> => {
  const { title, topic } = req.body;
  const userId = (req as any).user?.uid;

  const existing = await db
  .select()
  .from(tasks)
  .where(
    and(
      eq(tasks.userId, userId),
      eq(tasks.title, title)
    )
  );
  if (existing.length > 0) {
    res.status(409).json({ error: "Task already saved" });
    return;
  }

  const task = await db.insert(tasks).values({
    userId,
    title,
    topic,
    status: "incomplete",
    createdAt: new Date(),
  }).returning();

  res.status(201).json({ task: task[0] });
});

// Update status (complete/incomplete)
router.patch("/:id", verifyFirebaseToken, async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { status } = req.body;
  await db.update(tasks).set({ status }).where(eq(tasks.id, id));
  res.json({ success: true });
});

// Get all tasks for user
router.get("/my", verifyFirebaseToken, async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).user?.uid;
  const allTasks = await db.select().from(tasks).where(eq(tasks.userId, userId));
  res.json({ tasks: allTasks });
});

// Delete a task
router.delete("/:id", verifyFirebaseToken, async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  await db.delete(tasks).where(eq(tasks.id, id));
  res.status(200).json({ success: true });
});

export default router;
