import { container } from "tsyringe";

import { V1RoutesRegistry } from "~/express/routes/v1";

export const setupContainer = () => {
  container.registerSingleton(V1RoutesRegistry);
};
