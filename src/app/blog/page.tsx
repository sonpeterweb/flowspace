import type { Metadata } from "next";
import Link from "next/link";

import { BlogCard } from "@/components/blog/blog-card";
import { BlogTags } from "@/components/blog/blog-tags";
import { BlogSearch } from "@/components/blog/search";
import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import { Section } from "@/components/common/section";
import { isPreviewMode } from "@/lib/sanity/client";
import { sanityFetch } from "@/lib/sanity/fetch";
import {
  allBlogTagsQuery,
  blogPostCountQuery,
  blogPostsByTagQuery,
  blogPostsPaginatedPreviewQuery,
  blogPostsPaginatedQuery,
  blogPostsSearchCountQuery,
  blogPostsSearchQuery,
} from "@/lib/sanity/queries";
import { SANITY_CACHE_TAGS } from "@/lib/sanity/revalidate";
import {
  type BlogPostWithAuthor,
  blogPostWithAuthorSchema,
} from "@/lib/sanity/zod";
import { buildMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

const POSTS_PER_PAGE = 6;

export const metadata: Metadata = buildMetadata({
  title: "Blog",
  description:
    "Notes on meetings, permissions, migrations, and how small teams run projects.",
});

type BlogPageProps = {
  searchParams?: Promise<{
    page?: string;
    tag?: string;
    search?: string;
  }>;
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const pageParam = Number(resolvedSearchParams.page) || 1;
  const currentPage = Math.max(1, pageParam);
  const tag = resolvedSearchParams.tag?.trim() || null;
  const searchTerm = resolvedSearchParams.search?.trim() || null;

  const preview = await isPreviewMode();

  const [tags, postsData] = await Promise.all([
    sanityFetch<string[]>(
      allBlogTagsQuery,
      {},
      {
        cacheKey: ["blog-tags"],
        tags: [SANITY_CACHE_TAGS.blog],
        preview,
      },
    ),
    fetchPosts({ page: currentPage, tag, search: searchTerm, preview }),
  ]);

  // Fetch all posts for search component (for client-side filtering in the dialog)
  const query = preview
    ? blogPostsPaginatedPreviewQuery
    : blogPostsPaginatedQuery;
  const allPostsForSearch = searchTerm
    ? postsData.posts
    : await sanityFetch<unknown[]>(
        query,
        { start: 0, end: 50 },
        {
          cacheKey: ["blog-posts-search-index"],
          tags: [SANITY_CACHE_TAGS.blog],
          preview,
        },
      );

  return (
    <>
      <Header />
      <main id="main-content">
        <Section
          title="Blog"
          description="Practical notes from teams figuring out how to work together."
        >
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <BlogTags
                tags={tags ?? []}
                activeTag={tag}
                buildHref={(nextTag) => {
                  const params = new URLSearchParams();
                  if (nextTag) params.set("tag", nextTag);
                  if (searchTerm) params.set("search", searchTerm);
                  return `/blog${params.size ? `?${params.toString()}` : ""}`;
                }}
              />
            </div>
            <div className="sm:w-auto">
              <BlogSearch
                posts={
                  Array.isArray(allPostsForSearch)
                    ? allPostsForSearch
                        .map((post: unknown) =>
                          blogPostWithAuthorSchema.safeParse(post),
                        )
                        .filter(
                          (
                            result,
                          ): result is {
                            success: true;
                            data: BlogPostWithAuthor;
                          } => result.success,
                        )
                        .map((result) => result.data)
                    : postsData.posts
                }
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {postsData.posts.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>

          {postsData.totalPages > 1 && (
            <Pagination
              currentPage={postsData.currentPage}
              totalPages={postsData.totalPages}
              activeTag={tag}
              searchTerm={searchTerm}
            />
          )}

          {postsData.posts.length === 0 && (
            <div className="text-muted-foreground flex flex-col items-center gap-3 py-12 text-center">
              <p className="text-base font-medium">
                {searchTerm
                  ? `No posts found for "${searchTerm}"`
                  : tag
                    ? `No posts found for tag "${tag}"`
                    : "No posts found"}
              </p>
              <p className="text-sm">
                {searchTerm
                  ? "Try searching with different keywords or browse all posts."
                  : tag
                    ? "Try selecting a different tag or browse all posts."
                    : "Check back later for new posts."}
              </p>
            </div>
          )}
        </Section>
      </main>
      <Footer />
    </>
  );
}

async function fetchPosts({
  page,
  tag,
  search,
  preview = false,
}: {
  page: number;
  tag: string | null;
  search: string | null;
  preview?: boolean;
}): Promise<{
  posts: BlogPostWithAuthor[];
  totalPages: number;
  currentPage: number;
}> {
  if (search) {
    const searchTerm = `*${search}*`;
    const [rawPosts, totalCount] = await Promise.all([
      sanityFetch<unknown[]>(
        blogPostsSearchQuery,
        { searchTerm },
        {
          cacheKey: ["blog-search", search],
          tags: [SANITY_CACHE_TAGS.blog],
          preview,
        },
      ),
      sanityFetch<number>(
        blogPostsSearchCountQuery,
        { searchTerm },
        {
          cacheKey: ["blog-search-count", search],
          tags: [SANITY_CACHE_TAGS.blog],
          preview,
        },
      ),
    ]);

    const allPosts = (Array.isArray(rawPosts) ? rawPosts : [])
      .map((post: unknown) => blogPostWithAuthorSchema.safeParse(post))
      .filter(
        (result): result is { success: true; data: BlogPostWithAuthor } =>
          result.success,
      )
      .map((result) => result.data);

    const totalPages = Math.max(
      1,
      Math.ceil((totalCount ?? 0) / POSTS_PER_PAGE),
    );
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * POSTS_PER_PAGE;
    const posts = allPosts.slice(start, start + POSTS_PER_PAGE);

    return { posts, totalPages, currentPage: safePage };
  }

  // Handle tag filter
  if (tag) {
    const raw = await sanityFetch<unknown[]>(
      blogPostsByTagQuery,
      { tag },
      {
        cacheKey: ["blog-tag", tag],
        tags: [SANITY_CACHE_TAGS.blog],
        preview,
      },
    );
    const parsed = (Array.isArray(raw) ? raw : []) as unknown[];
    const safePosts = parsed
      .map((post: unknown) => blogPostWithAuthorSchema.safeParse(post))
      .filter(
        (result): result is { success: true; data: BlogPostWithAuthor } =>
          result.success,
      )
      .map((result) => result.data);

    const totalPages = Math.max(
      1,
      Math.ceil(safePosts.length / POSTS_PER_PAGE),
    );
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * POSTS_PER_PAGE;
    const posts = safePosts.slice(start, start + POSTS_PER_PAGE);

    return { posts, totalPages, currentPage: safePage };
  }

  const start = (page - 1) * POSTS_PER_PAGE;
  const end = start + POSTS_PER_PAGE;

  const paginatedQuery = preview
    ? blogPostsPaginatedPreviewQuery
    : blogPostsPaginatedQuery;
  const [rawPosts, totalCount] = await Promise.all([
    sanityFetch<unknown[]>(
      paginatedQuery,
      { start, end },
      {
        cacheKey: ["blog-posts-page", String(page), tag ?? "", search ?? ""],
        tags: [SANITY_CACHE_TAGS.blog],
        preview,
      },
    ),
    sanityFetch<number>(
      blogPostCountQuery,
      {},
      {
        cacheKey: ["blog-post-count"],
        tags: [SANITY_CACHE_TAGS.blog],
        preview,
      },
    ),
  ]);

  const posts = (Array.isArray(rawPosts) ? rawPosts : [])
    .map((post: unknown) => blogPostWithAuthorSchema.safeParse(post))
    .filter(
      (result): result is { success: true; data: BlogPostWithAuthor } =>
        result.success,
    )
    .map((result) => result.data);

  const totalPages = Math.max(1, Math.ceil((totalCount ?? 0) / POSTS_PER_PAGE));
  const safePage = Math.min(page, totalPages);

  return { posts, totalPages, currentPage: safePage };
}

function Pagination({
  currentPage,
  totalPages,
  activeTag,
  searchTerm,
}: {
  currentPage: number;
  totalPages: number;
  activeTag: string | null;
  searchTerm: string | null;
}) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  function buildHref(page: number) {
    const params = new URLSearchParams();
    if (page > 1) params.set("page", String(page));
    if (activeTag) params.set("tag", activeTag);
    if (searchTerm) params.set("search", searchTerm);
    const query = params.toString();
    return `/blog${query ? `?${query}` : ""}`;
  }

  return (
    <nav
      aria-label="Blog pagination"
      className="mt-8 flex flex-wrap items-center justify-center gap-2"
    >
      {pages.map((page) => (
        <Link
          key={page}
          href={buildHref(page)}
          aria-current={page === currentPage ? "page" : undefined}
          className={cn(
            "rounded-md border px-3 py-2 text-sm",
            page === currentPage && "bg-primary text-primary-foreground",
          )}
        >
          {page}
        </Link>
      ))}
    </nav>
  );
}
