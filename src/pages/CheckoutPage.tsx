import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useOrders } from "@/context/OrderContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const CheckoutPage = () => {
  const { items, subtotal, deliveryFee, total, clearCart } = useCart();
  const { addOrder } = useOrders();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"Paytm" | "Cash On Delivery">("Cash On Delivery");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }

    if (items.length === 0) {
      toast({ title: "Your cart is empty", variant: "destructive" });
      return;
    }

    const orderId = addOrder({
      items,
      customerName: form.name.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      notes: form.notes.trim(),
      paymentMethod,
      subtotal,
      deliveryFee,
      total,
    });

    clearCart();
    toast({ title: "Order placed!", description: `Your order ID is ${orderId}` });
    navigate(`/track-order?id=${orderId}`);
  };

  return (
    <div className="min-h-screen max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-foreground mb-6">Checkout</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="waffle-card space-y-4">
          <h2 className="font-semibold text-foreground text-lg">Delivery Details</h2>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Phone Number *</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="Your phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Delivery Address *</label>
            <textarea
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              placeholder="Full delivery address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Order Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={2}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              placeholder="Any special instructions..."
            />
          </div>
        </div>

        {/* Payment */}
        <div className="waffle-card space-y-4">
          <h2 className="font-semibold text-foreground text-lg">Payment Method</h2>
          {(["Paytm", "Cash On Delivery"] as const).map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => setPaymentMethod(method)}
              className={`w-full px-4 py-4 rounded-xl border-2 text-left font-medium transition-all ${
                paymentMethod === method
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-foreground hover:border-primary/30"
              }`}
            >
              {method === "Paytm" ? "💳 Paytm Payment Gateway" : "💵 Cash On Delivery"}
            </button>
          ))}
        </div>

        {/* Order summary */}
        <div className="waffle-card space-y-3">
          <h2 className="font-semibold text-foreground text-lg">Order Summary</h2>
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal ({items.length} items)</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Delivery Fee</span>
            <span>₹{deliveryFee}</span>
          </div>
          <div className="border-t border-border pt-3 flex justify-between text-lg font-bold text-foreground">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 rounded-2xl waffle-gradient text-primary-foreground font-semibold text-lg hover:opacity-95 transition-opacity"
        >
          Place Order
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;
