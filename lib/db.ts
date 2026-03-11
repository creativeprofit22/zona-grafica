import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  db: ReturnType<typeof drizzle> | undefined;
};

function createDb() {
  return drizzle({
    connection: {
      connectionString: process.env.DATABASE_URL!,
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
