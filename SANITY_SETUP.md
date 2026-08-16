# Sanity CMS Setup Guide

This guide covers Sanity project setup, environment variables, Studio deploy, and on-demand revalidation.

## Step 1: Create a Sanity Account and Project

1. Go to [https://www.sanity.io/](https://www.sanity.io/) and sign up for a free account
2. Once logged in, create a new project:
   - Click "Create new project"
   - Enter a project name (e.g., "Flowspace CMS")
   - Choose a dataset name (typically `production`)
   - Select the nearest region

## Step 2: Get Your Project Credentials

1. Go to [https://www.sanity.io/manage](https://www.sanity.io/manage)
2. Select your project
3. Go to **API** in the project settings
4. You'll need:
   - **Project ID** — under "Project ID" (e.g. `abc12345`)
   - **Dataset** — usually `production`
   - **API Tokens** (separate read vs write scopes)
     - Go to **API** → **Tokens**
     - `SANITY_API_READ_TOKEN` — for draft/preview reads (Viewer+; use Editor if draft access fails)
     - `SANITY_API_WRITE_TOKEN` — for mutations (admin CRUD, contact form, seed); **Editor** or higher
     - Prefer two tokens so a leaked preview credential cannot mutate content

## Step 3: Configure Environment Variables

Create `.env.local` in the project root (see [`.env.example`](.env.example)):

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=your_read_token_here
SANITY_API_WRITE_TOKEN=your_write_token_here
SANITY_PREVIEW_SECRET=your_preview_secret_here
SANITY_REVALIDATE_SECRET=your_webhook_secret_here
APP_URL=http://localhost:3000
```

**Notes:**

- `NEXT_PUBLIC_*` variables are exposed to the browser
- Never commit `.env.local` to git (already in `.gitignore`)
- Environment variables are validated at build time
- Keep read and write tokens separate — names should match privilege

## Step 4: Deploy Sanity Studio (optional)

Deploy Studio separately so editors can manage content without running the Next.js app locally.

This project includes a self-contained Studio in `sanity/` (`sanity.cli.ts`, `sanity.config.ts`, and `package.json`).

The Studio reads its own env file — copy `sanity/.env.example` to `sanity/.env` and set:

```env
SANITY_STUDIO_PROJECT_ID=your_project_id
SANITY_STUDIO_DATASET=production
```

> Only `SANITY_STUDIO_*` variables are exposed to the Studio bundle; the Next.js `NEXT_PUBLIC_*` vars are not visible to it.

Then deploy from the **repo root** (Studio deps install automatically):

```bash
npm run sanity:deploy
```

> Do **not** run bare `npx sanity deploy` from the repo root — it won't load `sanity/.env` or find the Studio config. Use `npm run sanity:deploy`, or from `sanity/` run `npm run deploy`.

On first deploy, the CLI prompts you to choose a studio hostname (e.g. `flowspace-demo`). Your Studio URL will be `https://flowspace-demo.sanity.studio`.

If you are not logged in yet:

```bash
npx sanity login
```

Or host Studio at `/studio` in the Next.js app — see [Sanity + Next.js docs](https://www.sanity.io/docs/js-client).

## Step 5: Seed Demo Content

```bash
npm run seed:sanity:fresh
```

This clears and re-seeds blog posts, case studies, docs, features, pricing, and site settings.

## Step 6: On-Demand Revalidation Webhook

When content is published in Sanity, trigger ISR cache busting without a full redeploy:

1. Generate a secret (e.g. `openssl rand -hex 32`) and add it to `.env.local` as `SANITY_REVALIDATE_SECRET`
2. In [Sanity Manage](https://www.sanity.io/manage) → your project → **API** → **Webhooks** → **Create webhook**
3. Configure:
   - **URL:** `https://your-site.com/api/revalidate?secret=YOUR_SECRET`
   - **Dataset:** `production`
   - **Trigger on:** Create, Update, Delete
   - **Filter:** `_type in ["blogPost","docPage","caseStudy","feature","testimonial","pricingTier","integration","pageHome","siteSettings"]`
4. Publish content in Studio — the site should revalidate within seconds

## Step 7: Preview Draft Content

1. Set `SANITY_API_READ_TOKEN` for draft/preview reads (not the write token).
2. Set `SANITY_PREVIEW_SECRET` (e.g. `openssl rand -hex 32`) — required in production so only authorized users can enable draft mode.
3. In Studio, leave **Published At** empty on a blog post to keep it as a draft.
4. **From the admin panel:** sign in at `/admin` and click **Preview** on a blog post, or **Preview home page** on the dashboard (opens draft mode in a new tab — no secret in the URL).

5. **Manual URL** (optional, for external reviewers): open preview in the browser:

   ```
   http://localhost:3000/api/preview?secret=YOUR_PREVIEW_SECRET&slug=blog/your-post-slug
   ```

   **One-click demo** (after deploy, replace host and secret):

   ```
   https://flowspacestudio.vercel.app/api/preview?secret=YOUR_PREVIEW_SECRET&slug=blog/how-high-performing-teams-stay-aligned
   ```

   Shorthand for blog posts only: `?secret=…&slug=your-post-slug` (auto-prefixes `blog/`).
   For docs: `?secret=…&slug=docs/your-doc-slug`.

   A yellow bar confirms draft mode. It stays on **every page** until you exit — that is expected.

6. Exit via **Exit Preview** in the bar, or visit `/api/exit-preview`.

**Security:** When `SANITY_PREVIEW_SECRET` is set, middleware rejects draft-mode cookies that were not issued through `/api/preview` or `/api/admin/preview` (admin route requires GitHub sign-in).

If `SANITY_PREVIEW_SECRET` is unset (local dev only), preview works without a secret query param.

After changing the blog schema, restart Studio (`npm run sanity:dev`) or redeploy (`npm run sanity:deploy`).

## Step 8: Verify Setup

Restart the dev server after setting env vars:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Missing required variables will surface as build-time errors.

## Resources

- [Sanity Documentation](https://www.sanity.io/docs)
- [Next.js + Sanity Integration](https://www.sanity.io/docs/js-client)
- [Sanity Project Management](https://www.sanity.io/manage)
