import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  imageSrc: string;
}

interface Props {
  testimonials: Testimonial[];
  variant?: "light" | "dark";
  ctaLabel?: string;
  ctaHref?: string;
}

const StarIcon = () => (
  <svg className="w-4 h-4 fill-[hsl(42,87%,55%)] text-[hsl(42,87%,55%)]" viewBox="0 0 24 24">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const TestimonialCard = ({ quote, author, role, imageSrc }: Testimonial) => (
  <div className="bg-card rounded-lg p-6 shadow-card h-full">
    <div className="flex gap-1 mb-4">
      {[...Array(5)].map((_, i) => (
        <StarIcon key={i} />
      ))}
    </div>
    <p className="text-muted-foreground mb-4 italic">"{quote}"</p>
    <div className="flex items-center gap-3">
      <img
        src={imageSrc}
        alt={author}
        className="w-12 h-12 rounded-full object-cover"
        loading="lazy"
        decoding="async"
      />
      <div>
        <p className="font-semibold text-foreground">{author}</p>
        <p className="text-sm text-muted-foreground">{role}</p>
      </div>
    </div>
  </div>
);

export default function TestimonialsCarousel({ testimonials, variant = "light", ctaLabel, ctaHref }: Props) {
  const isDark = variant === "dark";

  return (
    <div>
      <Carousel
        opts={{ align: "start", loop: true }}
        plugins={[
          Autoplay({
            delay: 4000,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
          }),
        ]}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {testimonials.map((item, index) => (
            <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
              {isDark ? (
                <div className="bg-white/10 border border-white/20 rounded-xl p-6 h-full flex flex-col">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} />
                    ))}
                  </div>
                  <p className="text-white/90 text-sm italic mb-6 flex-grow text-left">
                    "{item.quote}"
                  </p>
                  <div className="flex items-center gap-3 mt-auto">
                    <img src={item.imageSrc} alt={item.author} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <p className="text-white font-semibold text-sm">{item.author}</p>
                      <p className="text-white/60 text-xs">{item.role}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <TestimonialCard {...item} />
              )}
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex items-center justify-center gap-4 mt-8">
          {isDark ? (
            <>
              <CarouselPrevious className="static translate-y-0 bg-white/10 border-white/20 text-white hover:bg-white/20" />
              <CarouselNext className="static translate-y-0 bg-white/10 border-white/20 text-white hover:bg-white/20" />
            </>
          ) : (
            <>
              <CarouselPrevious className="static translate-y-0 bg-primary/10 border-primary/20 text-primary hover:bg-primary/20" />
              <CarouselNext className="static translate-y-0 bg-primary/10 border-primary/20 text-primary hover:bg-primary/20" />
            </>
          )}
        </div>
      </Carousel>

      {ctaLabel && ctaHref && (
        <div className="text-center mt-10">
          <a
            href={ctaHref}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-4 rounded-lg transition-colors"
          >
            {ctaLabel}
          </a>
        </div>
      )}
    </div>
  );
}
