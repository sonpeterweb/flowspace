import { unstable_cache } from "next/cache";

import { isCiSanityEnvironment } from "@/lib/sanity/ci";
import { client } from "@/lib/sanity/client";
import { MARKETING_REVALIDATE_SECONDS } from "@/lib/sanity/revalidate";

type CachedFetchOptions = {
  revalidate?: number;
  tags?: string[];
};

/**
 * Published Sanity fetch wrapped in Next.js ISR cache tags.
 * Returns null in CI placeholder projects so builds do not require a real dataset.
 */
export async function cachedSanityFetch<T>(
  cacheKey: string[],
  query: string,
  params: Record<string, unknown> = {},
  options: CachedFetchOptions = {},
): Promise<T | null> {
  const revalidate = options.revalidate ?? MARKETING_REVALIDATE_SECONDS;
  const tags = options.tags ?? cacheKey;

  const fetcher = unstable_cache(
    async () => client.fetch<T>(query, params),
    cacheKey,
    { revalidate, tags },
  );

  try {
    return await fetcher();
  } catch (error) {
    if (isCiSanityEnvironment()) {
      console.warn("Sanity fetch skipped in CI:", error);
      return null;
    }
    throw error;
  }
}
