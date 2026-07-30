import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Menu, X, Sparkles } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { useStallSchedule } from "@/context/StallScheduleContext";


const Navbar = () => {
  const { totalItems } = useCart();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isStallActive } = useStallSchedule();

  // Hide navbar on admin routes — admin has its own standalone header
  if (location.pathname.startsWith("/admin")) return null;

  const links = [
    { to: "/", label: "Home" },
    { to: "/menu", label: "Menu" },
    ...(isStallActive ? [{ to: "/stall-menu", label: "🏪 Stall Menu" }] : []),
    { to: "/track-order", label: "Track Order" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <div className="h-1 waffle-gradient-warm" />
      <nav className="sticky top-0 z-50 glass-panel border-x-0 border-t-0 rounded-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 py-2">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="block text-xl font-bold text-gradient italic group-hover:opacity-90 transition-opacity" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Waffle Da
                  </span>
                  <span className="text-2xl animate-float group-hover:scale-110 transition-transform duration-300 inline-block" style={{ animationDuration: "3s" }}>🧇</span>
                </div>
                <span className="block text-[11px] uppercase tracking-[0.22em] text-muted-foreground mt-0.5">
                  Fresh bites in Bidholi
                </span>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-2 rounded-full bg-secondary/40 border border-border/60 px-2 py-1.5 shadow-sm">
              {links.map((link) => (
                <Link key={link.to} to={link.to}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 relative ${
                    isActive(link.to)
                      ? "text-primary-foreground bg-primary shadow-sm"
                      : "text-foreground/70 hover:text-foreground hover:bg-background/80"
                  }`}>
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Link to="/cart" className="relative p-2.5 rounded-full bg-primary/10 hover:bg-primary/20 transition-all border border-primary/10 hover:border-primary/20">
                <ShoppingCart className="w-5 h-5 text-primary" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 waffle-gradient-warm text-primary-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                    {totalItems}
                  </span>
                )}
              </Link>
              <button className="md:hidden p-2 rounded-full hover:bg-secondary border border-border/60" onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {mobileOpen && (
            <div className="md:hidden pb-4 space-y-2 border-t border-border/60 pt-3">
              {links.map((link) => (
                <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                    isActive(link.to)
                      ? "text-primary-foreground font-semibold waffle-gradient"
                      : "text-foreground/70 hover:text-foreground bg-secondary/40 hover:bg-secondary"
                  }`}>
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
