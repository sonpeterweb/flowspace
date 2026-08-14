import type { Metadata } from "next";

import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import { Section } from "@/components/common/section";
import { FeatureCard } from "@/components/marketing/feature-card";
import Hero from "@/components/marketing/hero";
import Integrations from "@/components/marketing/integrations";
import { Reveal } from "@/components/marketing/reveal.client";
import { TestimonialCard } from "@/components/marketing/testimonial-card";
import { cachedSanityFetch } from "@/lib/sanity/cached-fetch";
import {
  allIntegrationsQuery,
  featuredFeaturesQuery,
  featuredTestimonialsQuery,
} from "@/lib/sanity/queries";
import { SANITY_CACHE_TAGS } from "@/lib/sanity/revalidate";
import {
  type Feature,
  featureSchema,
  type Integration,
  integrationSchema,
  type Testimonial,
  testimonialSchema,
} from "@/lib/sanity/zod";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = buildMetadata({
  title: "Home",
  description: siteConfig.description,
});

export default async function HomePage() {
  const [features, testimonials, integrationsRaw] = await Promise.all([
    cachedSanityFetch<unknown>(
      ["featured-features"],
      featuredFeaturesQuery,
      {},
      { tags: [SANITY_CACHE_TAGS.features] },
    ),
    cachedSanityFetch<unknown>(
      ["featured-testimonials"],
      featuredTestimonialsQuery,
      {},
      { tags: [SANITY_CACHE_TAGS.testimonials] },
    ),
    cachedSanityFetch<unknown>(
      ["all-integrations"],
      allIntegrationsQuery,
      {},
      { tags: [SANITY_CACHE_TAGS.integrations] },
    ),
  ]);

  const safeFeatures: Feature[] = (Array.isArray(features) ? features : [])
    .map((f) => featureSchema.safeParse(f))
    .filter((r): r is { success: true; data: Feature } => r.success)
    .map((r) => r.data);

  const safeTestimonials: Testimonial[] = (
    Array.isArray(testimonials) ? testimonials : []
  )
    .map((t) => testimonialSchema.safeParse(t))
    .filter((r): r is { success: true; data: Testimonial } => r.success)
    .map((r) => r.data);

  const integrations: Integration[] = (
    Array.isArray(integrationsRaw) ? integrationsRaw : []
  )
    .map((item) => integrationSchema.safeParse(item))
    .filter((r): r is { success: true; data: Integration } => r.success)
    .map((r) => r.data);

  return (
    <>
      <Header />
      <main id="main-content">
        <Hero />

        <Section
          title="Features"
          description="A few highlights from the platform."
        >
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {safeFeatures.map((f, i) => (
              <Reveal key={f._id} delay={i * 0.05}>
                <FeatureCard
                  title={f.title}
                  description={f.description}
                  icon={f.icon}
                />
              </Reveal>
            ))}
          </div>
        </Section>

        <Section
          title="What customers say"
          description="Teams that keep projects, docs, and conversations in one place."
        >
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {safeTestimonials.map((t, i) => (
              <Reveal key={t._id} delay={i * 0.05}>
                <TestimonialCard
                  name={t.name}
                  company={t.company}
                  quote={t.quote}
                  avatar={t.avatar}
                  rating={t.rating ?? null}
                />
              </Reveal>
            ))}
          </div>
        </Section>

        <Integrations
          title="Integrations"
          items={integrations.map((item) => ({
            name: item.name,
            href: item.href ?? undefined,
            logo: item.logo,
          }))}
        />
      </main>
      <Footer />
    </>
  );
}
