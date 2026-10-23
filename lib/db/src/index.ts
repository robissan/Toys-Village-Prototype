import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

let pool: pg.Pool | undefined;
let database: NodePgDatabase<typeof schema> | undefined;

function connectionString(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL must be set to open the optional database. The Toy's Village app does not need it.",
    );
  }
  return url;
}

export function getPool(): pg.Pool {
  if (!pool) {
    pool = new Pool({ connectionString: connectionString() });
  }
  return pool;
}

export function getDb(): NodePgDatabase<typeof schema> {
  if (!database) {
    database = drizzle(getPool(), { schema });
  }
  return database;
}

export * from "./schema";
