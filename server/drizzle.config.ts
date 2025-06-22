import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema/*.ts",
  out: "./drizzle",
  dbCredentials: {
    url: "postgresql://postgres:harsh123@localhost:5432/TaskForge",
  },
  dialect: "postgresql",
} satisfies Config;