import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { draftMode } from "next/headers";
import { createClient } from "next-sanity";

import { env } from "@/env.mjs";

/**
 * Sanity client configuration for read operations (public content)
 * Uses CDN for better performance with cached content
 */
export const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-01-01",
  useCdn: true, // Enable CDN for faster reads
  perspective: "published", // Only fetch published content
});

/**
 * Sanity client for write operations (authenticated mutations)
 * No CDN, direct connection to Sanity API
 * Requires SANITY_API_WRITE_TOKEN (Editor+) for admin/contact/seed
 */
export const writeClient = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-01-01",
  useCdn: false, // No CDN for writes
  token: env.SANITY_API_WRITE_TOKEN,
  perspective: "published",
});

/**
 * Sanity client for preview mode (draft content)
 * Uses SANITY_API_READ_TOKEN to access unpublished/draft content
 * No CDN to ensure fresh draft data
 */
export const previewClient = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-01-01",
  useCdn: false, // No CDN for drafts
  token: env.SANITY_API_READ_TOKEN,
  perspective: "previewDrafts", // Fetch draft content
});

/** Whether Next.js draft mode is active (set via /api/preview). */
export async function isPreviewMode(): Promise<boolean> {
  try {
    const { isEnabled } = await draftMode();
    return isEnabled;
  } catch {
    return false;
  }
}

/**
 * Get the appropriate client based on preview mode
 * @param preview - Whether to use preview client (defaults to checking preview mode)
 * @returns Sanity client instance
 */
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

/**
 * Sanity image URL builder helper
 * Used for generating optimized image URLs from Sanity image references
 */
const builder = imageUrlBuilder(client);

/**
 * Build an image URL from a Sanity image source
 * @param source - Sanity image reference
 * @returns Image URL builder instance
 */
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
