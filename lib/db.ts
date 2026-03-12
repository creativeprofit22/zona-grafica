import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  db: ReturnType<typeof drizzle> | undefined;
};

function createDb() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is required");
  }

  return drizzle({
    connection: {
      connectionString: databaseUrl,
      ssl: process.env.NODE_ENV === "production",
      max: 10,
    },
    schema,
  });
}

if (!globalForDb.db) {
  globalForDb.db = createDb();
}

export const db = globalForDb.db;
