import { z } from "zod";

const envSchema = z.object({
  SOUNDCLOUD_CLIENT_ID: z.string().min(1),
  SOUNDCLOUD_CLIENT_SECRET: z.string().min(1),
  DATABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url(),
});

const databaseEnvSchema = z.object({
  DATABASE_URL: z.string().url(),
});

const cronEnvSchema = z.object({
  CRON_SECRET: z.string().min(1),
});

export type Env = z.infer<typeof envSchema>;

export function getEnv(): Env {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors);
    throw new Error("Invalid environment variables");
  }
  return parsed.data;
}

export function getDatabaseUrl(): string {
  const parsed = databaseEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error("Invalid database environment variables:", parsed.error.flatten().fieldErrors);
    throw new Error("Invalid database environment variables");
  }

  return parsed.data.DATABASE_URL;
}

export function getCronSecret(): string {
  const parsed = cronEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error("Invalid cron environment variables:", parsed.error.flatten().fieldErrors);
    throw new Error("Invalid cron environment variables");
  }

  return parsed.data.CRON_SECRET;
}
