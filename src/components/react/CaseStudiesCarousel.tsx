import { useRef, useEffect, useState } from "react";

interface CaseStudy {
  slug: string;
  thumbnailSrc: string;
}

interface Props {
  cases: CaseStudy[];
  basePath: string;
  ctaLabel: string;
  ctaHref: string;
  readLabel: string;
  variant?: "light" | "dark";
}

export default function CaseStudiesCarousel({ cases, basePath, ctaLabel, ctaHref, readLabel, variant = "dark" }: Props) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const isDark = variant === "dark";

  useEffect(() => {
    if (!scrollContainerRef.current || isPaused) return;

    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const maxScroll = container.scrollWidth - container.clientWidth;

        if (container.scrollLeft >= maxScroll - 10) {
          container.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          container.scrollBy({ left: 320, behavior: "smooth" });
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -320 : 320,
        behavior: "smooth",
      });
    }
  };

  return (
    <div>
      <div
        className="relative mb-12"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Navigation Arrows */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-[hsl(42,87%,55%)]/90 hover:bg-[hsl(42,87%,55%)] rounded-full flex items-center justify-center shadow-lg transition-colors -translate-x-4 lg:-translate-x-6"
          aria-label="Previous"
        >
          <svg className="w-6 h-6 text-[hsl(var(--primary))]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-[hsl(42,87%,55%)]/90 hover:bg-[hsl(42,87%,55%)] rounded-full flex items-center justify-center shadow-lg transition-colors translate-x-4 lg:translate-x-6"
          aria-label="Next"
        >
          <svg className="w-6 h-6 text-[hsl(var(--primary))]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
        </button>

        {/* Scrollable Thumbnails */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scroll-smooth pb-4 -mx-4 px-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {cases.map((caseItem, index) => (
            <a
              key={caseItem.slug}
              href={`${basePath}/${caseItem.slug}`}
              className="flex-shrink-0 w-[320px] md:w-[400px] group cursor-pointer"
            >
              <div className="relative rounded-xl overflow-hidden shadow-lg aspect-video">
                <img
                  src={caseItem.thumbnailSrc}
                  alt={`Case study ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-[hsl(var(--primary))]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {readLabel} →
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <a
          href={ctaHref}
          className="inline-flex items-center bg-[hsl(42,87%,55%)] text-[hsl(var(--primary))] hover:bg-[hsl(42,80%,40%)] font-semibold px-8 py-4 rounded-lg transition-colors text-lg"
        >
          {ctaLabel}
        </a>
      </div>
    </div>
  );
}
