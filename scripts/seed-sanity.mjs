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
      "CMS-driven marketing platform built with Next.js + Sanity — headless CMS, preview, caching, admin CRUD, and SEO.",
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
    heroTitle: "CMS-Driven Marketing, Built to Ship.",
    heroSubtitle:
      "A portfolio demo built with Next.js and Sanity — headless CMS, preview mode, ISR caching, admin CRUD, and SEO.",
    cta: "View case studies",
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
    { name: "Sanity", href: "https://www.sanity.io", sortOrder: 1 },
    { name: "Next.js", href: "https://nextjs.org", sortOrder: 2 },
    { name: "Tailwind CSS", href: "https://tailwindcss.com", sortOrder: 3 },
    { name: "Vercel", href: "https://vercel.com", sortOrder: 4 },
    { name: "GitHub", href: "https://github.com", sortOrder: 5 },
    { name: "Radix UI", href: "https://www.radix-ui.com", sortOrder: 6 },
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
      name: "Alex Taylor",
      company: "Northwind Labs",
      quote:
        "Flowspace cut our coordination overhead in half and helped us ship faster across three time zones.",
      rating: 5,
    },
    {
      name: "Priya Sharma",
      company: "Brightpath Studio",
      quote:
        "We replaced four tools with Flowspace. Onboarding was smooth and the team adopted it in a week.",
      rating: 5,
    },
    {
      name: "Marcus Chen",
      company: "Atlas Dev Co.",
      quote:
        "The automations alone save us hours every sprint. Status updates write themselves now.",
      rating: 5,
    },
    {
      name: "Elena Rodriguez",
      company: "Summit Health",
      quote:
        "Security and audit logs were non-negotiable for us. Flowspace checked every box.",
      rating: 4,
    },
    {
      name: "James Okonkwo",
      company: "Riverstone Agency",
      quote:
        "Client projects finally live in one place. Our PMs spend less time chasing updates.",
      rating: 5,
    },
    {
      name: "Sarah Kim",
      company: "Launchpad HQ",
      quote:
        "From standups to retros, everything connects. It's the operating system for our product team.",
      rating: 5,
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
      name: "Jordan Smith",
      slug: "jordan-smith",
      bio: "Product engineer writing about collaboration and team workflows.",
    },
    {
      name: "Maya Patel",
      slug: "maya-patel",
      bio: "Engineering lead focused on async communication and developer productivity.",
    },
    {
      name: "Chris Alvarez",
      slug: "chris-alvarez",
      bio: "Design ops consultant helping teams scale without losing clarity.",
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
      title: "How High-Performing Teams Stay Aligned",
      excerpt:
        "Practical strategies for keeping distributed teams focused and accountable.",
      tags: ["collaboration", "productivity"],
      authorIndex: 0,
      daysAgo: 2,
      content: blocks(
        "Great teams don't rely on endless meetings. They build systems for visibility, feedback, and accountability.",
        "Start with a shared source of truth for priorities, then automate status updates so everyone knows what changed.",
        "Weekly async check-ins replace daily standups when work is documented well.",
      ),
    },
    {
      title: "5 Workflow Automations Every PM Should Set Up",
      excerpt:
        "Save hours each week with these high-impact automation recipes.",
      tags: ["productivity", "automation"],
      authorIndex: 0,
      daysAgo: 5,
      content: blocks(
        "Automations shine when they remove repetitive handoffs — not when they hide important decisions.",
        "Start with assignment rules when a task moves to 'In Review', then add reminder nudges for stale items.",
        "Connect Slack notifications for blockers only, so channels stay signal-heavy.",
      ),
    },
    {
      title: "Async-First Communication: A Practical Guide",
      excerpt:
        "How to run a distributed team without drowning in meetings.",
      tags: ["collaboration", "remote"],
      authorIndex: 1,
      daysAgo: 8,
      content: blocks(
        "Async-first doesn't mean never meeting — it means meetings are intentional and documented.",
        "Write decisions in the tool where work lives. Context switching kills momentum.",
        "Use Loom or short screen recordings for complex walkthroughs instead of live demos across time zones.",
      ),
    },
    {
      title: "Building a Culture of Documentation",
      excerpt:
        "Why writing things down scales better than tribal knowledge.",
      tags: ["productivity", "culture"],
      authorIndex: 1,
      daysAgo: 12,
      content: blocks(
        "Documentation is a product decision, not an afterthought. Treat docs like features with owners and review cycles.",
        "Start with onboarding guides and runbooks — they pay off immediately for new hires.",
        "Link docs from tasks so people find answers in context.",
      ),
    },
    {
      title: "Design Ops at Scale: Lessons from Brightpath Studio",
      excerpt:
        "How one agency unified design handoffs and client feedback.",
      tags: ["case-study", "design"],
      authorIndex: 2,
      daysAgo: 15,
      content: blocks(
        "Brightpath consolidated Figma comments, client approvals, and dev tickets into one Flowspace workspace.",
        "Designers tag engineers directly on components. Fewer Slack threads, faster sign-off.",
        "Client-facing views keep stakeholders in the loop without access to internal boards.",
      ),
    },
    {
      title: "Security Best Practices for Team Workspaces",
      excerpt:
        "SSO, permissions, and audit logs — what to configure on day one.",
      tags: ["security", "enterprise"],
      authorIndex: 1,
      daysAgo: 18,
      content: blocks(
        "Enable SSO before inviting the full org. Map groups to roles early.",
        "Use project-level permissions for client work. Default-deny beats cleanup later.",
        "Review audit logs monthly — patterns reveal process gaps before they become incidents.",
      ),
    },
    {
      title: "From Spreadsheets to Flowspace: A Migration Playbook",
      excerpt:
        "A step-by-step plan for moving project tracking off spreadsheets.",
      tags: ["productivity", "migration"],
      authorIndex: 0,
      daysAgo: 22,
      content: blocks(
        "Don't migrate everything at once. Pick one team and one workflow to pilot.",
        "Map spreadsheet columns to custom fields before import. Clean data beats fast data.",
        "Run parallel for two sprints, then cut over when confidence is high.",
      ),
    },
    {
      title: "Integrating GitHub Issues with Your Project Board",
      excerpt:
        "Keep engineering and product in sync with bi-directional sync.",
      tags: ["integration", "engineering"],
      authorIndex: 1,
      daysAgo: 26,
      content: blocks(
        "Link PRs to tasks so reviewers see full context without leaving GitHub.",
        "Status sync rules prevent duplicate updates — define which side is source of truth.",
        "Use labels to route bugs vs features into the right Flowspace projects automatically.",
      ),
    },
    {
      title: "Running Effective Remote Retrospectives",
      excerpt:
        "Templates and rituals that keep retros actionable, not performative.",
      tags: ["collaboration", "remote"],
      authorIndex: 2,
      daysAgo: 30,
      content: blocks(
        "Collect input async before the live session. Quiet voices get equal weight.",
        "Limit action items to three. More than that means nothing gets done.",
        "Track retro actions as tasks with owners — visibility drives follow-through.",
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
