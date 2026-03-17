import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useOrders, OrderType } from "@/context/OrderContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Truck, Store, UtensilsCrossed, Loader2, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ShopClosedBanner from "@/components/ShopClosedBanner";
import { useShopStatus } from "@/context/ShopStatusContext";

const orderTypeOptions: { type: OrderType; icon: typeof Truck; label: string; desc: string }[] = [
  { type: "Delivery", icon: Truck, label: "Delivery", desc: "Delivered to your doorstep" },
  { type: "Pickup", icon: Store, label: "Pickup", desc: "Pick up from our store" },
  { type: "Dine-in", icon: UtensilsCrossed, label: "Dine-in", desc: "Eat at our restaurant" },
];

const CheckoutPage = () => {
  const { items, subtotal, deliveryFee, total, clearCart, orderType, setOrderType } = useCart();
  const { addOrder } = useOrders();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [form, setForm] = useState({ name: "", phone: "", address: "", notes: "" });
  const [paymentMethod, setPaymentMethod] = useState<"Cashfree" | "Cash On Delivery">("Cash On Delivery");
  const [isProcessing, setIsProcessing] = useState(false);
  const needsAddress = orderType === "Delivery";

  const { isShopOpen: shopOpen } = useShopStatus();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopOpen) { toast({ title: "We're closed right now", description: "We're not accepting orders right now.", variant: "destructive" }); return; }
    if (!form.name.trim() || !form.phone.trim()) { toast({ title: "Please fill name and phone number", variant: "destructive" }); return; }
    if (needsAddress && !form.address.trim()) { toast({ title: "Please fill delivery address", variant: "destructive" }); return; }
    if (items.length === 0) { toast({ title: "Your cart is empty", variant: "destructive" }); return; }

    const orderId = addOrder({
      items, customerName: form.name.trim(), phone: form.phone.trim(),
      address: needsAddress ? form.address.trim() : `${orderType} - No address needed`,
      notes: form.notes.trim(), paymentMethod, orderType, subtotal, deliveryFee, total,
    });

    if (paymentMethod === "Cashfree") {
      setIsProcessing(true);
      try {
        const returnUrl = `${window.location.origin}/payment-status?order_id=${orderId}`;
        const { data, error } = await supabase.functions.invoke("cashfree-create-order", {
          body: { orderId, orderAmount: total, customerName: form.name.trim(), customerPhone: form.phone.trim(), returnUrl },
        });
        if (error || !data?.paymentSessionId) throw new Error(error?.message || "Failed to create payment session");
        clearCart();
        const cashfree = (window as any).Cashfree({ mode: "production" });
        await cashfree.checkout({ paymentSessionId: data.paymentSessionId, redirectTarget: "_self" });
        return;
      } catch (err: any) {
        setIsProcessing(false);
        toast({ title: "Payment failed", description: err.message, variant: "destructive" });
        return;
      }
    }

    clearCart();
    toast({ title: "Order placed!", description: `Your order ID is ${orderId}` });
    navigate(`/track-order?id=${orderId}`);
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
              {orderTypeOptions.map((opt) => (
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
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow" placeholder="Your full name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Phone Number *</label>
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow" placeholder="Your phone number" />
            </div>
            {needsAddress && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Delivery Address *</label>
                <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} rows={3}
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
            {(["Cashfree", "Cash On Delivery"] as const).map((method) => (
              <div key={method}>
                <button type="button" onClick={() => method !== "Cashfree" && setPaymentMethod(method)}
                  disabled={method === "Cashfree"}
                  className={`w-full px-4 py-4 rounded-xl border-2 text-left font-medium transition-all ${
                    method === "Cashfree" ? "border-border text-muted-foreground opacity-60 cursor-not-allowed" :
                    paymentMethod === method ? "border-primary bg-primary/10 text-primary" : "border-border text-foreground hover:border-primary/30"
                  }`}>
                  {method === "Cashfree" ? "💳 Pay Online (UPI / Cards / Netbanking)" : "💵 Cash On Delivery"}
                </button>
                {method === "Cashfree" && (
                  <p className="text-xs text-destructive mt-1.5 ml-1">⚠️ Temporarily unavailable due to technical issues</p>
                )}
              </div>
            ))}
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
            {!shopOpen ? "🕐 Shop is Closed" : isProcessing ? (<><Loader2 className="w-5 h-5 animate-spin" />Processing...</>) : paymentMethod === "Cashfree" ? "Pay Now" : "Place Order"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
