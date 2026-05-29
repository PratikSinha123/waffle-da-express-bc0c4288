interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter = ({ categories, activeCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="section-heading">Browse by category</p>
          <p className="text-sm text-muted-foreground mt-1">Tap a chip to filter the menu quickly.</p>
        </div>
      </div>
      <div className="overflow-x-auto scrollbar-hide pb-2">
        <div className="flex gap-2 min-w-max px-1 pr-4">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`category-chip ${
              activeCategory === category ? "category-chip-active" : "category-chip-inactive"
            }`}
          >
            {category}
          </button>
        ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
