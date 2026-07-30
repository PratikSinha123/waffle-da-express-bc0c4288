import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { OrderProvider } from "@/context/OrderContext";
import { MenuProvider } from "@/context/MenuContext";
import { ShopStatusProvider } from "@/context/ShopStatusContext";
import { StallScheduleProvider } from "@/context/StallScheduleContext";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/routes/ProtectedRoute";
import AdminLayout from "@/layouts/AdminLayout";
import Navbar from "@/components/Navbar";
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

const AppRoutes = () => {
  const location = useLocation();

  return (
    <Routes location={location}>
      {/* Customer Routes */}
      <Route path="/" element={<Index />} />
      <Route path="/menu" element={<MenuPage />} />
      <Route path="/stall-menu" element={<StallMenuPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/track-order" element={<TrackOrderPage />} />
      <Route path="/offers" element={<OffersPage />} />
      <Route path="/payment-status" element={<PaymentStatusPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/refunds" element={<RefundsPage />} />

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="offers" element={<AdminOffers />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
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
                    <AppRoutes />
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
