import "reflect-metadata";
//
import { readFile, readdir, access } from "node:fs/promises";
import constants from "node:constants";
import { RowDataPacket } from "mysql2";
import { container } from "tsyringe";
import { join } from "node:path";

import { MySQLConnection } from "~/Database/Client/MySQLClient";
import { registerMySQLDatabase } from "~/Database/DI/MySQLDI";
import { DB_TOKENS } from "~/Database/DI/Tokens";
import { env } from "~/Config/env";

registerMySQLDatabase(container);

const MIGRATIONS_DIR = join(__dirname, "..", "Migrations");

const mysqlClient = container
  .resolve<MySQLConnection>(DB_TOKENS.Database)
  .getPool();

/*------------- HELPERS --------------*/
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const waitForDatabase = async (timeoutMs = 30_000) => {
  const start = Date.now();
  while (true) {
    try {
      await mysqlClient.query("SELECT 1");
      console.log("Database reachable, continuing...");
      return;
    } catch {
      if (Date.now() - start > timeoutMs) {
        throw new Error("Database not reachable");
      }
      await sleep(1000);
    }
  }
};
const ensureMigrationsTable = async (): Promise<void> => {
  await mysqlClient.execute(
    `CREATE TABLE IF NOT EXISTS schema_migrations (
                version VARCHAR(255) PRIMARY KEY,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            )`
  );
};

interface MigrationROw extends RowDataPacket {
  version: string;
}

const getAppliedMigrations = async (): Promise<string[]> => {
  const [rows] = await mysqlClient.execute<MigrationROw[]>(
    "SELECT version FROM schema_migrations ORDER BY version ASC"
  );

  return rows.map((r) => r.version);
};

const getLastAppliedMigration = async (): Promise<string | null> => {
  const [rows] = await mysqlClient.execute<MigrationROw[]>(
    "SELECT version FROM schema_migrations ORDER BY version DESC LIMIT 1"
  );

  const row = rows[0];
  if (!row) return null;

  return row.version;
};

const getAllMigrationVersion = async (): Promise<string[]> => {
  const entries = await readdir(MIGRATIONS_DIR, { withFileTypes: true });

  return entries
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();
};

const assertFileExists = async (path: string) => {
  try {
    await access(path, constants.F_OK);
  } catch {
    throw new Error(`Missing migration file: ${path}`);
  }
};
const runSqlFile = async (filePath: string): Promise<void> => {
  await assertFileExists(filePath);

  const sql = await readFile(filePath, "utf8");
  const conn = await mysqlClient.getConnection();

  try {
    await conn.beginTransaction();
    await conn.query(sql);
    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

/*------------- MIGRATIONS --------------*/
const migrateUp = async (): Promise<void> => {
  console.log("Migrate to latest version");
  const applied = new Set(await getAppliedMigrations());

  const all = await getAllMigrationVersion();

  for (const version of all) {
    if (applied.has(version)) continue;

    console.log(`Applying migration ${version}`);

    await runSqlFile(join(MIGRATIONS_DIR, version, "up.sql"));

    await mysqlClient.execute(
      "INSERT INTO schema_migrations (version) VALUES (:version)",
      {
        version,
      }
    );
  }
};

const migrateDown = async (): Promise<void> => {
  console.log("Migrate Down latest applied version");

  const version = await getLastAppliedMigration();

  if (!version) {
    console.log("No migrations to rollback");
    return;
  }

  console.log(`Rolling back migration ${version}`);

  await runSqlFile(join(MIGRATIONS_DIR, version, "down.sql"));

  await mysqlClient.execute(
    "DELETE FROM schema_migrations WHERE version = :version",
    {
      version,
    }
  );
};

const migrateDownTo = async (target: string): Promise<void> => {
  console.log(`Migrate Down to version ${target}`);

  const applied = await getAppliedMigrations();

  for (let i = applied.length - 1; i >= 0; i--) {
    const version = applied[i];

    if (!version) continue;

    if (version <= target) break;

    console.log(`Rolling back migration ${version}`);

    await runSqlFile(join(MIGRATIONS_DIR, version!, "down.sql"));

    await mysqlClient.execute(
      "DELETE FROM schema_migrations WHERE version = :version",
      {
        version,
      }
    );
  }
};

/*------------- CLI --------------*/
const command = process.argv[2] ?? "up";
const toArg = process.argv.find((a) => a.startsWith("--to="));

const preventDownMigrationInProduction = (command: string) => {
  if (command === "down" && env.nodeEnv === "production") {
    throw new Error("Cannot migrate down in production");
  }
};

const runMigrations = async () => {
  preventDownMigrationInProduction(command);

  await waitForDatabase();
  await ensureMigrationsTable();

  try {
    if (command === "up") {
      await migrateUp();
    } else if (command === "down" && toArg) {
      await migrateDownTo(toArg.split("=")[1]!);
    } else if (command === "down") {
      await migrateDown();
    } else {
      throw new Error(`Unkown command: ${command}`);
    }

    console.log("Migration Completed Successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Migration Failed", err);
    process.exit(1);
  }
};

runMigrations();
