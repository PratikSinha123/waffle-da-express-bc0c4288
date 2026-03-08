import { useCart } from "@/context/CartContext";
import { Link } from "react-router-dom";
import { Plus, Minus, Trash2, ShoppingBag, Truck, Store, UtensilsCrossed } from "lucide-react";
import { OrderType } from "@/context/OrderContext";

const orderTypeOptions: { type: OrderType; icon: typeof Truck; label: string }[] = [
  { type: "Delivery", icon: Truck, label: "Delivery" },
  { type: "Pickup", icon: Store, label: "Pickup" },
  { type: "Dine-in", icon: UtensilsCrossed, label: "Dine-in" },
];

const CartPage = () => {
  const { items, updateQuantity, removeFromCart, subtotal, deliveryFee, total, orderType, setOrderType } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-pattern-dots">
        <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">Add some delicious items from our menu</p>
        <Link to="/menu" className="px-6 py-3 rounded-2xl waffle-gradient-warm text-primary-foreground font-semibold glow-accent hover:scale-[1.02] transition-transform">
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pattern-dots">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="page-header">
          <h1 className="text-3xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
            Your <span className="text-gradient italic">Cart</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{items.length} item{items.length > 1 ? 's' : ''} in your cart</p>
        </div>

        <div className="space-y-4 mb-8">
          {items.map((item) => {
            const addOnsTotal = item.selectedAddOns.reduce((s, a) => s + a.price, 0);
            const itemTotal = (item.selectedPrice + addOnsTotal) * item.quantity;
            return (
              <div key={item.id} className="waffle-card-elevated">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-foreground">{item.menuItem.name}</h3>
                    {item.selectedPriceLabel && <span className="text-xs text-muted-foreground">({item.selectedPriceLabel})</span>}
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="p-1.5 rounded-full hover:bg-destructive/10 text-destructive transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {item.selectedAddOns.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.selectedAddOns.map((ao) => (
                      <span key={ao.id} className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">{ao.name} (+₹{ao.price})</span>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-semibold w-6 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 rounded-full waffle-gradient text-primary-foreground flex items-center justify-center hover:opacity-90">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="font-bold text-foreground text-lg">₹{itemTotal}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order type */}
        <div className="waffle-card-elevated mb-4">
          <h3 className="font-semibold text-foreground mb-3">Order Type</h3>
          <div className="flex gap-2">
            {orderTypeOptions.map((opt) => (
              <button key={opt.type} onClick={() => setOrderType(opt.type)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                  orderType === opt.type ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/30"
                }`}>
                <opt.icon className="w-4 h-4" />{opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="waffle-card-elevated space-y-3 mb-6">
          <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>₹{subtotal}</span></div>
          <div className="flex justify-between text-muted-foreground">
            <span>Delivery Fee</span>
            {orderType === "Delivery" ? <span>₹{deliveryFee}</span> : <span className="text-green-600 font-medium">FREE</span>}
          </div>
          <div className="section-divider" />
          <div className="flex justify-between text-lg font-bold text-foreground pt-1"><span>Total</span><span>₹{total}</span></div>
        </div>

        <Link to="/checkout" className="block w-full text-center py-4 rounded-2xl waffle-gradient-warm text-primary-foreground font-semibold text-lg hover:opacity-95 transition-all glow-accent hover:scale-[1.01]">
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
};

export default CartPage;
