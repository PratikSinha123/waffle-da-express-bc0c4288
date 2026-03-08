import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useOrders, OrderStatus, Order } from "@/context/OrderContext";
import { supabase } from "@/integrations/supabase/client";
import { Search, CheckCircle2, Clock, Truck, Package, Phone, History } from "lucide-react";

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

const TrackOrderPage = () => {
  const [searchParams] = useSearchParams();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const { getOrdersByPhone, getOrder } = useOrders();
  const [matchedOrders, setMatchedOrders] = useState<Order[]>([]);
  const [pastOrders, setPastOrders] = useState<PastOrder[]>([]);
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      const order = getOrder(id);
      if (order) { setPhoneNumber(order.phone); setMatchedOrders([order]); setSearched(true); }
    }
  }, [searchParams, getOrder]);

  const fetchPastOrders = async (phone: string) => {
    const { data } = await supabase
      .from("deleted_orders")
      .select("*")
      .eq("phone", phone)
      .order("created_at", { ascending: false });
    return (data || []) as PastOrder[];
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = phoneNumber.trim();
    if (!trimmed) return;
    setLoading(true);
    const active = getOrdersByPhone(trimmed);
    setMatchedOrders(active);
    const past = await fetchPastOrders(trimmed);
    setPastOrders(past);
    setSearched(true);
    setActiveTab(active.length > 0 ? "active" : past.length > 0 ? "history" : "active");
    setLoading(false);
  };

  const totalOrders = matchedOrders.length + pastOrders.length;

  return (
    <div className="min-h-screen bg-pattern-dots">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="page-header">
          <h1 className="text-3xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
            Track Your <span className="text-gradient italic">Order</span>
          </h1>
          <p className="text-muted-foreground mt-1">Enter your phone number to see your orders</p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="tel" value={phoneNumber}
              onChange={(e) => { setPhoneNumber(e.target.value); setSearched(false); }}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
              placeholder="Enter your phone number" />
          </div>
          <button type="submit" disabled={loading} className="px-6 py-3 rounded-2xl waffle-gradient-warm text-primary-foreground font-semibold hover:opacity-95 transition-all glow-accent disabled:opacity-50">
            <Search className="w-5 h-5" />
          </button>
        </form>

        {searched && totalOrders > 0 && (
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab("active")}
              className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-all ${activeTab === "active" ? "waffle-gradient-warm text-primary-foreground" : "bg-card border border-border text-muted-foreground"}`}
            >
              Active Orders ({matchedOrders.length})
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-1.5 ${activeTab === "history" ? "waffle-gradient-warm text-primary-foreground" : "bg-card border border-border text-muted-foreground"}`}
            >
              <History className="w-4 h-4" /> Past Orders ({pastOrders.length})
            </button>
          </div>
        )}

        {loading && (
          <div className="waffle-card-elevated text-center py-12">
            <p className="text-muted-foreground text-lg">Searching...</p>
          </div>
        )}

        {searched && !loading && totalOrders === 0 && (
          <div className="waffle-card-elevated text-center py-12">
            <p className="text-muted-foreground text-lg">No orders found for this phone number</p>
          </div>
        )}

        {/* Active Orders Tab */}
        {searched && !loading && activeTab === "active" && (
          <div className="space-y-6">
            {matchedOrders.length === 0 ? (
              <div className="waffle-card-elevated text-center py-8">
                <p className="text-muted-foreground">No active orders right now</p>
              </div>
            ) : (
              matchedOrders.map((order) => {
                const currentStepIndex = statusSteps.findIndex((s) => s.status === order.status);
                return (
                  <div key={order.id} className="space-y-4">
                    <div className="waffle-card-elevated p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="font-semibold text-foreground text-lg">Order {order.id}</h2>
                        <span className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleString()}</span>
                      </div>
                      <div className="space-y-0">
                        {statusSteps.map((step, index) => {
                          const isCompleted = index <= currentStepIndex;
                          const isCurrent = index === currentStepIndex;
                          return (
                            <div key={step.status} className="flex items-start gap-4">
                              <div className="flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isCompleted ? "waffle-gradient-warm glow-accent" : "bg-secondary"}`}>
                                  <step.icon className={`w-5 h-5 ${isCompleted ? "text-primary-foreground" : "text-muted-foreground"}`} />
                                </div>
                                {index < statusSteps.length - 1 && <div className={`w-0.5 h-8 ${isCompleted ? "bg-primary" : "bg-border"}`} />}
                              </div>
                              <div className="pt-2">
                                <p className={`font-medium ${isCurrent ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"}`}>{step.label}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="waffle-card-elevated p-6 space-y-3">
                      <h2 className="font-semibold text-foreground text-lg">Order Details</h2>
                      <div className="text-sm space-y-2">
                        <div className="flex justify-between"><span className="text-muted-foreground">Order Type</span><span className="font-medium text-foreground">{order.orderType}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Payment</span><span className="font-medium text-foreground">{order.paymentMethod}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Total</span><span className="font-bold text-foreground">₹{order.total}</span></div>
                      </div>
                    </div>

                    <div className="waffle-card-elevated p-6 space-y-3">
                      <h2 className="font-semibold text-foreground text-lg">Items Ordered</h2>
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm py-2 border-b border-border last:border-0">
                          <div>
                            <span className="text-foreground font-medium">{item.quantity}x {item.menuItem.name}</span>
                            {item.selectedAddOns.length > 0 && <p className="text-xs text-muted-foreground mt-0.5">+ {item.selectedAddOns.map((a) => a.name).join(", ")}</p>}
                          </div>
                          <span className="text-foreground font-medium">₹{(item.selectedPrice + item.selectedAddOns.reduce((s, a) => s + a.price, 0)) * item.quantity}</span>
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
                <p className="text-muted-foreground">No past orders found</p>
              </div>
            ) : (
              pastOrders.map((order) => {
                const items = Array.isArray(order.items) ? order.items : [];
                return (
                  <div key={order.id} className="space-y-4">
                    <div className="waffle-card-elevated p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold text-foreground text-lg">Order {order.id}</h2>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-accent text-accent-foreground">
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleString()}</p>
                    </div>

                    <div className="waffle-card-elevated p-6 space-y-3">
                      <h2 className="font-semibold text-foreground text-lg">Order Details</h2>
                      <div className="text-sm space-y-2">
                        <div className="flex justify-between"><span className="text-muted-foreground">Order Type</span><span className="font-medium text-foreground">{order.order_type}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Payment</span><span className="font-medium text-foreground">{order.payment_method}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Total</span><span className="font-bold text-foreground">₹{order.total}</span></div>
                      </div>
                    </div>

                    <div className="waffle-card-elevated p-6 space-y-3">
                      <h2 className="font-semibold text-foreground text-lg">Items Ordered</h2>
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
