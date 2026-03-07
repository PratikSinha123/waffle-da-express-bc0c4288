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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4">
      <div className="bg-card w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div>
            <h2 className="text-xl font-bold text-foreground">{item.name}</h2>
            <p className="text-sm text-muted-foreground">Base price: ₹{item.price}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Size selector for items with 2 prices */}
          {item.price2 && (
            <div>
              <h3 className="font-semibold text-foreground mb-3">Select Size</h3>
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedPrice(item.price)}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium border-2 transition-all ${
                    selectedPrice === item.price
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {item.priceLabel} - ₹{item.price}
                </button>
                <button
                  onClick={() => setSelectedPrice(item.price2!)}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium border-2 transition-all ${
                    selectedPrice === item.price2
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {item.priceLabel2} - ₹{item.price2}
                </button>
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Quantity</h3>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-full border-2 border-border flex items-center justify-center hover:bg-secondary transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-xl font-bold w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-full border-2 border-primary bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity"
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
                <h3 className="font-semibold text-foreground mb-3">Add-ons @ ₹20</h3>
                <div className="grid grid-cols-2 gap-2">
                  {addOns20.map((addOn) => {
                    const isSelected = selectedAddOns.find((a) => a.id === addOn.id);
                    return (
                      <button
                        key={addOn.id}
                        onClick={() => toggleAddOn(addOn)}
                        className={`px-3 py-2.5 rounded-xl text-sm font-medium border-2 transition-all text-left ${
                          isSelected
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border text-foreground hover:border-primary/30"
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
                <h3 className="font-semibold text-foreground mb-3">Add-ons @ ₹30</h3>
                <div className="grid grid-cols-2 gap-2">
                  {addOns30.map((addOn) => {
                    const isSelected = selectedAddOns.find((a) => a.id === addOn.id);
                    return (
                      <button
                        key={addOn.id}
                        onClick={() => toggleAddOn(addOn)}
                        className={`px-3 py-2.5 rounded-xl text-sm font-medium border-2 transition-all text-left ${
                          isSelected
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border text-foreground hover:border-primary/30"
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
        <div className="p-5 border-t border-border">
          <div className="flex items-center justify-between mb-3">
            <span className="text-muted-foreground">Total</span>
            <span className="text-2xl font-bold text-foreground">₹{totalPrice}</span>
          </div>
          <button
            onClick={handleAddToCart}
            className="w-full py-4 rounded-2xl waffle-gradient text-primary-foreground font-semibold text-lg hover:opacity-95 transition-opacity"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomizePopup;
