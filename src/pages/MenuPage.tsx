import { useState, useMemo } from "react";
import { useMenu } from "@/context/MenuContext";
import MenuCard from "@/components/MenuCard";
import CategoryFilter from "@/components/CategoryFilter";
import CustomizePopup from "@/components/CustomizePopup";
import { MenuItem } from "@/data/menuData";
import { Search } from "lucide-react";
import heroImage from "@/assets/hero-waffles.jpg";
import SEOHead from "@/components/SEOHead";

const MenuPage = () => {
  const { menuItems, categories } = useMenu();
  const [activeCategory, setActiveCategory] = useState("All");
  const [customizeItem, setCustomizeItem] = useState<MenuItem | null>(null);
  const [search, setSearch] = useState("");

  const filteredItems = useMemo(() => {
    let items = menuItems;
    if (activeCategory !== "All") items = items.filter((item) => item.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter((item) => item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q));
    }
    return items;
  }, [menuItems, activeCategory, search]);

  return (
    <div className="min-h-screen relative">
      <SEOHead title="Menu - Waffle Da! | Waffles, Burgers, Pizza & More" description="Browse our full menu of freshly made waffles, burgers, pizzas, sandwiches, shakes and more. Order online from Waffle Da!" />
      {/* Fixed background */}
      <div
        className="fixed inset-0 -z-10"
        style={{ backgroundImage: `url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}
      />
      <div className="fixed inset-0 -z-10 bg-background/90 backdrop-blur-sm" />
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="page-header">
          <span className="text-sm font-medium text-accent uppercase tracking-widest mb-1 block">Waffle Da</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Our <span className="text-gradient italic">Menu</span>
          </h1>
          <p className="text-muted-foreground">Choose from our wide variety of items</p>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search menu items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:max-w-sm pl-11 pr-4 py-3 rounded-2xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
          />
        </div>

        <CategoryFilter categories={categories} activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

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

      {customizeItem && <CustomizePopup item={customizeItem} onClose={() => setCustomizeItem(null)} />}
    </div>
  );
};

export default MenuPage;
