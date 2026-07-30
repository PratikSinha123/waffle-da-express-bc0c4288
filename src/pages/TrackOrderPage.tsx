import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useOrders, OrderStatus, Order } from "@/context/OrderContext";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { Search, CheckCircle2, Clock, Truck, Package, Phone, History, RefreshCw, XCircle, Copy, PhoneCall, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const statusSteps: { status: OrderStatus; icon: typeof Package; label: string }[] = [
  { status: "Order Received", icon: Package, label: "Order Received" },
  { status: "Preparing", icon: Clock, label: "Preparing" },
  { status: "Out for Delivery", icon: Truck, label: "Out for Delivery" },
  { status: "Delivered", icon: CheckCircle2, label: "Delivered" },
];

interface PastOrder {
  id: string;
  customer_name: string;
  phone: string;
  address: string;
  notes: string;
  payment_method: string;
  order_type: string;
  status: string;
  subtotal: number;
  delivery_fee: number;
  total: number;
  created_at: string;
  items: any;
}

// Helper DB row -> Order
const dbRowToOrder = (row: any): Order => ({
  id: row.id,
  items: row.items || [],
  customerName: row.customer_name,
  phone: row.phone,
  address: row.address || "",
  notes: row.notes || "",
  paymentMethod: row.payment_method,
  orderType: row.order_type,
  status: row.status,
  subtotal: Number(row.subtotal),
  deliveryFee: Number(row.delivery_fee),
  total: Number(row.total),
  createdAt: row.created_at,
  seen: row.seen ?? false,
  deliveredAt: row.delivered_at ?? null,
});

const TrackOrderPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const { orders: contextOrders } = useOrders();
  const { addToCart, clearCart } = useCart();
  const { toast } = useToast();
  const [matchedOrders, setMatchedOrders] = useState<Order[]>([]);
  const [pastOrders, setPastOrders] = useState<PastOrder[]>([]);
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");

  const handleReorder = (items: any[]) => {
    clearCart();
    items.forEach((item: any) => {
      const cartItem = {
        id: `${item.menuItem?.id || item.id}-${Date.now()}-${Math.random()}`,
        menuItem: item.menuItem || { id: item.id, name: item.name, price: item.price || item.selectedPrice, category: "", description: "", isVeg: true },
        selectedAddOns: item.selectedAddOns || [],
        quantity: item.quantity || 1,
        selectedPrice: item.selectedPrice || item.price || 0,
        selectedPriceLabel: item.selectedPriceLabel,
      };
      addToCart(cartItem);
    });
    toast({ title: "Items added to cart! 🛒" });
    navigate("/cart");
  };

  const copyOrderId = (id: string) => {
    navigator.clipboard.writeText(id);
    toast({ title: "Order ID copied! 📋", description: id });
  };

  // Execute Search by Phone or Order ID
  const performSearch = useCallback(async (queryStr: string) => {
    const query = queryStr.trim();
    if (!query) return;

    setLoading(true);
    setActiveQuery(query);
    setSearched(true);

    const isPhoneQuery = /^\+?[0-9\s\-]{6,15}$/.test(query);
    const cleanPhone = query.replace(/\s+/g, "");
    const lowerQuery = query.toLowerCase();

    // 1. Save to Local Storage for auto-recall
    try {
      if (isPhoneQuery) {
        localStorage.setItem("waffle_customer_phone", query);
      } else {
        localStorage.setItem("waffle_last_order_id", query);
      }
    } catch (e) {
      console.error(e);
    }

    // 2. Query Active Orders from Supabase DB directly for guaranteed accuracy
    let dbActiveOrders: Order[] = [];
    let dbPastOrders: PastOrder[] = [];

    try {
      if (isPhoneQuery) {
        const [activeRes, pastRes] = await Promise.all([
          supabase.from("orders").select("*").ilike("phone", `%${cleanPhone}%`).order("created_at", { ascending: false }),
          supabase.from("deleted_orders").select("*").ilike("phone", `%${cleanPhone}%`).order("created_at", { ascending: false }),
        ]);
        if (activeRes.data) dbActiveOrders = activeRes.data.map(dbRowToOrder);
        if (pastRes.data) dbPastOrders = pastRes.data as PastOrder[];
      } else {
        const [activeRes, pastRes] = await Promise.all([
          supabase.from("orders").select("*").ilike("id", `%${lowerQuery}%`).order("created_at", { ascending: false }),
          supabase.from("deleted_orders").select("*").ilike("id", `%${lowerQuery}%`).order("created_at", { ascending: false }),
        ]);
        if (activeRes.data) dbActiveOrders = activeRes.data.map(dbRowToOrder);
        if (pastRes.data) dbPastOrders = pastRes.data as PastOrder[];
      }
    } catch (err) {
      console.error("DB Order query error:", err);
    }

    // Combine DB results with in-memory context (deduplicating by ID)
    const contextActiveMatches = contextOrders.filter((o) => {
      const matchPhone = o.phone.replace(/\s+/g, "").includes(cleanPhone);
      const matchId = o.id.toLowerCase().includes(lowerQuery);
      return isPhoneQuery ? matchPhone : matchId;
    });

    const activeMap = new Map<string, Order>();
    dbActiveOrders.forEach((o) => activeMap.set(o.id, o));
    contextActiveMatches.forEach((o) => activeMap.set(o.id, o));
    const combinedActive = Array.from(activeMap.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    setMatchedOrders(combinedActive);
    setPastOrders(dbPastOrders);

    if (combinedActive.length > 0) {
      setActiveTab("active");
    } else if (dbPastOrders.length > 0) {
      setActiveTab("history");
    }

    setLoading(false);
  }, [contextOrders]);

  // Keep active matched orders updated live when context orders change
  useEffect(() => {
    if (!activeQuery) return;
    const isPhoneQuery = /^\+?[0-9\s\-]{6,15}$/.test(activeQuery);
    const cleanPhone = activeQuery.replace(/\s+/g, "");
    const lowerQuery = activeQuery.toLowerCase();

    const currentMatches = contextOrders.filter((o) => {
      const matchPhone = o.phone.replace(/\s+/g, "").includes(cleanPhone);
      const matchId = o.id.toLowerCase().includes(lowerQuery);
      return isPhoneQuery ? matchPhone : matchId;
    });

    if (currentMatches.length > 0) {
      setMatchedOrders((prev) => {
        const prevMap = new Map(prev.map((o) => [o.id, o]));
        currentMatches.forEach((o) => prevMap.set(o.id, o));
        return Array.from(prevMap.values()).sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
    }
  }, [contextOrders, activeQuery]);

  // Initial Load Handler: URL Params > LocalStorage
  useEffect(() => {
    const urlId = searchParams.get("id");
    if (urlId) {
      setSearchInput(urlId);
      performSearch(urlId);
      return;
    }

    try {
      const savedPhone = localStorage.getItem("waffle_customer_phone");
      const savedId = localStorage.getItem("waffle_last_order_id");
      const initialQuery = savedId || savedPhone;
      if (initialQuery) {
        setSearchInput(initialQuery);
        performSearch(initialQuery);
      }
    } catch (e) {
      console.error(e);
    }
  }, [searchParams, performSearch]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchInput);
  };

  const totalOrders = matchedOrders.length + pastOrders.length;

  return (
    <div className="min-h-screen bg-pattern-dots">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="page-header">
          <h1 className="text-3xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
            Track Your <span className="text-gradient italic">Order</span>
          </h1>
          <p className="text-muted-foreground mt-1">Enter your phone number or Order ID (e.g. WD-1234)</p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleFormSubmit} className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow text-sm"
              placeholder="Phone number or Order ID..."
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => { setSearchInput(""); setSearched(false); setActiveQuery(""); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={loading || !searchInput.trim()}
            className="px-6 py-3.5 rounded-2xl waffle-gradient-warm text-primary-foreground font-semibold hover:opacity-95 transition-all glow-accent disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </form>

        {/* Tabs */}
        {searched && totalOrders > 0 && (
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab("active")}
              className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                activeTab === "active" ? "waffle-gradient-warm text-primary-foreground shadow-md" : "bg-card border border-border text-muted-foreground"
              }`}
            >
              Active Orders ({matchedOrders.length})
              {matchedOrders.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "history" ? "waffle-gradient-warm text-primary-foreground shadow-md" : "bg-card border border-border text-muted-foreground"
              }`}
            >
              <History className="w-4 h-4" /> Past Orders ({pastOrders.length})
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="waffle-card-elevated text-center py-12 space-y-3">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-muted-foreground text-sm font-medium">Fetching live order status...</p>
          </div>
        )}

        {/* Empty Result */}
        {searched && !loading && totalOrders === 0 && (
          <div className="waffle-card-elevated text-center py-12 space-y-3">
            <Package className="w-12 h-12 text-muted-foreground/40 mx-auto" />
            <p className="text-foreground text-lg font-semibold">No orders found</p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              We couldn't find any orders matching "<strong>{activeQuery}</strong>". Please check your phone number or Order ID.
            </p>
          </div>
        )}

        {/* Active Orders Tab */}
        {searched && !loading && activeTab === "active" && (
          <div className="space-y-6">
            {matchedOrders.length === 0 ? (
              <div className="waffle-card-elevated text-center py-8">
                <p className="text-muted-foreground text-sm">No active orders right now</p>
              </div>
            ) : (
              matchedOrders.map((order) => {
                const isCancelled = order.status === "Can't be Delivered";
                const isDelivered = order.status === "Delivered";
                const currentStepIndex = statusSteps.findIndex((s) => s.status === order.status);

                const stepsToRender = isCancelled
                  ? [
                      { status: "Order Received", icon: Package, label: "Order Received" },
                      { status: "Can't be Delivered", icon: XCircle, label: "Can't be Delivered" },
                    ]
                  : statusSteps;

                return (
                  <div key={order.id} className="space-y-4">
                    {/* Stepper Card */}
                    <div className="waffle-card-elevated p-6 relative overflow-hidden">
                      {/* Top Header */}
                      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="font-bold text-foreground text-xl tracking-tight">Order {order.id}</h2>
                            <button
                              onClick={() => copyOrderId(order.id)}
                              className="p-1 text-muted-foreground hover:text-primary transition-colors"
                              title="Copy Order ID"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{new Date(order.createdAt).toLocaleString()}</p>
                        </div>

                        {/* Status Badge */}
                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                            isCancelled
                              ? "bg-red-500/15 text-red-500 border border-red-500/30"
                              : isDelivered
                              ? "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30"
                              : order.status === "Preparing"
                              ? "bg-amber-500/15 text-amber-500 border border-amber-500/30"
                              : order.status === "Out for Delivery"
                              ? "bg-orange-500/15 text-orange-500 border border-orange-500/30"
                              : "bg-blue-500/15 text-blue-500 border border-blue-500/30"
                          }`}
                        >
                          {!isCancelled && !isDelivered && (
                            <span className="w-2 h-2 rounded-full bg-current animate-ping" />
                          )}
                          {order.status}
                        </span>
                      </div>

                      {/* Cancelled Banner */}
                      {isCancelled && (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-start gap-3 mb-6">
                          <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-bold text-red-400 text-base">Order Cannot Be Delivered</h4>
                            <p className="text-xs text-red-300/90 mt-1 leading-relaxed">
                              We're sorry! Our store is currently unable to fulfill or deliver this order. If you paid online, a refund will be issued. Please call our store if you need immediate assistance.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Stepper Timeline */}
                      <div className="space-y-0 pl-2">
                        {stepsToRender.map((step, index) => {
                          const isFailedStep = isCancelled && index === 1;
                          const isCompleted = isCancelled ? true : index <= currentStepIndex;
                          const isCurrent = isCancelled ? index === 1 : index === currentStepIndex;

                          return (
                            <div key={step.status} className="flex items-start gap-4">
                              <div className="flex flex-col items-center">
                                <div
                                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                                    isFailedStep
                                      ? "bg-red-500 text-white shadow-lg shadow-red-500/30"
                                      : isCurrent
                                      ? "waffle-gradient-warm glow-accent text-primary-foreground ring-4 ring-primary/20 scale-105"
                                      : isCompleted
                                      ? "waffle-gradient-warm text-primary-foreground"
                                      : "bg-secondary text-muted-foreground border border-border"
                                  }`}
                                >
                                  <step.icon className="w-5 h-5" />
                                </div>
                                {index < stepsToRender.length - 1 && (
                                  <div
                                    className={`w-0.5 h-10 transition-colors ${
                                      isFailedStep || isCancelled
                                        ? "bg-red-500/40"
                                        : isCompleted
                                        ? "bg-primary"
                                        : "bg-border"
                                    }`}
                                  />
                                )}
                              </div>
                              <div className="pt-2 pb-4">
                                <p
                                  className={`font-semibold text-sm ${
                                    isFailedStep
                                      ? "text-red-500"
                                      : isCurrent
                                      ? "text-primary text-base font-bold"
                                      : isCompleted
                                      ? "text-foreground"
                                      : "text-muted-foreground"
                                  }`}
                                >
                                  {step.label}
                                </p>
                                {isCurrent && !isCancelled && !isDelivered && (
                                  <p className="text-xs text-muted-foreground mt-0.5">In progress • Store is updating live</p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Store Call Assistance */}
                      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Have questions about your order?</span>
                        <a
                          href="tel:8909286581"
                          className="px-3.5 py-1.5 rounded-xl bg-card border border-border text-foreground hover:text-primary hover:border-primary/40 text-xs font-semibold flex items-center gap-1.5 transition-all"
                        >
                          <PhoneCall className="w-3.5 h-3.5 text-primary" /> Call Store (8909286581)
                        </a>
                      </div>
                    </div>

                    {/* Order Details Card */}
                    <div className="waffle-card-elevated p-6 space-y-3">
                      <h3 className="font-semibold text-foreground text-base">Order Details</h3>
                      <div className="text-sm space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Customer Name</span>
                          <span className="font-medium text-foreground">{order.customerName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Order Type</span>
                          <span className="font-medium text-foreground">{order.orderType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Address / Note</span>
                          <span className="font-medium text-foreground text-right max-w-[200px] truncate">{order.address || "Store Pickup"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Payment</span>
                          <span className="font-medium text-foreground">{order.paymentMethod}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-border">
                          <span className="font-bold text-foreground">Total Paid</span>
                          <span className="font-bold text-primary text-base">₹{order.total}</span>
                        </div>
                      </div>
                    </div>

                    {/* Items Ordered Card */}
                    <div className="waffle-card-elevated p-6 space-y-3">
                      <h3 className="font-semibold text-foreground text-base">Items Ordered</h3>
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm py-2 border-b border-border last:border-0">
                          <div>
                            <span className="text-foreground font-medium">{item.quantity}x {item.menuItem.name}</span>
                            {item.selectedAddOns.length > 0 && (
                              <p className="text-xs text-muted-foreground mt-0.5">+ {item.selectedAddOns.map((a) => a.name).join(", ")}</p>
                            )}
                          </div>
                          <span className="text-foreground font-medium">
                            ₹{(item.selectedPrice + item.selectedAddOns.reduce((s, a) => s + a.price, 0)) * item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Past Orders Tab */}
        {searched && !loading && activeTab === "history" && (
          <div className="space-y-6">
            {pastOrders.length === 0 ? (
              <div className="waffle-card-elevated text-center py-8">
                <p className="text-muted-foreground text-sm">No past orders found</p>
              </div>
            ) : (
              pastOrders.map((order) => {
                const items = Array.isArray(order.items) ? order.items : [];
                const isCancelled = order.status === "Can't be Delivered";

                return (
                  <div key={order.id} className="space-y-4">
                    <div className="waffle-card-elevated p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-foreground text-lg">Order {order.id}</h3>
                          <button
                            onClick={() => copyOrderId(order.id)}
                            className="p-1 text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            isCancelled
                              ? "bg-red-500/15 text-red-500 border border-red-500/30"
                              : "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleString()}</p>
                    </div>

                    <div className="waffle-card-elevated p-6 space-y-3">
                      <h3 className="font-semibold text-foreground text-base">Order Details</h3>
                      <div className="text-sm space-y-2">
                        <div className="flex justify-between"><span className="text-muted-foreground">Order Type</span><span className="font-medium text-foreground">{order.order_type}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Payment</span><span className="font-medium text-foreground">{order.payment_method}</span></div>
                        <div className="flex justify-between pt-2 border-t border-border">
                          <span className="font-bold text-foreground">Total</span>
                          <span className="font-bold text-primary">₹{order.total}</span>
                        </div>
                      </div>
                    </div>

                    <div className="waffle-card-elevated p-6 space-y-3">
                      <h3 className="font-semibold text-foreground text-base">Items Ordered</h3>
                      {items.map((item: any, i: number) => (
                        <div key={i} className="flex justify-between text-sm py-2 border-b border-border last:border-0">
                          <div>
                            <span className="text-foreground font-medium">{item.quantity}x {item.menuItem?.name || item.name || "Item"}</span>
                            {item.selectedAddOns?.length > 0 && <p className="text-xs text-muted-foreground mt-0.5">+ {item.selectedAddOns.map((a: any) => a.name).join(", ")}</p>}
                          </div>
                          <span className="text-foreground font-medium">
                            ₹{((item.selectedPrice || item.price || 0) + (item.selectedAddOns || []).reduce((s: number, a: any) => s + (a.price || 0), 0)) * (item.quantity || 1)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => handleReorder(items)}
                      className="w-full py-3.5 rounded-xl waffle-gradient-warm text-primary-foreground font-semibold hover:opacity-95 transition-all flex items-center justify-center gap-2 glow-accent"
                    >
                      <RefreshCw className="w-4 h-4" /> Reorder
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrderPage;
