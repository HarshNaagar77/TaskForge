import express, { Request, Response } from "express";
import { generateTasks } from "../config/gemini";
import { verifyFirebaseToken } from "../middleware/auth";
import { db } from "../db"; // Adjust path to your Drizzle DB instance
import { tasks } from "../db/schema/tasks"; // Adjust path to your schema

const router = express.Router();

router.post("/generate-tasks", verifyFirebaseToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { topic } = req.body;
    const user = (req as any).user;

    if (!topic) {
      res.status(400).json({ error: "Topic is required" });
      return;
    }

    if (!user?.uid) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const generatedTasks = await generateTasks(topic);

    const inserted = await db
      .insert(tasks)
      .values(
        generatedTasks.map((task) => ({
          userId: user.uid,
          topic,
          title: task,
          isCompleted: false,
          createdAt: new Date(),
        }))
      )
      .returning();

    res.status(201).json({ tasks: inserted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate and save tasks" });
  }
});


export default router;
