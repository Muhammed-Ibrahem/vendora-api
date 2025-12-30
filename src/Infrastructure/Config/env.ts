import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production", "staging"])
    .default("development"),
  PORT: z.coerce.number().optional().default(3000),
  HOST: z.string(),
  NGINX_PORT: z.coerce.number().optional().default(80),
  DB_HOST: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  DB_PORT: z.coerce.number(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.log(process.env);
  console.error(
    "Invalid environment variables:",
    z.treeifyError(_env.error).properties
  );
  process.exit(1);
}

export const env = {
  port: _env.data.PORT,
  host: _env.data.HOST,
  nginxPort: _env.data.NGINX_PORT,
  dbHost: _env.data.DB_HOST,
  dbUser: _env.data.DB_USER,
  dbPassword: _env.data.DB_PASSWORD,
  dbName: _env.data.DB_NAME,
  dbPort: _env.data.DB_PORT,
  nodeEnv: _env.data.NODE_ENV,
};
