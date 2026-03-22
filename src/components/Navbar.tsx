import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { useStallSchedule } from "@/context/StallScheduleContext";


const Navbar = () => {
  const { totalItems } = useCart();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isStallActive } = useStallSchedule();

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
      <nav className="sticky top-0 z-50 bg-card/90 backdrop-blur-xl border-b border-border/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-gradient italic" style={{ fontFamily: "'Playfair Display', serif" }}>
                Waffle Da
              </span>
              <span className="text-xl">🧇</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {links.map((link) => (
                <Link key={link.to} to={link.to}
                  className={`text-sm font-medium transition-colors duration-200 relative ${
                    isActive(link.to) ? "text-primary" : "text-foreground/70 hover:text-primary"
                  }`}>
                  {link.label}
                  {isActive(link.to) && <span className="absolute -bottom-1 left-0 right-0 h-0.5 waffle-gradient rounded-full" />}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Link to="/cart" className="relative p-2.5 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors">
                <ShoppingCart className="w-5 h-5 text-primary" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 waffle-gradient-warm text-primary-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                    {totalItems}
                  </span>
                )}
              </Link>
              <button className="md:hidden p-2 rounded-full hover:bg-secondary" onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {mobileOpen && (
            <div className="md:hidden pb-4 space-y-1">
              {links.map((link) => (
                <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive(link.to) ? "text-primary font-semibold bg-primary/5" : "text-foreground/70 hover:text-primary"
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
