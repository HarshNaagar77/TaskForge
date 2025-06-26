import { Router } from "express";
import { db, users } from "../db";
import { verifyFirebaseToken } from "../middleware/auth";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from 'uuid';

const router = Router();

router.post("/verify", verifyFirebaseToken, async (req, res) => {
  console.log("✅ /verify route hit");

  const { uid, email, name } = (req as any).user;
  console.log("👤 Firebase user info:", { uid, email, name });

  const existingUser = await db.query.users.findFirst({
    where: eq(users.firebase_Uid, uid),
  });

  if (!existingUser) {
    console.log("🆕 User does not exist. Inserting...");
    await db.insert(users).values({
      email,
      firebase_Uid: uid,
      name,
    });
    console.log("✅ User inserted");
  } else {
    console.log("🙆‍♂️ User already exists");
  }

   res.json({ success: true });
});

export default router;
