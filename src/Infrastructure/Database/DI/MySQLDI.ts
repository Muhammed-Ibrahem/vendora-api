import { instanceCachingFactory, DependencyContainer } from "tsyringe";
import { PoolOptions } from "mysql2/promise";

import { MySQLConnection } from "~/Database/Client/MySQLClient";
import { env } from "~/Config/env";

import { DB_TOKENS } from "./Tokens";

export const registerMySQLDatabase = (container: DependencyContainer): void => {
  const poolConfig: PoolOptions = {
    host: env.dbHost,
    user: env.dbUser,
    database: env.dbName,
    password: env.dbPassword,
    port: env.dbPort,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60_000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    namedPlaceholders: true,
    multipleStatements: true,
  };

  container.register(DB_TOKENS.Database, {
    useFactory: instanceCachingFactory(() => new MySQLConnection(poolConfig)),
  });
};
