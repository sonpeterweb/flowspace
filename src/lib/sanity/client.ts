import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { draftMode } from "next/headers";
import { createClient } from "next-sanity";

import { env } from "@/env.mjs";

/** CDN is fine for published marketing content; drafts/mutations must hit the API directly. */
export const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-01-01",
  useCdn: true,
  perspective: "published",
});

/** Mutations need a write token; CDN would serve stale reads after writes. */
export const writeClient = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-01-01",
  useCdn: false,
  token: env.SANITY_API_WRITE_TOKEN,
  perspective: "published",
});

/** Draft perspective + no CDN so preview always reflects unpublished edits. */
export const previewClient = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-01-01",
  useCdn: false,
  token: env.SANITY_API_READ_TOKEN,
  perspective: "previewDrafts",
});

export async function isPreviewMode(): Promise<boolean> {
  try {
    const { isEnabled } = await draftMode();
    return isEnabled;
  } catch {
    // draftMode() throws outside a request context (e.g. some build paths)
    return false;
  }
}

export async function getClient(preview?: boolean) {
  const shouldPreview = preview ?? (await isPreviewMode());
  if (shouldPreview) {
    if (!env.SANITY_API_READ_TOKEN) {
      throw new Error(
        "SANITY_API_READ_TOKEN is required to fetch draft content in preview mode.",
      );
    }
    return previewClient;
  }
  return client;
}

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
