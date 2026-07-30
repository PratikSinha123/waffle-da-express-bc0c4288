import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useOrders, OrderType } from "@/context/OrderContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Truck, Store, UtensilsCrossed, Loader2, Banknote } from "lucide-react";
import ShopClosedBanner from "@/components/ShopClosedBanner";
import { useShopStatus } from "@/context/ShopStatusContext";

const orderTypeOptions: { type: OrderType; icon: typeof Truck; label: string; desc: string }[] = [
  { type: "Delivery", icon: Truck, label: "Delivery", desc: "Delivered to your doorstep" },
  { type: "Pickup", icon: Store, label: "Pickup", desc: "Pick up from our store" },
  { type: "Dine-in", icon: UtensilsCrossed, label: "Dine-in", desc: "Eat at our restaurant" },
];

const CheckoutPage = () => {
  const { items, subtotal, deliveryFee, total, clearCart, orderType, setOrderType, hasStallItems } = useCart();
  const { addOrder } = useOrders();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [form, setForm] = useState({ name: "", phone: "", address: "", notes: "" });
  const [isProcessing, setIsProcessing] = useState(false);
  const needsAddress = orderType === "Delivery";

  const { isShopOpen: shopOpen } = useShopStatus();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopOpen) { toast({ title: "We're closed right now", description: "We're not accepting orders right now.", variant: "destructive" }); return; }
    if (!form.name.trim() || !form.phone.trim()) { toast({ title: "Please fill name and phone number", variant: "destructive" }); return; }
    if (needsAddress && !form.address.trim()) { toast({ title: "Please fill delivery address", variant: "destructive" }); return; }
    if (items.length === 0) { toast({ title: "Your cart is empty", variant: "destructive" }); return; }

    setIsProcessing(true);

    try {
      const orderId = addOrder({
        items,
        customerName: form.name.trim(),
        phone: form.phone.trim(),
        address: needsAddress ? form.address.trim() : `${orderType} - No address needed`,
        notes: form.notes.trim(),
        paymentMethod: "Cash On Delivery",
        orderType,
        subtotal,
        deliveryFee,
        total,
      });

      clearCart();
      try {
        localStorage.setItem("waffle_customer_phone", form.phone.trim());
        localStorage.setItem("waffle_last_order_id", orderId);
      } catch (e) {
        console.error("Failed to save to localStorage:", e);
      }
      toast({ title: "Order placed successfully! 🧇", description: `Your Order ID is ${orderId}` });
      navigate(`/track-order?id=${orderId}`);
    } catch (err: any) {
      setIsProcessing(false);
      toast({ title: "Order failed", description: err.message || "Failed to place order. Try again.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-pattern-dots">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="page-header">
          <h1 className="text-3xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
            <span className="text-gradient italic">Checkout</span>
          </h1>
          <p className="text-muted-foreground mt-1">Almost there! Complete your order</p>
        </div>

        <ShopClosedBanner />

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Order Type */}
          <div className="waffle-card-elevated space-y-4">
            <h2 className="font-semibold text-foreground text-lg">Order Type</h2>
            <div className="grid grid-cols-3 gap-3">
              {(hasStallItems ? orderTypeOptions.filter(o => o.type === "Pickup") : orderTypeOptions).map((opt) => (
                <button key={opt.type} type="button" onClick={() => setOrderType(opt.type)}
                  className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                    orderType === opt.type ? "border-primary bg-primary/10" : "border-border hover:border-primary/30"
                  }`}>
                  <opt.icon className={`w-6 h-6 mb-2 ${orderType === opt.type ? "text-primary" : "text-muted-foreground"}`} />
                  <span className={`text-sm font-semibold ${orderType === opt.type ? "text-primary" : "text-foreground"}`}>{opt.label}</span>
                  <span className="text-xs text-muted-foreground text-center mt-1">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Customer Details */}
          <div className="waffle-card-elevated space-y-4">
            <h2 className="font-semibold text-foreground text-lg">{orderType === "Delivery" ? "Delivery Details" : "Your Details"}</h2>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Name *</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow" placeholder="Your full name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Phone Number *</label>
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required
                className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow" placeholder="Your phone number" />
            </div>
            {needsAddress && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Delivery Address *</label>
                <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} rows={3} required
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none transition-shadow" placeholder="Full delivery address" />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Order Notes</label>
              <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2}
                className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none transition-shadow" placeholder="Any special instructions..." />
            </div>
          </div>

          {/* Payment */}
          <div className="waffle-card-elevated space-y-4">
            <h2 className="font-semibold text-foreground text-lg">Payment Method</h2>
            <div className="flex items-center gap-3 p-4 rounded-xl border-2 border-primary bg-primary/10">
              <Banknote className="w-6 h-6 text-primary" />
              <div>
                <p className="font-semibold text-primary text-sm">Cash On Delivery / Pay at Store</p>
                <p className="text-xs text-muted-foreground mt-0.5">Pay with Cash or UPI directly upon receiving your order.</p>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="waffle-card-elevated space-y-3">
            <h2 className="font-semibold text-foreground text-lg">Order Summary</h2>
            <div className="flex justify-between text-sm text-muted-foreground"><span>Order Type</span><span className="font-medium text-foreground">{orderType}</span></div>
            <div className="flex justify-between text-muted-foreground"><span>Subtotal ({items.length} items)</span><span>₹{subtotal}</span></div>
            <div className="flex justify-between text-muted-foreground">
              <span>Delivery Fee</span>
              {orderType === "Delivery" ? <span>₹{deliveryFee}</span> : <span className="text-green-600 font-medium">FREE</span>}
            </div>
            <div className="section-divider" />
            <div className="flex justify-between text-lg font-bold text-foreground pt-1"><span>Total</span><span>₹{total}</span></div>
          </div>

          <button type="submit" disabled={isProcessing || !shopOpen}
            className="w-full py-4 rounded-2xl waffle-gradient-warm text-primary-foreground font-semibold text-lg hover:opacity-95 transition-all disabled:opacity-60 flex items-center justify-center gap-2 glow-accent hover:scale-[1.01]">
            {!shopOpen ? "🕐 Shop is Closed" : isProcessing ? (<><Loader2 className="w-5 h-5 animate-spin" />Processing...</>) : "Place Order"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
