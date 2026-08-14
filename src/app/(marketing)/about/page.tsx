import type { Metadata } from "next";

import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import { Section } from "@/components/common/section";
import { getSiteSettings } from "@/lib/sanity/site-settings";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description: "Learn more about our team and mission.",
});

export default async function AboutPage() {
  const settings = await getSiteSettings();
  const siteTitle = settings?.siteTitle ?? "Flowspace";

  return (
    <>
      <Header />
      <main id="main-content">
        <Section
          title={`About ${siteTitle}`}
          description="We build tools that help teams collaborate and move faster."
        >
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p>
              Our mission is to empower teams to work together, communicate
              clearly, and ship value faster. We believe in simplicity,
              accessibility, and thoughtful design.
            </p>
            <p>
              Flowspace brings projects, shared knowledge, and team
              communication into one workspace — so everyone stays aligned
              without jumping between tools.
            </p>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
