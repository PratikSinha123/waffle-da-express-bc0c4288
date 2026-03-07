import { Link } from "react-router-dom";
import { ArrowRight, UtensilsCrossed, Truck, Clock, MapPin, Phone, Clock3 } from "lucide-react";
import heroImage from "@/assets/hero-waffles.jpg";
import logo from "@/assets/waffle-da-logo.png";
import { useMenu } from "@/context/MenuContext";

const categoryIcons: Record<string, string> = {
  "Waffles": "🧇",
  "Waffle Cakes": "🎂",
  "Spiral Potatoes": "🥔",
  "Hot Chocolate": "☕",
  "Ice Cream": "🍦",
  "French Fries": "🍟",
  "Veg Sandwich": "🥪",
  "Chicken Sandwich": "🥪",
  "Veg Burger": "🍔",
  "Chicken Burger": "🍔",
  "Maggi": "🍜",
  "Garlic Bread": "🧄",
  "Veg Pizza": "🍕",
  "Chicken Pizza": "🍕",
  "Pasta": "🍝",
  "Quick Bites": "🍗",
  "Sweet Dish": "🍮",
  "Tea": "🍵",
  "Coffee": "☕",
  "Ice Tea": "🧊",
  "Shakes": "🥤",
};

const Index = () => {
  const { menuItems, categories } = useMenu();

  const getCategoryCount = (cat: string) =>
    menuItems.filter((item) => item.category === cat).length;

  const menuCategories = categories.filter((c) => c !== "All" && getCategoryCount(c) > 0);

  return (
    <div className="min-h-screen">
      {/* Hero - Full screen */}
      <section className="relative h-[100vh] -mt-[4.25rem] overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Delicious waffles" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        </div>

        <div className="relative h-full max-w-7xl mx-auto px-6 sm:px-10 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-primary/90 text-primary-foreground text-sm font-medium w-fit">
            📍 Now in Bidholi
          </div>
          <h1
            className="text-5xl sm:text-7xl lg:text-8xl font-bold text-white mb-6 leading-[1.1] italic"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Waffle Da
          </h1>
          <p className="text-base sm:text-lg text-white/70 max-w-lg mb-10 leading-relaxed">
            Handcrafted waffles, fluffy pancakes & creamy shakes — made fresh, served with love. 🧇
          </p>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-semibold text-lg hover:opacity-90 transition-opacity w-fit shadow-lg"
          >
            Order Now <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Explore Our Menu */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Explore Our Menu</h2>
          <p className="text-muted-foreground mb-10">Tap a category to jump right in</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {menuCategories.map((cat) => (
              <Link
                key={cat}
                to="/menu"
                className="waffle-card p-5 hover:scale-[1.03] hover:shadow-md transition-all text-center group"
              >
                <span className="text-3xl mb-2 block group-hover:scale-110 transition-transform">
                  {categoryIcons[cat] || "🍽️"}
                </span>
                <span className="font-semibold text-foreground text-sm block">{cat}</span>
                <span className="text-xs text-muted-foreground">{getCategoryCount(cat)} items</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-secondary/30">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: UtensilsCrossed, title: "Fresh & Tasty", desc: "Made with premium ingredients, prepared fresh for every order" },
            { icon: Truck, title: "Fast Delivery", desc: "Quick delivery right to your doorstep in minimum time" },
            { icon: Clock, title: "Track Live", desc: "Real-time order tracking so you know exactly when it arrives" },
          ].map((feature) => (
            <div key={feature.title} className="waffle-card text-center p-8">
              <div className="w-14 h-14 rounded-2xl waffle-gradient flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="font-bold text-foreground text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl font-bold text-primary">Waffle Da</span>
              <span className="text-xl">🧇</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Delicious waffles, pancakes & shakes made with love in Bidholi.
            </p>
            <div className="flex gap-3">
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary/10 transition-colors"
              >
                <MapPin className="w-4 h-4 text-primary" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary/10 transition-colors"
              >
                <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Home</Link>
              <Link to="/menu" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Menu</Link>
              <Link to="/cart" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Cart</Link>
              <Link to="/offers" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Offers</Link>
            </div>
          </div>

          {/* Contact & Timing */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">Contact & Timing</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock3 className="w-4 h-4 text-primary" />
                <span>Open: 5 PM – 5 AM</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 text-primary" />
                <a href="tel:8909286581" className="hover:text-primary transition-colors">8909286581</a>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Bidholi, Dehradun</span>
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
