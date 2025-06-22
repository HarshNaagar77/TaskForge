import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import dotenv from "dotenv";
import * as schema from "./schema/users";

dotenv.config(); // Load .env file

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });
export * from "./schema/users";

// Optional: test connection
(async () => {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("✅ PostgreSQL connected:", result.rows[0].now);
  } catch (err) {
    if (err instanceof Error) {
      console.error("❌ Failed to connect to PostgreSQL:", err.message);
    } else {
      console.error("❌ Unknown error occurred during DB connection:", err);
    }
  }
  
})();
