import { pgTable, text, timestamp, serial } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  firebase_Uid: text("firebase_uid").notNull(),
  name: text("name"),
  createdAt: timestamp("created_at").defaultNow(),
});
