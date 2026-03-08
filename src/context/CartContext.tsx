import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { MenuItem, AddOn } from "@/data/menuData";
import { OrderType } from "./OrderContext";
import { supabase } from "@/integrations/supabase/client";

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  selectedAddOns: AddOn[];
  quantity: number;
  selectedPrice: number;
  selectedPriceLabel?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  orderType: OrderType;
  setOrderType: (type: OrderType) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const DEFAULT_DELIVERY_FEE = 40;

export const getDeliveryFeeAmount = async (): Promise<number> => {
  try {
    const { data } = await supabase
      .from("settings" as any)
      .select("value")
      .eq("key", "delivery_fee")
      .single();
    if (data && (data as any).value) return Number((data as any).value);
  } catch {}
  return DEFAULT_DELIVERY_FEE;
};

export const setDeliveryFeeAmount = async (fee: number) => {
  await supabase
    .from("settings" as any)
    .update({ value: String(fee), updated_at: new Date().toISOString() } as any)
    .eq("key", "delivery_fee");
  window.dispatchEvent(new Event("delivery-fee-change"));
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [orderType, setOrderType] = useState<OrderType>("Delivery");
  const [deliveryFeeRate, setDeliveryFeeRate] = useState(DEFAULT_DELIVERY_FEE);

  useEffect(() => {
    getDeliveryFeeAmount().then(setDeliveryFeeRate);
    const handler = () => { getDeliveryFeeAmount().then(setDeliveryFeeRate); };
    window.addEventListener("delivery-fee-change", handler);
    return () => window.removeEventListener("delivery-fee-change", handler);
  }, []);

  const addToCart = useCallback((item: CartItem) => {
    setItems((prev) => [...prev, { ...item, id: `${item.menuItem.id}-${Date.now()}` }]);
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.id !== id));
      return;
    }
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => {
    const addOnsTotal = item.selectedAddOns.reduce((a, ao) => a + ao.price, 0);
    return sum + (item.selectedPrice + addOnsTotal) * item.quantity;
  }, 0);
  const deliveryFee = orderType === "Delivery" && subtotal > 0 ? deliveryFeeRate : 0;
  const total = subtotal + deliveryFee;

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, subtotal, deliveryFee, total, orderType, setOrderType }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
