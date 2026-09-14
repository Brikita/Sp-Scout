import { drizzle } from "drizzle-orm/d1";
import { getRuntimeBindings } from "../lib/runtime-bindings";
import * as schema from "./schema";

export type D1Statement = D1PreparedStatement;
export type D1Binding = D1Database;

export function getOptionalD1(): D1Database | undefined {
  return getRuntimeBindings().DB as D1Database | undefined;
}

export function getD1(): D1Database {
  const database = getOptionalD1();
  if (!database) {
    throw new Error(
      "Cloudflare D1 binding `DB` is unavailable. Set the `d1` field in .openai/hosting.json to `DB` or let your control plane inject the real binding values before using the database."
    );
  }
  return database;
}

export function getDb() {
  return drizzle(getD1(), { schema });
}
