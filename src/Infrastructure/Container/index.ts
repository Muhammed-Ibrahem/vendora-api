import { container } from "tsyringe";

import { registerMySQLDatabase } from "~/Database/DI/MySQLDI";

export const setupContainer = () => {
  registerMySQLDatabase(container);
};
