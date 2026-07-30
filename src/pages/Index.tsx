import { Link } from "react-router-dom";
import { ArrowRight, UtensilsCrossed, Truck, Clock, Sparkles, CalendarDays } from "lucide-react";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-waffles.jpg";
import wafflePatternBg from "@/assets/waffle-pattern-bg.jpg";
import { useMenu } from "@/context/MenuContext";
import { useStallSchedule } from "@/context/StallScheduleContext";
import SEOHead from "@/components/SEOHead";
import ShopClosedBanner from "@/components/ShopClosedBanner";

const categoryIcons: Record<string, string> = {
  "Waffles": "🧇", "Waffle Cakes": "🎂", "Spiral Potatoes": "🥔",
  "Hot Chocolate": "☕", "Ice Cream": "🍦", "French Fries": "🍟",
  "Veg Sandwich": "🥪", "Chicken Sandwich": "🥪", "Veg Burger": "🍔",
  "Chicken Burger": "🍔", "Maggi": "🍜", "Garlic Bread": "🧄",
  "Veg Pizza": "🍕", "Chicken Pizza": "🍕", "Pasta": "🍝",
  "Quick Bites": "🍗", "Sweet Dish": "🍮", "Tea": "🍵",
  "Coffee": "☕", "Ice Tea": "🧊", "Shakes": "🥤",
};

const Index = () => {
  const { menuItems = [], categories = [] } = useMenu() || {};
  const { isStallActive = false, banner = { title: "", subtitle: "", linkText: "" }, stallStartDate = "", stallEndDate = "" } = useStallSchedule() || {};
  
  const getCategoryCount = (cat: string) => (menuItems || []).filter((item) => item && item.category === cat).length;
  const menuCategories = (categories || []).filter((c) => c && c !== "All" && getCategoryCount(c) > 0);

  return (
    <div className="min-h-screen">
      <SEOHead title="Waffle Da! - Freshly Made Waffles & More | Order Online" description="Order delicious freshly made waffles, burgers, pizzas, and more from Waffle Da! Fast delivery to your doorstep. Browse our menu and order now." />
      
      {/* Hero - Full screen underneath sticky navbar */}
      <section className="relative h-[100vh] -mt-[4.25rem] overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1.0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <img src={wafflePatternBg} alt="Delicious waffles" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-black/20" />
        </motion.div>

        <div className="relative h-full max-w-7xl mx-auto px-6 sm:px-10 flex flex-col justify-center">
          <motion.div
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-primary/90 text-primary-foreground text-sm font-medium w-fit backdrop-blur-sm glow-accent"
            initial={{ opacity: 1, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Sparkles className="w-4 h-4" />
            Now in Bidholi
          </motion.div>
          <motion.h1
            className="text-5xl sm:text-7xl lg:text-8xl font-bold text-white mb-6 leading-[1.1] italic drop-shadow-lg"
            style={{ fontFamily: "'Playfair Display', serif" }}
            initial={{ opacity: 1, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Waffle Da
          </motion.h1>
          <motion.p
            className="text-xl sm:text-2xl text-white/90 max-w-xl mb-8 leading-relaxed font-light"
            initial={{ opacity: 1, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Freshly baked waffles, crispy burgers, artisanal shakes, and savory delights delivered hot to your door.
          </motion.p>
          <motion.div
            className="flex flex-wrap items-center gap-4"
            initial={{ opacity: 1, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-lg hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/20 hover:scale-105 active:scale-95"
            >
              <UtensilsCrossed className="w-5 h-5" />
              Order Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>

        {/* Floating Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <div className="w-6 h-10 rounded-full border-2 border-white/40 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 rounded-full bg-white/60" />
          </div>
        </div>
      </section>

      {/* Pop-Up Stall Banner - only when active */}
      {isStallActive && (
        <section className="py-6 px-4 relative overflow-hidden waffle-gradient-warm">
          <div className="relative max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center shrink-0 backdrop-blur-sm">
              <CalendarDays className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-primary-foreground italic" style={{ fontFamily: "'Playfair Display', serif" }}>
                {banner?.title || "Waffle Da Pop-Up Stall"}{stallStartDate && stallEndDate ? ` — ${new Date(stallStartDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} & ${new Date(stallEndDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}` : ""}
              </h3>
              <p className="text-primary-foreground/80 text-sm mt-1">{banner?.subtitle}</p>
              <Link to="/stall-menu" className="inline-flex items-center gap-1 mt-2 text-sm font-semibold text-primary-foreground underline underline-offset-2 hover:opacity-80">
                {banner?.linkText || "View Stall Menu"} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Explore Our Menu */}
      <section className="py-16 px-4 bg-pattern-dots relative">
        <div className="max-w-5xl mx-auto text-center">
          <div className="mb-6 max-w-md mx-auto">
            <ShopClosedBanner />
          </div>
          <span className="text-sm font-medium text-amber-500 uppercase tracking-widest mb-2 block">
            Taste Perfection
          </span>
          <h2
            className="text-4xl sm:text-5xl font-bold text-foreground mb-4 italic"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Explore Our Menu
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-12">
            From signature sweet waffles to mouth-watering burgers & shakes. Made fresh to order.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {menuCategories.map((cat) => (
              <div key={cat}>
                <Link
                  to={`/menu?category=${encodeURIComponent(cat)}`}
                  className="group relative flex flex-col items-center p-6 rounded-3xl glass-card border border-border/50 hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <span className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    {categoryIcons[cat] || "🧇"}
                  </span>
                  <h3 className="font-bold text-foreground text-lg mb-1 group-hover:text-primary transition-colors">
                    {cat}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {getCategoryCount(cat)} items
                  </span>
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all duration-300 shadow-md shadow-primary/20 hover:scale-105"
            >
              View Full Menu <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Highlights / Trust */}
      <section className="py-16 px-4 soft-surface border-y border-border/50">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center p-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 text-primary">
              <UtensilsCrossed className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-foreground text-lg mb-1">Made Fresh To Order</h3>
            <p className="text-sm text-muted-foreground">Every waffle batter is prepared fresh upon receiving your order.</p>
          </div>
          <div className="flex flex-col items-center p-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 text-primary">
              <Truck className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-foreground text-lg mb-1">Fast Campus Delivery</h3>
            <p className="text-sm text-muted-foreground">Hot & crisp delivery directly to hostels & locations around Bidholi.</p>
          </div>
          <div className="flex flex-col items-center p-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 text-primary">
              <Clock className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-foreground text-lg mb-1">Late Night Craving</h3>
            <p className="text-sm text-muted-foreground">Open late hours for your study sessions and late night sweet teeth.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
