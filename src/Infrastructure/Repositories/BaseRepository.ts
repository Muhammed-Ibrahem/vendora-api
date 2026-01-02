import { Pool } from "mysql2/promise";

export abstract class Repository {
  public constructor(protected readonly dbClient: Pool) {}
}
