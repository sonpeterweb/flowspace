import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import Link from "next/link";

import { SanityImage } from "@/components/common/sanity-image";
import { cn } from "@/lib/utils";

export type IntegrationItem = {
  name: string;
  href?: string;
  logo?: unknown;
};

export type IntegrationsProps = {
  className?: string;
  title?: string;
  items: IntegrationItem[];
};

export default function Integrations({
  className,
  title = "Integrations",
  items,
}: IntegrationsProps) {
  return (
    <section
      className={cn("w-full py-8 md:py-10", className)}
      aria-label={title}
    >
      <div className="container">
        <h3 className="text-muted-foreground mb-4 text-center text-xs tracking-wider uppercase">
          {title}
        </h3>
        <ul className="grid grid-cols-2 items-center gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {items.map((item) => {
            const img = item.logo ? (
              <SanityImage
                image={item.logo as SanityImageSource}
                alt={item.name}
                width={160}
                height={64}
                fit="max"
                className="mx-auto h-8 w-auto opacity-80"
                sizes="160px"
              />
            ) : (
              <div className="bg-muted text-muted-foreground mx-auto flex h-8 w-32 items-center justify-center rounded">
                <span className="text-xs">{item.name}</span>
              </div>
            );

            return (
              <li key={item.name} className="flex items-center justify-center">
                {item.href ? (
                  <Link
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {img}
                  </Link>
                ) : (
                  img
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
