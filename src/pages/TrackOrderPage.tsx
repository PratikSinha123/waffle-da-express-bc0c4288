import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useOrders, OrderStatus, Order } from "@/context/OrderContext";
import { Search, CheckCircle2, Clock, Truck, Package, Phone } from "lucide-react";

const statusSteps: { status: OrderStatus; icon: typeof Package; label: string }[] = [
  { status: "Order Received", icon: Package, label: "Order Received" },
  { status: "Preparing", icon: Clock, label: "Preparing" },
  { status: "Out for Delivery", icon: Truck, label: "Out for Delivery" },
  { status: "Delivered", icon: CheckCircle2, label: "Delivered" },
];

const TrackOrderPage = () => {
  const [searchParams] = useSearchParams();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [searched, setSearched] = useState(false);
  const { getOrdersByPhone, getOrder } = useOrders();
  const [matchedOrders, setMatchedOrders] = useState<Order[]>([]);

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      const order = getOrder(id);
      if (order) { setPhoneNumber(order.phone); setMatchedOrders([order]); setSearched(true); }
    }
  }, [searchParams, getOrder]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = phoneNumber.trim();
    if (!trimmed) return;
    setMatchedOrders(getOrdersByPhone(trimmed));
    setSearched(true);
  };

  return (
    <div className="min-h-screen bg-pattern-dots">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="page-header">
          <h1 className="text-3xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
            Track Your <span className="text-gradient italic">Order</span>
          </h1>
          <p className="text-muted-foreground mt-1">Enter your phone number to see your orders</p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-3 mb-8">
          <div className="relative flex-1">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="tel" value={phoneNumber}
              onChange={(e) => { setPhoneNumber(e.target.value); setSearched(false); }}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
              placeholder="Enter your phone number" />
          </div>
          <button type="submit" className="px-6 py-3 rounded-2xl waffle-gradient-warm text-primary-foreground font-semibold hover:opacity-95 transition-all glow-accent">
            <Search className="w-5 h-5" />
          </button>
        </form>

        {searched && matchedOrders.length === 0 && (
          <div className="waffle-card-elevated text-center py-12">
            <p className="text-muted-foreground text-lg">No orders found for this phone number</p>
          </div>
        )}

        {matchedOrders.length > 0 && (
          <div className="space-y-6">
            {matchedOrders.map((order) => {
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
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrderPage;
