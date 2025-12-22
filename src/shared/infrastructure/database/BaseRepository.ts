import { Pool } from "mysql2/promise";

export abstract class BaseRepository {
  constructor(protected readonly dbClient: Pool) {}
}
