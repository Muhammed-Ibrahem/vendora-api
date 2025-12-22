import { type DependencyContainer } from "tsyringe";
import { PoolOptions } from "mysql2/promise";

import { MySQLConnection } from "~/infra/database/mysql/client/MySQLClient";
import { env } from "~/config/env";

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

  const connectionInstance = new MySQLConnection(poolConfig);

  container.registerInstance(MySQLConnection, connectionInstance);
};
