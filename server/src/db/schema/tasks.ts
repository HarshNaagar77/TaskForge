
import { pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";


export const tasks = pgTable("tasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  topic: text("topic"),
  status: text("status").default("pending"), // use enums if preferred
  createdAt: timestamp("created_at").defaultNow(),
});
