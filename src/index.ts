import { createApp } from "~/infra/express/app";
import { env } from "~/config/env";

const startServer = async () => {
  try {
    const app = await createApp();

    app.listen(env.port, () => {
      console.log(`Server running on port ${env.port}`);
      console.log(`Environment: ${env.nodeEnv}`);
      console.log(`Health check: http://localhost:${env.port}/api/v1/health`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
