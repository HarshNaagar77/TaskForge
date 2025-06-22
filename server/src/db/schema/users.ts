import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey().notNull(),
  email: text("email").notNull(),
  firebaseUid: text("firebase_uid").notNull(),
  name: text("name"),
  createdAt: timestamp("created_at").defaultNow(),
});
