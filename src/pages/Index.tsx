import { Link } from "react-router-dom";
import { ArrowRight, UtensilsCrossed, Truck, Clock, MapPin, Phone, Clock3, Sparkles, CalendarDays } from "lucide-react";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-waffles.jpg";
import wafflePatternBg from "@/assets/waffle-pattern-bg.jpg";
import { useMenu } from "@/context/MenuContext";
import SEOHead from "@/components/SEOHead";

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
  const { menuItems, categories } = useMenu();
  const getCategoryCount = (cat: string) => menuItems.filter((item) => item.category === cat).length;
  const menuCategories = categories.filter((c) => c !== "All" && getCategoryCount(c) > 0);

  return (
    <div className="min-h-screen">
      <SEOHead title="Waffle Da! - Freshly Made Waffles & More | Order Online" description="Order delicious freshly made waffles, burgers, pizzas, and more from Waffle Da! Fast delivery to your doorstep. Browse our menu and order now." />
      {/* Hero - Full screen */}
      <section className="relative h-[100vh] -mt-[4.25rem] overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.2 }}
          animate={{ scale: 1.05 }}
          transition={{ duration: 1.8, ease: "easeOut" }}
        >
          <img src={wafflePatternBg} alt="Delicious waffles" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-black/20" />
        </motion.div>

        <div className="relative h-full max-w-7xl mx-auto px-6 sm:px-10 flex flex-col justify-center">
          <motion.div
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-primary/90 text-primary-foreground text-sm font-medium w-fit backdrop-blur-sm glow-accent"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Sparkles className="w-4 h-4" />
            Now in Bidholi
          </motion.div>
          <motion.h1
            className="text-5xl sm:text-7xl lg:text-8xl font-bold text-white mb-6 leading-[1.1] italic drop-shadow-lg"
            style={{ fontFamily: "'Playfair Display', serif" }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          >
            Waffle Da
          </motion.h1>
          <motion.p
            className="text-base sm:text-lg text-white/80 max-w-lg mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
          >
            Handcrafted waffles, fluffy pancakes & creamy shakes — made fresh, served with love. 🧇
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1.1, type: "spring", stiffness: 200 }}
          >
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full waffle-gradient-warm text-primary-foreground font-semibold text-lg hover:opacity-90 transition-all w-fit shadow-lg glow-accent hover:scale-[1.02]"
            >
              Order Now <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <div className="w-6 h-10 rounded-full border-2 border-white/40 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 rounded-full bg-white/60" />
          </div>
        </div>
      </section>

      {/* Pop-Up Stall Banner */}
      <section className="py-6 px-4 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(28, 30%, 28%), hsl(32, 40%, 34%))' }}>
        <div className="absolute inset-0 bg-pattern-waffle opacity-10" />
        <div className="relative max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left">
          <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center shrink-0 backdrop-blur-sm">
            <CalendarDays className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-primary-foreground italic" style={{ fontFamily: "'Playfair Display', serif" }}>
              🎉 Waffle Da 7-Day Pop-Up Stall at UPES — 20 to 26 March
            </h3>
            <p className="text-primary-foreground/80 text-sm mt-1">Come visit us on campus! Fresh waffles, shakes & more 🧇</p>
          </div>
        </div>
      </section>

      {/* Explore Our Menu */}
      <section className="py-20 px-4 bg-pattern-dots relative">
        <div className="max-w-5xl mx-auto text-center">
          <motion.span
            className="text-sm font-medium text-accent uppercase tracking-widest mb-2 block"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
          >
            What we serve
          </motion.span>
          <motion.h2
            className="text-3xl sm:text-4xl font-bold text-foreground mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Explore Our <span className="text-gradient italic">Menu</span>
          </motion.h2>
          <motion.p
            className="text-muted-foreground mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Tap a category to jump right in
          </motion.p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {menuCategories.map((cat, i) => (
              <motion.div
                key={cat}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: 0.05 * i }}
              >
                <Link
                  to="/menu"
                  className="waffle-card-elevated p-5 text-center group block"
                >
                  <span className="text-3xl mb-2 block group-hover:scale-125 transition-transform duration-300 animate-float" style={{ animationDelay: `${Math.random() * 2}s` }}>
                    {categoryIcons[cat] || "🍽️"}
                  </span>
                  <span className="font-semibold text-foreground text-sm block">{cat}</span>
                  <span className="text-xs text-muted-foreground">{getCategoryCount(cat)} items</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 waffle-gradient-soft" />
        <div className="absolute inset-0 bg-pattern-waffle" />
        <div className="relative max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: UtensilsCrossed, title: "Fresh & Tasty", desc: "Made with premium ingredients, prepared fresh for every order", emoji: "✨" },
            { icon: Truck, title: "Fast Delivery", desc: "Quick delivery right to your doorstep in minimum time", emoji: "🚀" },
            { icon: Clock, title: "Track Live", desc: "Real-time order tracking so you know exactly when it arrives", emoji: "📍" },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              className="waffle-card-elevated text-center p-8 bg-card/80 backdrop-blur-sm"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.15 * i }}
            >
              <motion.div
                className="w-16 h-16 rounded-2xl waffle-gradient-warm flex items-center justify-center mx-auto mb-5 glow-accent"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: 0.15 * i + 0.2, type: "spring", stiffness: 200 }}
              >
                <feature.icon className="w-7 h-7 text-primary-foreground" />
              </motion.div>
              <h3 className="font-bold text-foreground text-lg mb-2">{feature.title} {feature.emoji}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto rounded-3xl waffle-gradient-warm p-10 sm:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-pattern-waffle opacity-10" />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4 italic" style={{ fontFamily: "'Playfair Display', serif" }}>
              Craving Something Sweet? 🧇
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-md mx-auto">
              Order now and get your favourite waffles delivered hot & fresh to your doorstep
            </p>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-card text-foreground font-semibold text-lg hover:bg-card/90 transition-all shadow-lg hover:scale-[1.02]"
            >
              Browse Menu <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border bg-pattern-dots">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl font-bold text-gradient italic" style={{ fontFamily: "'Playfair Display', serif" }}>Waffle Da</span>
              <span className="text-xl">🧇</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Delicious waffles, pancakes & shakes made with love in Bidholi.</p>
            <div className="flex gap-3">
              <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary/10 transition-colors">
                <MapPin className="w-4 h-4 text-primary" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary/10 transition-colors">
                <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Home</Link>
              <Link to="/menu" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Menu</Link>
              <Link to="/cart" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Cart</Link>
              <Link to="/offers" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Offers</Link>
            </div>
            <h3 className="text-lg font-bold text-foreground mb-4 mt-6">Policies</h3>
            <div className="space-y-2">
              <Link to="/contact" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Contact Us</Link>
              <Link to="/terms" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Terms & Conditions</Link>
              <Link to="/refunds" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Refunds & Cancellations</Link>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">Contact & Timing</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock3 className="w-4 h-4 text-primary" /><span>Open: 5 PM – 5 AM</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 text-primary" />
                <a href="tel:8909286581" className="hover:text-primary transition-colors">8909286581</a>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" /><span>Bidholi, Dehradun</span>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-5xl mx-auto mt-8 pt-6 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">© 2024 Waffle Da! All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
