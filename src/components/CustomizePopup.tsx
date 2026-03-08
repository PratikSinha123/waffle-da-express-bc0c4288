import { useState } from "react";
import { X, Plus, Minus } from "lucide-react";
import { MenuItem, addOns20, addOns30, AddOn } from "@/data/menuData";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";

interface CustomizePopupProps {
  item: MenuItem;
  onClose: () => void;
}

const CustomizePopup = ({ item, onClose }: CustomizePopupProps) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([]);
  const [selectedPrice, setSelectedPrice] = useState(item.price);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const toggleAddOn = (addOn: AddOn) => {
    setSelectedAddOns((prev) =>
      prev.find((a) => a.id === addOn.id)
        ? prev.filter((a) => a.id !== addOn.id)
        : [...prev, addOn]
    );
  };

  const addOnsTotal = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
  const totalPrice = (selectedPrice + addOnsTotal) * quantity;

  const handleAddToCart = () => {
    addToCart({
      id: "",
      menuItem: item,
      selectedAddOns,
      quantity,
      selectedPrice,
      selectedPriceLabel: item.price2
        ? selectedPrice === item.price
          ? item.priceLabel
          : item.priceLabel2
        : undefined,
    });
    toast({
      title: "Added to cart!",
      description: `${quantity}x ${item.name} added to your cart`,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4" onClick={onClose}>
      <div
        className="bg-gradient-to-b from-card to-secondary w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col shadow-[0_-10px_60px_-15px_rgba(0,0,0,0.2)] border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative flex items-center justify-between p-6 border-b border-border">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1.5 rounded-full bg-muted mt-2 sm:hidden" />
          <div>
            <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>{item.name}</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Base price: ₹{item.price}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-secondary hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4 text-foreground" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Size selector for items with 2 prices */}
          {item.price2 && (
            <div>
              <h3 className="font-semibold text-foreground mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Select Size</h3>
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedPrice(item.price)}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium border-2 transition-all ${
                    selectedPrice === item.price
                      ? "border-accent bg-accent/10 text-accent shadow-sm"
                      : "border-border text-muted-foreground hover:border-accent/40"
                  }`}
                >
                  {item.priceLabel} - ₹{item.price}
                </button>
                <button
                  onClick={() => setSelectedPrice(item.price2!)}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium border-2 transition-all ${
                    selectedPrice === item.price2
                      ? "border-accent bg-accent/10 text-accent shadow-sm"
                      : "border-border text-muted-foreground hover:border-accent/40"
                  }`}
                >
                  {item.priceLabel2} - ₹{item.price2}
                </button>
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <h3 className="font-semibold text-foreground mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Quantity</h3>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-11 h-11 rounded-full border-2 border-border flex items-center justify-center hover:bg-secondary transition-colors"
              >
                <Minus className="w-4 h-4 text-muted-foreground" />
              </button>
              <span className="text-xl font-bold w-8 text-center text-foreground">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-11 h-11 rounded-full bg-accent text-accent-foreground flex items-center justify-center hover:opacity-90 transition-opacity shadow-md"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Add-ons - Only for Waffles, Waffle Cakes, and Sweet Dish */}
          {["Waffles", "Waffle Cakes", "Sweet Dish"].includes(item.category) && (
            <>
              {/* ₹20 Add-ons */}
              <div>
                <h3 className="font-semibold text-foreground mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Add-ons <span className="text-accent font-normal">@ ₹20</span>
                </h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {addOns20.map((addOn) => {
                    const isSelected = selectedAddOns.find((a) => a.id === addOn.id);
                    return (
                      <button
                        key={addOn.id}
                        onClick={() => toggleAddOn(addOn)}
                        className={`px-4 py-3 rounded-xl text-sm font-medium border-2 transition-all text-left ${
                          isSelected
                            ? "border-accent bg-accent/10 text-accent shadow-sm"
                            : "border-border text-foreground hover:border-accent/40 hover:bg-secondary"
                        }`}
                      >
                        {addOn.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ₹30 Add-ons */}
              <div>
                <h3 className="font-semibold text-foreground mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Add-ons <span className="text-accent font-normal">@ ₹30</span>
                </h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {addOns30.map((addOn) => {
                    const isSelected = selectedAddOns.find((a) => a.id === addOn.id);
                    return (
                      <button
                        key={addOn.id}
                        onClick={() => toggleAddOn(addOn)}
                        className={`px-4 py-3 rounded-xl text-sm font-medium border-2 transition-all text-left ${
                          isSelected
                            ? "border-accent bg-accent/10 text-accent shadow-sm"
                            : "border-border text-foreground hover:border-accent/40 hover:bg-secondary"
                        }`}
                      >
                        {addOn.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[hsl(30,30%,88%)] bg-[hsl(35,35%,97%)]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-muted-foreground font-medium">Total</span>
            <span className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>₹{totalPrice}</span>
          </div>
          <button
            onClick={handleAddToCart}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[hsl(var(--waffle-amber))] via-[hsl(var(--waffle-gold))] to-[hsl(var(--waffle-honey))] text-white font-semibold text-lg hover:opacity-95 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomizePopup;
