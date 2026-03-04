import { useState } from "react";

interface Category {
  id: string;
  label: string;
}

interface PortfolioItem {
  id: number;
  category: string;
  imageSrc: string;
  title: string;
  categoryLabel: string;
}

interface Props {
  categories: Category[];
  items: PortfolioItem[];
}

export default function PortfolioFilter({ categories, items }: Props) {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredItems =
    activeCategory === "all"
      ? items
      : items.filter((item) => item.category === activeCategory);

  return (
    <>
      {/* Category Filter */}
      <div className="py-8 border-b border-border sticky top-16 bg-background/95 backdrop-blur-md z-40">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeCategory === category.id
                    ? "bg-coral text-white"
                    : "bg-transparent border border-border text-foreground hover:bg-muted"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Portfolio Grid */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group overflow-hidden bg-background border border-border rounded-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={item.imageSrc}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground capitalize">
                    {item.categoryLabel}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                No work in this category
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
