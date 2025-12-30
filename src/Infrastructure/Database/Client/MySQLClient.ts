import mysql, { PoolOptions, Pool } from "mysql2/promise";

export class MySQLConnection {
  private pool: Pool;

  constructor(config: PoolOptions) {
    this.pool = mysql.createPool(config);
  }

  getPool(): Pool {
    return this.pool;
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}
