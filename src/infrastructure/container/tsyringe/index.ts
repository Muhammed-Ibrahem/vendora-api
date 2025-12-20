import { container } from "tsyringe";

import { V1RoutesRegistry } from "~/infra/express/routes/v1";

container.registerSingleton(V1RoutesRegistry);

export const DIContainer = container;
