import "reflect-metadata";
//
import { readFile, readdir } from "node:fs/promises";
import { RowDataPacket } from "mysql2/promise";
import { container } from "tsyringe";
import { join } from "node:path";

import { MySQLConnection } from "../Client/MySQLClient";
import { registerMySQLDatabase } from "../DI/MySQLDI";
import { DB_TOKENS } from "../DI/Tokens";

registerMySQLDatabase(container);

const MIGRATIONS_DIR = join(__dirname, "..", "Migrations");

const mysqlClient = container
  .resolve<MySQLConnection>(DB_TOKENS.Database)
  .getPool();

const ensureMigrationsTable = async (): Promise<void> => {
  const query = `
        CREATE TABLE IF NOT EXISTS schema_migrations (
            version VARCHAR(255) PRIMARY KEY,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
    `;

  await mysqlClient.execute(query);
};

interface IAppliedMigrations extends RowDataPacket {
  version: string;
}

const getAppliedMigrations = async (): Promise<Set<string>> => {
  const query = "SELECT version FROM schema_migrations";

  const [rows] = await mysqlClient.execute<IAppliedMigrations[]>(query);

  return new Set(rows.map((r) => r.version));
};

const runMigrations = async () => {
  await ensureMigrationsTable();

  const appliedMigrations = await getAppliedMigrations();

  const files = (await readdir(MIGRATIONS_DIR))
    .filter((f) => f.endsWith(".sql"))
    .sort();

  for (const file of files) {
    if (appliedMigrations.has(file)) continue;

    const sql = await readFile(join(MIGRATIONS_DIR, file), "utf8");

    await mysqlClient.query(sql);
    await mysqlClient.execute(
      "INSERT INTO schema_migrations (version) VALUES (:version)",
      {
        version: file,
      }
    );
  }
};

runMigrations()
  .then(() => {
    console.log("Migrations Completed Successfully!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Migration Failed", err);
    process.exit(1);
  });
