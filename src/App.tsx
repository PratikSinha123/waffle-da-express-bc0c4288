import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Capacitor } from "@capacitor/core";
import { CartProvider } from "@/context/CartContext";
import { OrderProvider } from "@/context/OrderContext";
import { MenuProvider } from "@/context/MenuContext";
import { ShopStatusProvider } from "@/context/ShopStatusContext";
import { StallScheduleProvider } from "@/context/StallScheduleContext";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/routes/ProtectedRoute";
import NativeAdminGuard from "@/routes/NativeAdminGuard";
import AdminLayout from "@/layouts/AdminLayout";
import Navbar from "@/components/Navbar";
import PageTransition from "@/components/PageTransition";
import Index from "./pages/Index";
import MenuPage from "./pages/MenuPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import TrackOrderPage from "./pages/TrackOrderPage";
import OffersPage from "./pages/OffersPage";
import PaymentStatusPage from "./pages/PaymentStatusPage";
import ContactPage from "./pages/ContactPage";
import TermsPage from "./pages/TermsPage";
import RefundsPage from "./pages/RefundsPage";
import StallMenuPage from "./pages/StallMenuPage";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminOrders from "./pages/admin/Orders";
import AdminProducts from "./pages/admin/Products";
import AdminCustomers from "./pages/admin/Customers";
import AdminOffers from "./pages/admin/Offers";
import AdminSettings from "./pages/admin/Settings";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // If we're on mobile and at the root, auto-redirect to admin
  useEffect(() => {
    if (Capacitor.isNativePlatform() && location.pathname === "/") {
      navigate("/admin", { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Customer Routes */}
        <Route path="/" element={<PageTransition><Index /></PageTransition>} />
        <Route path="/menu" element={<PageTransition><MenuPage /></PageTransition>} />
        <Route path="/stall-menu" element={<PageTransition><StallMenuPage /></PageTransition>} />
        <Route path="/cart" element={<PageTransition><CartPage /></PageTransition>} />
        <Route path="/checkout" element={<PageTransition><CheckoutPage /></PageTransition>} />
        <Route path="/track-order" element={<PageTransition><TrackOrderPage /></PageTransition>} />
        <Route path="/offers" element={<PageTransition><OffersPage /></PageTransition>} />
        <Route path="/payment-status" element={<PageTransition><PaymentStatusPage /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><ContactPage /></PageTransition>} />
        <Route path="/terms" element={<PageTransition><TermsPage /></PageTransition>} />
        <Route path="/refunds" element={<PageTransition><RefundsPage /></PageTransition>} />

        {/* Admin Routes - Restricted to Native Mobile App */}
        <Route path="/admin/login" element={<NativeAdminGuard><AdminLogin /></NativeAdminGuard>} />
        <Route path="/admin" element={<NativeAdminGuard><ProtectedRoute><AdminLayout /></ProtectedRoute></NativeAdminGuard>}>
          <Route index element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="offers" element={<AdminOffers />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ShopStatusProvider>
          <StallScheduleProvider>
            <MenuProvider>
              <CartProvider>
                <OrderProvider>
                  <Toaster />
                  <Sonner />
                  <BrowserRouter>
                    <Navbar />
                    <AnimatedRoutes />
                  </BrowserRouter>
                </OrderProvider>
              </CartProvider>
            </MenuProvider>
          </StallScheduleProvider>
        </ShopStatusProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
