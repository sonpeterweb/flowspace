import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    APP_URL: z.string().url().min(1),
    GITHUB_ID: z.string().min(1),
    GITHUB_SECRET: z.string().min(1),
    /** Comma-separated GitHub usernames allowed to access the admin panel. */
    ADMIN_GITHUB_LOGIN: z.string().min(1),
    NEXTAUTH_URL: z.string().url().optional(),
    NEXTAUTH_SECRET: z.string().min(1),
    /** Draft/preview reads only — do not use for mutations. */
    SANITY_API_READ_TOKEN: z.string().optional(),
    /** Mutations (admin CRUD, contact form, seed) — Editor+ scope. */
    SANITY_API_WRITE_TOKEN: z.string().optional(),
    SANITY_PREVIEW_SECRET: z.string().optional(),
    SANITY_REVALIDATE_SECRET: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().min(1),
    NEXT_PUBLIC_SANITY_DATASET: z.string().min(1),
  },
  runtimeEnv: {
    APP_URL: process.env.APP_URL,
    GITHUB_ID: process.env.GITHUB_ID,
    GITHUB_SECRET: process.env.GITHUB_SECRET,
    ADMIN_GITHUB_LOGIN: process.env.ADMIN_GITHUB_LOGIN,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    SANITY_API_READ_TOKEN: process.env.SANITY_API_READ_TOKEN,
    SANITY_API_WRITE_TOKEN: process.env.SANITY_API_WRITE_TOKEN,
    SANITY_PREVIEW_SECRET: process.env.SANITY_PREVIEW_SECRET,
    SANITY_REVALIDATE_SECRET: process.env.SANITY_REVALIDATE_SECRET,
    NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
  },
});
