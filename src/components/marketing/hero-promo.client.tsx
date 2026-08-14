"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  BookOpen,
  Eye,
  FileText,
  LayoutDashboard,
  Newspaper,
  Sparkles,
} from "lucide-react";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Newspaper, label: "Blog" },
  { icon: BookOpen, label: "Docs" },
  { icon: FileText, label: "Pages" },
];

const contentItems = [
  {
    title: "How a 12-person product team reduced weekly status meetings",
    type: "Blog post",
    meta: "Published · 3 days ago",
    accent: "bg-rose-500",
    highlight: "Live",
  },
  {
    title: "Designing permissions for client-facing project workspaces",
    type: "Blog post",
    meta: "Draft · awaiting review",
    accent: "bg-amber-500",
    highlight: "Draft",
  },
  {
    title: "Getting Started",
    type: "Doc page",
    meta: "Guides · order 1",
    accent: "bg-sky-500",
  },
  {
    title: "Authentication",
    type: "Doc page",
    meta: "API · order 1",
    accent: "bg-sky-500",
  },
];

const floatingBadges = [
  {
    icon: Newspaper,
    label: "5 blog posts",
    position: "top-left" as const,
    delay: 0.8,
  },
  {
    icon: BookOpen,
    label: "11 doc pages",
    position: "bottom-right" as const,
    delay: 1.2,
  },
];

export function HeroPromo() {
  const reduceMotion = useReducedMotion();

  const floatTransition = reduceMotion
    ? undefined
    : {
        y: [0, -10, 0],
        transition: {
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut" as const,
        },
      };

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, x: 24, scale: 0.98 }}
      animate={reduceMotion ? undefined : { opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: "easeOut", delay: 0.25 }}
      className="relative mx-auto w-full max-w-lg min-w-0 lg:max-w-none"
      aria-hidden
    >
      <motion.div animate={floatTransition} className="relative">
        <div className="pointer-events-none absolute -inset-2 rounded-3xl bg-gradient-to-br from-rose-500/20 via-pink-500/10 to-transparent blur-2xl sm:-inset-4" />

        <div className="bg-card relative overflow-hidden rounded-xl border shadow-2xl shadow-rose-500/10">
          <div className="bg-muted/60 flex min-w-0 items-center gap-2 border-b px-3 py-2.5 sm:px-4 sm:py-3">
            <div className="flex gap-1.5">
              <span className="bg-destructive/70 size-2.5 rounded-full" />
              <span className="size-2.5 rounded-full bg-amber-400/80" />
              <span className="size-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <div className="bg-background text-muted-foreground mx-auto hidden max-w-[240px] truncate rounded-md px-3 py-1 text-[10px] sm:block">
              flowspace.dev/admin/content
            </div>
            <motion.span
              animate={reduceMotion ? undefined : { opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="ml-auto flex shrink-0 items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400"
            >
              <span className="size-1.5 rounded-full bg-emerald-500" />
              Synced
            </motion.span>
          </div>

          <div className="grid min-h-[300px] grid-cols-[52px_minmax(0,1fr)] sm:min-h-[340px] sm:grid-cols-[72px_minmax(0,1fr)]">
            <div className="bg-muted/30 flex flex-col gap-2 border-r p-2 sm:gap-3 sm:p-3">
              <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
                <Sparkles className="size-4" />
              </div>
              {sidebarItems.map(({ icon: Icon, active }, i) => (
                <motion.div
                  key={sidebarItems[i].label}
                  initial={reduceMotion ? false : { opacity: 0, x: -8 }}
                  animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.08 }}
                  className={`flex size-8 items-center justify-center rounded-lg ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground"
                  }`}
                  title={sidebarItems[i].label}
                >
                  <Icon className="size-4" />
                </motion.div>
              ))}
            </div>

            <div className="relative min-w-0 p-3 sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-muted-foreground text-[10px] font-medium tracking-wide uppercase">
                    Sanity CMS
                  </p>
                  <p className="text-sm font-semibold">Content dashboard</p>
                </div>
                <div className="bg-muted/60 text-muted-foreground hidden rounded-md px-2 py-1 text-[10px] font-medium sm:block">
                  Blog · Docs · Pages
                </div>
              </div>

              <ul className="space-y-2.5">
                {contentItems.map((item, i) => (
                  <motion.li
                    key={item.title}
                    initial={
                      reduceMotion ? false : { opacity: 0, y: 12, scale: 0.96 }
                    }
                    animate={
                      reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }
                    }
                    transition={{
                      delay: 0.5 + i * 0.1,
                      duration: 0.45,
                      ease: "easeOut",
                    }}
                    className="bg-background flex min-w-0 items-center gap-2 rounded-lg border p-2.5 shadow-sm sm:gap-3 sm:p-3"
                  >
                    <span
                      className={`size-2 shrink-0 rounded-full ${item.accent}`}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium">
                        {item.title}
                      </p>
                      <p className="text-muted-foreground text-[10px]">
                        {item.type} · {item.meta}
                      </p>
                    </div>
                    {item.highlight && !reduceMotion && (
                      <motion.span
                        animate={
                          item.highlight === "Live"
                            ? { scale: [1, 1.12, 1] }
                            : undefined
                        }
                        transition={{ duration: 2, repeat: Infinity }}
                        className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-medium ${
                          item.highlight === "Live"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                        }`}
                      >
                        {item.highlight}
                      </motion.span>
                    )}
                    {item.highlight && reduceMotion && (
                      <span
                        className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-medium ${
                          item.highlight === "Live"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                        }`}
                      >
                        {item.highlight}
                      </span>
                    )}
                  </motion.li>
                ))}
              </ul>

              <motion.div
                initial={
                  reduceMotion ? false : { opacity: 0, y: 16, scale: 0.9 }
                }
                animate={
                  reduceMotion
                    ? { opacity: 1, y: 0, scale: 1 }
                    : {
                        opacity: [0, 1, 1, 0],
                        y: [16, 0, 0, -8],
                        scale: [0.9, 1, 1, 0.95],
                      }
                }
                transition={
                  reduceMotion
                    ? { delay: 1 }
                    : {
                        duration: 4,
                        repeat: Infinity,
                        repeatDelay: 3,
                        times: [0, 0.15, 0.75, 1],
                      }
                }
                className="bg-background absolute right-3 bottom-3 left-3 flex items-start gap-2 rounded-lg border p-2.5 shadow-lg sm:right-4 sm:bottom-4 sm:left-auto sm:w-56 sm:p-3"
              >
                <Eye className="text-primary mt-0.5 size-4 shrink-0" />
                <div>
                  <p className="text-[11px] font-semibold">Preview ready</p>
                  <p className="text-muted-foreground text-[10px] leading-snug">
                    Draft blog post is live in preview mode before publish.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {floatingBadges.map(({ icon: Icon, label, position, delay }) => (
          <motion.div
            key={label}
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            className="bg-card absolute hidden rounded-full border px-3 py-1.5 shadow-md sm:flex sm:items-center sm:gap-2"
            style={{
              top: position === "top-left" ? "12%" : undefined,
              bottom: position === "bottom-right" ? "8%" : undefined,
              left: position === "top-left" ? "-8%" : undefined,
              right: position === "bottom-right" ? "-6%" : undefined,
            }}
          >
            <Icon className="text-primary size-3.5" />
            <span className="text-[11px] font-medium whitespace-nowrap">
              {label}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
