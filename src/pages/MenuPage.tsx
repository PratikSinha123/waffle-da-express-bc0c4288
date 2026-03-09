import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useMenu } from "@/context/MenuContext";
import MenuCard from "@/components/MenuCard";
import CategoryFilter from "@/components/CategoryFilter";
import CustomizePopup from "@/components/CustomizePopup";
import { MenuItem } from "@/data/menuData";
import { Search } from "lucide-react";
import heroImage from "@/assets/hero-waffles.jpg";
import SEOHead from "@/components/SEOHead";
import ShopClosedBanner from "@/components/ShopClosedBanner";

const MenuPage = () => {
  const { menuItems, categories } = useMenu();
  const [searchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(() => {
    const cat = searchParams.get("category");
    return cat && categories.includes(cat) ? cat : "All";
  });
  const [customizeItem, setCustomizeItem] = useState<MenuItem | null>(null);
  const [search, setSearch] = useState("");
  const [dietFilter, setDietFilter] = useState<"all" | "veg" | "nonveg">("all");

  const filteredItems = useMemo(() => {
    let items = menuItems;
    if (activeCategory !== "All") items = items.filter((item) => item.category === activeCategory);
    if (dietFilter === "veg") items = items.filter((item) => item.isVeg);
    if (dietFilter === "nonveg") items = items.filter((item) => !item.isVeg);
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter((item) => item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q));
    }
    return items;
  }, [menuItems, activeCategory, search, dietFilter]);

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
        <div className="relative overflow-hidden rounded-3xl mb-8 p-8 sm:p-10 waffle-gradient-warm">
          <span className="text-sm font-medium text-white/80 uppercase tracking-widest mb-1 block">Waffle Da</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Our <span className="italic">Menu</span>
          </h1>
          <p className="text-white/70">Choose from our wide variety of items</p>
        </div>

        {/* Search & Diet Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search menu items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setDietFilter("all")}
              className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all ${dietFilter === "all" ? "bg-primary text-primary-foreground shadow-sm" : "bg-secondary text-secondary-foreground hover:bg-primary/10"}`}
            >
              All
            </button>
            <button
              onClick={() => setDietFilter("veg")}
              className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${dietFilter === "veg" ? "bg-green-700 text-white shadow-sm" : "bg-secondary text-secondary-foreground hover:bg-green-700/10"}`}
            >
              <span className="w-3 h-3 rounded-full border-2 border-green-500 flex items-center justify-center"><span className="w-1.5 h-1.5 rounded-full bg-green-500" /></span>
              Veg
            </button>
            <button
              onClick={() => setDietFilter("nonveg")}
              className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${dietFilter === "nonveg" ? "bg-red-700 text-white shadow-sm" : "bg-secondary text-secondary-foreground hover:bg-red-700/10"}`}
            >
              <span className="w-3 h-3 rounded-full border-2 border-red-500 flex items-center justify-center"><span className="w-1.5 h-1.5 rounded-full bg-red-500" /></span>
              Non-Veg
            </button>
          </div>
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
