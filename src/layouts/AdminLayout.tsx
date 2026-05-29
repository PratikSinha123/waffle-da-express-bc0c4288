import React from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useOrders } from "@/context/OrderContext";
import { useNativePush } from "@/hooks/use-native-push";
import {
  LayoutDashboard,
  ClipboardList,
  Utensils,
  Users,
  Settings,
  LogOut,
  Bell,
  Ticket
} from "lucide-react";

const AdminLayout: React.FC = () => {
  const { logout } = useAuth();
  const { unseenCount } = useOrders();
  const location = useLocation();

  // Register for push notifications on native platforms
  useNativePush();

  const navItems = [
    { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/admin/orders", icon: ClipboardList, label: "Orders", badge: unseenCount },
    { path: "/admin/products", icon: Utensils, label: "Products" },
    { path: "/admin/customers", icon: Users, label: "Customers" },
    { path: "/admin/offers", icon: Ticket, label: "Offers" },
    { path: "/admin/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card hidden md:flex flex-col">
        <div className="p-6 border-b border-border">
          <h1 className="text-xl font-bold italic font-serif">Waffle Da Admin</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.badge ? (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? "bg-white text-primary" : "bg-primary text-white"}`}>
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-lg font-semibold">
            {navItems.find(n => n.path === location.pathname)?.label || "Admin"}
          </h2>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-full hover:bg-secondary transition-colors">
              <Bell className="w-5 h-5" />
              {unseenCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full animate-pulse" />
              )}
            </button>
          </div>
        </header>
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
