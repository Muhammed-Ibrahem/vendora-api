import { container } from "tsyringe";

import { registerMySQLDatabase } from "~/infra/container/tsyringe/MySQLDIContainer";
import { V1RoutesRegistry } from "~/express/routes/v1";

export const setupContainer = () => {
  container.registerSingleton(V1RoutesRegistry);

  registerMySQLDatabase(container);
};
