import { useState, useMemo } from "react";
import { useMenu } from "@/context/MenuContext";
import MenuCard from "@/components/MenuCard";
import CategoryFilter from "@/components/CategoryFilter";
import CustomizePopup from "@/components/CustomizePopup";
import { MenuItem } from "@/data/menuData";

const MenuPage = () => {
  const { menuItems, categories } = useMenu();
  const [activeCategory, setActiveCategory] = useState("All");
  const [customizeItem, setCustomizeItem] = useState<MenuItem | null>(null);
  const [search, setSearch] = useState("");

  const filteredItems = useMemo(() => {
    let items = menuItems;
    if (activeCategory !== "All") {
      items = items.filter((item) => item.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)
      );
    }
    return items;
  }, [menuItems, activeCategory, search]);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Our Menu</h1>
        <p className="text-muted-foreground mb-6">Choose from our wide variety of items</p>

        {/* Search */}
        <input
          type="text"
          placeholder="Search menu items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:max-w-sm px-4 py-3 rounded-2xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 mb-5"
        />

        {/* Category filters */}
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* Items grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
          {filteredItems.map((item) => (
            <MenuCard key={item.id} item={item} onCustomize={setCustomizeItem} />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No items found</p>
          </div>
        )}
      </div>

      {customizeItem && (
        <CustomizePopup item={customizeItem} onClose={() => setCustomizeItem(null)} />
      )}
    </div>
  );
};

export default MenuPage;
