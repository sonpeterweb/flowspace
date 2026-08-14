"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

import { HeroPromo } from "@/components/marketing/hero-promo.client";
import { Button } from "@/components/ui/button";

export type HeroClientProps = {
  title: string;
  subtitle: string;
  cta?: string | null;
};

export function HeroClient({ title, subtitle, cta }: HeroClientProps) {
  const reduceMotion = useReducedMotion();

  const fadeUp = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.55, ease: "easeOut" as const, delay },
        };

  const primaryLabel = cta?.trim() || "Explore Features";

  return (
    <div className="relative">
      {/* Background accents */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-gradient-to-br from-rose-500/15 to-pink-500/5 blur-3xl" />
        <div className="from-primary/5 absolute top-1/2 -right-20 h-64 w-64 rounded-full bg-gradient-to-bl to-transparent blur-3xl" />
      </div>

      <div className="grid min-w-0 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Copy */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <motion.p
            {...fadeUp(0)}
            className="text-muted-foreground mb-3 text-sm font-medium tracking-wide"
          >
            Flowspace
          </motion.p>

          <motion.h1
            {...fadeUp(0.05)}
            className="bg-gradient-to-r from-rose-700 via-rose-600 to-pink-600 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent md:text-5xl lg:text-[3.25rem] lg:leading-tight"
          >
            {title}
          </motion.h1>

          <motion.p
            {...fadeUp(0.15)}
            className="text-muted-foreground mt-4 max-w-xl text-base md:text-lg"
          >
            {subtitle}
          </motion.p>

          <motion.div
            {...fadeUp(0.25)}
            className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
          >
            <Button asChild size="lg" className="cursor-pointer">
              <Link href="/features">{primaryLabel}</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="cursor-pointer"
            >
              <Link href="/case-studies">View Case Studies</Link>
            </Button>
          </motion.div>

          <motion.p
            {...fadeUp(0.35)}
            className="text-muted-foreground/80 mt-6 max-w-md text-xs"
          >
            Portfolio demonstration built with Next.js + Sanity
          </motion.p>
        </div>

        {/* Product promo */}
        <div className="w-full min-w-0">
          <HeroPromo />
        </div>
      </div>
    </div>
  );
}
