import React, { createContext, useContext, useState, useCallback } from "react";
import { MenuItem, AddOn } from "@/data/menuData";
import { OrderType } from "./OrderContext";

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

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [orderType, setOrderType] = useState<OrderType>("Delivery");

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
  const deliveryFee = orderType === "Delivery" && subtotal > 0 ? 40 : 0;
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
