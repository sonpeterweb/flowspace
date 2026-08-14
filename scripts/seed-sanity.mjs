import { createClient } from "@sanity/client";

const SEED_TYPES = [
  "blogPost",
  "author",
  "caseStudy",
  "docPage",
  "testimonial",
  "pricingTier",
  "feature",
  "integration",
  "pageHome",
  "siteSettings",
];

function block(text, style = "normal") {
  return {
    _type: "block",
    _key: `${Math.random().toString(36).slice(2, 9)}`,
    style,
    markDefs: [],
    children: [{ _type: "span", text, marks: [] }],
  };
}

function blocks(...paragraphs) {
  return paragraphs.map((text) => block(text));
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function daysAgo(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const isFresh = process.argv.includes("--fresh");

const client = createClient({
  projectId: requiredEnv("NEXT_PUBLIC_SANITY_PROJECT_ID"),
  dataset: requiredEnv("NEXT_PUBLIC_SANITY_DATASET"),
  token: requiredEnv("SANITY_API_WRITE_TOKEN"),
  apiVersion: "2025-01-01",
  useCdn: false,
});

async function documentCount(type) {
  return client.fetch(`count(*[_type == $type])`, { type });
}

async function hasDocuments(type) {
  return (await documentCount(type)) > 0;
}

async function clearSeedContent() {
  console.log("Clearing existing demo content...");

  for (const type of SEED_TYPES) {
    const ids = await client.fetch(`*[_type == $type]._id`, { type });
    for (const id of ids) {
      await client.delete(id);
    }
    if (ids.length > 0) {
      console.log(`  deleted ${ids.length} ${type} document(s)`);
    }
  }
}

async function seedSiteSettings() {
  if (!isFresh && (await hasDocuments("siteSettings"))) return;

  await client.create({
    _type: "siteSettings",
    siteTitle: "Flowspace",
    metaDescription:
      "A modern collaboration workspace for teams that want projects, knowledge and communication in one place.",
    navLinks: [
      { label: "Features", href: "/features" },
      { label: "Pricing", href: "/pricing" },
      { label: "Case Studies", href: "/case-studies" },
      { label: "Blog", href: "/blog" },
      { label: "Docs", href: "/docs" },
      { label: "Contact", href: "/contact" },
    ],
  });
}

async function seedHomePage() {
  if (!isFresh && (await hasDocuments("pageHome"))) return;

  await client.create({
    _type: "pageHome",
    heroTitle: "Work Together. Flow Better.",
    heroSubtitle:
      "A modern collaboration workspace for teams that want projects, knowledge and communication in one place.",
    cta: "Explore Features",
  });
}

async function seedFeatures() {
  if (!isFresh && (await hasDocuments("feature"))) return;

  const features = [
    {
      title: "CMS-Driven Marketing",
      description:
        "Hero copy, features, pricing, and navigation are managed in Sanity — update the site without redeploying code.",
      icon: "database",
      category: "integration",
    },
    {
      title: "Admin Content Management",
      description:
        "Secured admin panel to create, edit, and delete blog posts, testimonials, and pricing tiers directly in Sanity.",
      icon: "layout-dashboard",
      category: "productivity",
    },
    {
      title: "Blog with Search & Tags",
      description:
        "Full blog with authors, cover images, tag filters, pagination, and server-side search across titles and content.",
      icon: "newspaper",
      category: "productivity",
    },
    {
      title: "Documentation Hub",
      description:
        "Category-organized docs with sidebar navigation, breadcrumbs, in-page table of contents, and search.",
      icon: "book-open",
      category: "productivity",
    },
    {
      title: "Draft Preview Mode",
      description:
        "Preview unpublished Sanity content before it goes live using Next.js draft mode and a visible preview indicator.",
      icon: "eye",
      category: "productivity",
    },
    {
      title: "Contact Form Pipeline",
      description:
        "Validated contact form with toast feedback — submissions are stored in Sanity and viewable in the admin panel.",
      icon: "mail",
      category: "productivity",
    },
    {
      title: "Case Studies",
      description:
        "Showcase customer stories with outcome metrics, summaries, and rich Portable Text body content from the CMS.",
      icon: "briefcase",
      category: "productivity",
    },
    {
      title: "Dynamic Pricing Pages",
      description:
        "CMS-managed pricing tiers with monthly/yearly toggle, feature lists, and popular-plan highlighting.",
      icon: "credit-card",
      category: "productivity",
    },
    {
      title: "Customer Testimonials",
      description:
        "Ratings, quotes, and company names pulled from Sanity and displayed on the homepage and marketing pages.",
      icon: "message-square",
      category: "collaboration",
    },
    {
      title: "GitHub-Protected Admin",
      description:
        "Admin routes secured with NextAuth and GitHub OAuth — only authenticated users can manage content.",
      icon: "shield",
      category: "security",
    },
    {
      title: "SEO & Discoverability",
      description:
        "Dynamic sitemap, robots.txt, Open Graph metadata, and per-page titles generated for every route.",
      icon: "globe",
      category: "integration",
    },
    {
      title: "ISR & Smart Caching",
      description:
        "Incremental static regeneration and tagged cache revalidation keep marketing pages fast and fresh.",
      icon: "zap",
      category: "integration",
    },
    {
      title: "Type-Safe Content",
      description:
        "Zod schemas validate every Sanity fetch at runtime — invalid CMS data is caught before it reaches the UI.",
      icon: "check-circle",
      category: "integration",
    },
    {
      title: "Rich Portable Text",
      description:
        "Blog posts and docs support headings, paragraphs, images, and code blocks rendered from Sanity Portable Text.",
      icon: "file-text",
      category: "productivity",
    },
    {
      title: "Accessible & Responsive UI",
      description:
        "Mobile navigation, skip links, ARIA labels, keyboard support, and dark mode across all marketing pages.",
      icon: "smartphone",
      category: "productivity",
    },
  ];

  for (const feature of features) {
    await client.create({ _type: "feature", ...feature });
  }
}

async function seedIntegrations() {
  if (!isFresh && (await hasDocuments("integration"))) return;

  const integrations = [
    { name: "Slack", href: "https://slack.com", sortOrder: 1 },
    { name: "GitHub", href: "https://github.com", sortOrder: 2 },
    { name: "Google Drive", href: "https://drive.google.com", sortOrder: 3 },
    { name: "Figma", href: "https://www.figma.com", sortOrder: 4 },
    { name: "Notion", href: "https://www.notion.so", sortOrder: 5 },
  ];

  for (const integration of integrations) {
    await client.create({ _type: "integration", ...integration });
  }
}

async function seedPricing() {
  if (!isFresh && (await hasDocuments("pricingTier"))) return;

  const tiers = [
    {
      name: "Starter",
      monthlyPrice: 19,
      yearlyPrice: 190,
      features: [
        "Up to 10 users",
        "3 active projects",
        "Basic workflows",
        "Email support",
      ],
      buttonLabel: "See features",
      popular: false,
    },
    {
      name: "Pro",
      monthlyPrice: 49,
      yearlyPrice: 490,
      features: [
        "Unlimited users",
        "Unlimited projects",
        "Advanced automations",
        "Priority support",
        "Audit logs",
      ],
      buttonLabel: "View case studies",
      popular: true,
    },
    {
      name: "Enterprise",
      monthlyPrice: 99,
      yearlyPrice: 990,
      features: [
        "Everything in Pro",
        "SSO & SAML",
        "Dedicated success manager",
        "Custom integrations",
        "SLA guarantee",
      ],
      buttonLabel: "Get in touch",
      popular: false,
    },
  ];

  for (const tier of tiers) {
    await client.create({ _type: "pricingTier", ...tier });
  }
}

async function seedTestimonials() {
  if (!isFresh && (await hasDocuments("testimonial"))) return;

  const testimonials = [
    {
      name: "Operations Lead",
      company: "Illustrative · product team, ~12 people",
      quote:
        "Monday status meetings dropped from 45 minutes to a written check-in. Blockers were already on the board before we joined the call.",
      rating: 5,
    },
    {
      name: "Product Manager",
      company: "Illustrative · B2B SaaS",
      quote:
        "Client projects finally had their own permission boundary. Stakeholders saw progress without reading internal threads.",
      rating: 5,
    },
    {
      name: "Design Director",
      company: "Illustrative · agency studio",
      quote:
        "Handoffs stopped living in three Slack channels. The brief, Figma link, and approval notes sat next to the ticket.",
      rating: 4,
    },
  ];

  for (const testimonial of testimonials) {
    await client.create({ _type: "testimonial", ...testimonial });
  }
}

async function seedAuthors() {
  if (!isFresh && (await hasDocuments("author"))) {
    return client.fetch(`*[_type == "author"]{ _id, name, slug }`);
  }

  const authors = [
    {
      name: "Jordan Lee",
      slug: "jordan-lee",
      bio: "Writes about how small product teams run projects day to day.",
    },
    {
      name: "Maya Ortiz",
      slug: "maya-ortiz",
      bio: "Former eng lead on a remote tooling team.",
    },
    {
      name: "Chris Alvarez",
      slug: "chris-alvarez",
      bio: "Helps agencies keep design handoffs and client feedback in one place.",
    },
  ];

  const created = [];
  for (const author of authors) {
    const doc = await client.create({
      _type: "author",
      name: author.name,
      slug: { _type: "slug", current: author.slug },
      bio: author.bio,
    });
    created.push(doc);
  }
  return created;
}

async function seedBlogPosts(authors) {
  if (!isFresh && (await hasDocuments("blogPost"))) return;

  const posts = [
    {
      title: "How a 12-person product team reduced weekly status meetings",
      excerpt:
        "What changed when updates lived on the board instead of a recurring calendar invite.",
      tags: ["collaboration", "meetings"],
      authorIndex: 0,
      daysAgo: 3,
      content: blocks(
        "We used to spend Monday mornings restating work that was already written somewhere else.",
        "Moving status into the project board meant the meeting only covered decisions and blockers.",
        "The first two weeks felt awkward. By week four, people stopped asking for a slide deck.",
      ),
    },
    {
      title: "Designing permissions for client-facing project workspaces",
      excerpt:
        "A practical model for sharing progress without exposing internal discussion.",
      tags: ["permissions", "clients"],
      authorIndex: 1,
      daysAgo: 9,
      content: blocks(
        "Clients need visibility. They do not need every Slack-adjacent debate attached to a task.",
        "We settled on project-level guest roles with a curated view: milestones, files, and approved notes.",
        "Default-deny on internal comments saved more support time than any onboarding doc.",
      ),
    },
    {
      title: "What we learned migrating a team from spreadsheets to shared workflows",
      excerpt:
        "A small pilot beat a big-bang import — and cleaned data mattered more than speed.",
      tags: ["migration", "workflows"],
      authorIndex: 0,
      daysAgo: 16,
      content: blocks(
        "One team, one workflow, two sprints of parallel tracking. That was the deal.",
        "Mapping spreadsheet columns to fields before import caught naming messes early.",
        "Cutover happened when the pilot team stopped opening the sheet first.",
      ),
    },
    {
      title: "When GitHub issues and the project board disagree",
      excerpt:
        "Pick a source of truth, then automate the boring sync — not the judgment calls.",
      tags: ["engineering", "integrations"],
      authorIndex: 1,
      daysAgo: 23,
      content: blocks(
        "Duplicate status updates create quiet distrust between eng and product.",
        "We made GitHub the source for implementation state and the board the source for planning state.",
        "PR links on tasks beat copying titles into a second tracker.",
      ),
    },
    {
      title: "Running a remote retrospective that produces three action items",
      excerpt:
        "Collect input async, limit the list, and track follow-through like real work.",
      tags: ["remote", "culture"],
      authorIndex: 2,
      daysAgo: 30,
      content: blocks(
        "Async prompts before the call gave quieter teammates equal weight.",
        "Three action items max. Anything else went to a parking lot with an owner for later.",
        "Retro actions became tasks with due dates — otherwise they vanished by Thursday.",
      ),
    },
  ];

  for (const post of posts) {
    const author = authors[post.authorIndex % authors.length];
    await client.create({
      _type: "blogPost",
      title: post.title,
      slug: { _type: "slug", current: slugify(post.title) },
      author: { _type: "reference", _ref: author._id },
      publishedAt: daysAgo(post.daysAgo),
      excerpt: post.excerpt,
      tags: post.tags,
      content: post.content,
    });
  }
}

async function seedCaseStudies() {
  if (!isFresh && (await hasDocuments("caseStudy"))) return;

  const studies = [
    {
      title: "Northwind Labs scaled delivery by 40%",
      client: "Northwind Labs",
      summary:
        "A product team used Flowspace to streamline planning and reduce handoff delays across three time zones.",
      outcomes: [
        { metric: "Delivery speed", value: "+40%" },
        { metric: "Meeting time", value: "-25%" },
      ],
      body: blocks(
        "Northwind Labs adopted Flowspace to unify project tracking and async updates across engineering, design, and PM.",
        "Custom workflows mirrored their sprint cadence. Automations nudged owners when tasks stalled.",
      ),
    },
    {
      title: "Brightpath Studio cut client revision cycles in half",
      client: "Brightpath Studio",
      summary:
        "A design agency centralized feedback and approvals, reducing back-and-forth with clients.",
      outcomes: [
        { metric: "Revision rounds", value: "-50%" },
        { metric: "Client NPS", value: "+18 pts" },
      ],
      body: blocks(
        "Client-facing boards gave stakeholders one link for status, files, and comments.",
        "Internal teams stopped duplicating updates in email and Slack.",
      ),
    },
    {
      title: "Summit Health achieved SOC 2 readiness faster",
      client: "Summit Health",
      summary:
        "Healthcare startup used audit logs and role-based access to meet compliance requirements.",
      outcomes: [
        { metric: "Audit prep time", value: "-60%" },
        { metric: "Access reviews", value: "100% coverage" },
      ],
      body: blocks(
        "SSO and granular permissions replaced shared accounts. Every change was traceable.",
        "Compliance reviews pulled reports directly from Flowspace instead of manual spreadsheets.",
      ),
    },
    {
      title: "Atlas Dev Co. unified 12 product squads",
      client: "Atlas Dev Co.",
      summary:
        "A growing SaaS company replaced fragmented tools with one workspace for all squads.",
      outcomes: [
        { metric: "Tool spend", value: "-35%" },
        { metric: "Cross-team visibility", value: "3x" },
      ],
      body: blocks(
        "Each squad kept its own board while leadership rolled up metrics in a shared dashboard.",
        "GitHub and Slack integrations meant engineers barely changed daily habits.",
      ),
    },
  ];

  for (const study of studies) {
    await client.create({
      _type: "caseStudy",
      slug: { _type: "slug", current: slugify(study.title) },
      ...study,
    });
  }
}

async function seedDocs() {
  if (!isFresh && (await hasDocuments("docPage"))) return;

  const docs = [
    {
      title: "Welcome to Flowspace",
      slug: "welcome",
      category: "getting-started",
      order: 1,
      content: blocks(
        "Welcome to Flowspace documentation.",
        "Flowspace is a collaboration platform for teams who want clarity without calendar overload.",
        "This guide covers setup, invites, and your first project.",
      ),
    },
    {
      title: "Creating Your Workspace",
      slug: "creating-your-workspace",
      category: "getting-started",
      order: 2,
      content: blocks(
        "Sign up with GitHub or email, then name your workspace.",
        "Invite teammates from Settings → Members. Assign roles: Admin, Member, or Guest.",
        "Guests can access specific projects without seeing the full workspace.",
      ),
    },
    {
      title: "Your First Project",
      slug: "your-first-project",
      category: "getting-started",
      order: 3,
      content: blocks(
        "Projects contain boards, docs, and files. Create one from the sidebar.",
        "Choose a template: Kanban, Sprint, or Blank. Templates pre-configure statuses.",
        "Add tasks, assign owners, and set due dates. Drag cards to update status.",
      ),
    },
    {
      title: "Managing Tasks & Boards",
      slug: "managing-tasks-and-boards",
      category: "guides",
      order: 1,
      content: blocks(
        "Boards visualize work across columns. Customize columns to match your process.",
        "Use filters to view by assignee, label, or due date.",
        "Bulk-select tasks to reassign or move in one action.",
      ),
    },
    {
      title: "Team Permissions",
      slug: "team-permissions",
      category: "guides",
      order: 2,
      content: blocks(
        "Admins manage billing, SSO, and workspace settings.",
        "Members create and edit content in projects they belong to.",
        "Project-level permissions override workspace defaults when needed.",
      ),
    },
    {
      title: "Workflow Automations",
      slug: "workflow-automations",
      category: "guides",
      order: 3,
      content: blocks(
        "Automations trigger actions when conditions are met — e.g. notify Slack when a task is blocked.",
        "Start with templates, then customize triggers and actions.",
        "Test automations in a sandbox project before rolling out team-wide.",
      ),
    },
    {
      title: "Authentication",
      slug: "authentication",
      category: "api",
      order: 1,
      content: blocks(
        "Flowspace supports GitHub OAuth and token-based API access.",
        "Generate API tokens from Settings → Developer. Store tokens in environment variables.",
        "Never commit tokens to version control.",
      ),
    },
    {
      title: "REST API Overview",
      slug: "rest-api-overview",
      category: "api",
      order: 2,
      content: blocks(
        "The REST API is available at https://api.flowspace.dev/v1.",
        "All requests require a Bearer token in the Authorization header.",
        "Rate limits: 1000 requests/hour on Pro, 10000 on Enterprise.",
      ),
    },
    {
      title: "Webhooks",
      slug: "webhooks",
      category: "api",
      order: 3,
      content: blocks(
        "Subscribe to events: task.created, task.updated, comment.added, and more.",
        "Verify webhook signatures using the secret shown at registration.",
        "Respond with 200 within 5 seconds; retries use exponential backoff.",
      ),
    },
    {
      title: "Common Login Issues",
      slug: "common-login-issues",
      category: "troubleshooting",
      order: 1,
      content: blocks(
        "If SSO fails, confirm your identity provider metadata URL is correct.",
        "Clear cookies and try incognito mode to rule out extension conflicts.",
        "Contact support@flowspace.dev with your workspace slug if issues persist.",
      ),
    },
    {
      title: "Sync & Integration Errors",
      slug: "sync-integration-errors",
      category: "troubleshooting",
      order: 2,
      content: blocks(
        "GitHub sync requires repo admin access. Re-authorize from Integrations settings.",
        "Slack notifications fail silently if the bot was removed from a channel — re-invite it.",
        "Check the integration health dashboard for last sync time and error messages.",
      ),
    },
  ];

  for (const doc of docs) {
    await client.create({
      _type: "docPage",
      title: doc.title,
      slug: { _type: "slug", current: doc.slug },
      category: doc.category,
      order: doc.order,
      content: doc.content,
    });
  }
}

async function printSummary() {
  const counts = Object.fromEntries(
    await Promise.all(
      SEED_TYPES.map(async (type) => [type, await documentCount(type)]),
    ),
  );

  console.log("\nDemo content summary:");
  for (const [type, count] of Object.entries(counts)) {
    console.log(`  ${type}: ${count}`);
  }
}

async function main() {
  if (isFresh) {
    console.log("Fresh seed: replacing all demo content...");
    await clearSeedContent();
  } else {
    console.log("Seeding Sanity demo content (existing types are skipped)...");
    console.log("Tip: run with --fresh to replace all demo content.\n");
  }

  await seedSiteSettings();
  await seedHomePage();
  await seedFeatures();
  await seedIntegrations();
  await seedPricing();
  await seedTestimonials();
  const authors = await seedAuthors();
  await seedBlogPosts(authors);
  await seedCaseStudies();
  await seedDocs();

  await printSummary();
  console.log("\nSeed complete.");
  console.log("Restart `npm run dev` to clear cached page data.");
}

main().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
