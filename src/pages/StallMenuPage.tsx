import { useState, useMemo } from "react";
import { useMenu } from "@/context/MenuContext";
import MenuCard from "@/components/MenuCard";
import CustomizePopup from "@/components/CustomizePopup";
import { MenuItem } from "@/data/menuData";
import { Search, MapPin } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import heroImage from "@/assets/hero-waffles.jpg";

const StallMenuPage = () => {
  const { menuItems } = useMenu();
  const [customizeItem, setCustomizeItem] = useState<MenuItem | null>(null);
  const [search, setSearch] = useState("");

  const stallItems = useMemo(() => {
    let items = menuItems.filter((item) => item.isStallItem);
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter((item) => item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q));
    }
    return items;
  }, [menuItems, search]);

  return (
    <div className="min-h-screen relative">
      <SEOHead title="Pop-Up Stall Menu - Waffle Da! | UPES Campus" description="Limited stall menu for the Waffle Da pop-up at UPES campus on 17 & 18 March. Order fresh waffles, shakes and more!" />
      <div className="fixed inset-0 -z-10" style={{ backgroundImage: `url(${heroImage})`, backgroundSize: "cover", backgroundPosition: "center" }} />
      <div className="fixed inset-0 -z-10 bg-background/90 backdrop-blur-sm" />
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl mb-8 p-8 sm:p-10 waffle-gradient-warm">
          <div className="absolute inset-0 bg-pattern-waffle opacity-10" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-primary-foreground/80" />
              <span className="text-sm font-medium text-primary-foreground/80 uppercase tracking-widest">UPES Campus</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              🏪 Pop-Up <span className="italic">Stall Menu</span>
            </h1>
            <p className="text-white/70">Limited menu for 17 & 18 March — available at the stall only!</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-sm mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search stall items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
          />
        </div>

        {stallItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {stallItems.map((item) => (
              <MenuCard key={item.id} item={item} onCustomize={setCustomizeItem} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🏪</p>
            <p className="text-muted-foreground text-lg">No stall items added yet</p>
            <p className="text-muted-foreground text-sm mt-1">The shopkeeper will mark stall items soon!</p>
          </div>
        )}
      </div>

      {customizeItem && <CustomizePopup item={customizeItem} onClose={() => setCustomizeItem(null)} />}
    </div>
  );
};

export default StallMenuPage;
