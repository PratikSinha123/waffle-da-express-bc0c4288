import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { CartItem } from "./CartContext";

export type OrderStatus = "Order Received" | "Preparing" | "Out for Delivery" | "Delivered";
export type OrderType = "Delivery" | "Pickup" | "Dine-in";

export interface Order {
  id: string;
  items: CartItem[];
  customerName: string;
  phone: string;
  address: string;
  notes: string;
  paymentMethod: "Paytm" | "Cash On Delivery";
  orderType: OrderType;
  status: OrderStatus;
  subtotal: number;
  deliveryFee: number;
  total: number;
  createdAt: string;
  seen?: boolean;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  discountPercent?: number;
  discountFlat?: number;
  code: string;
  isActive: boolean;
  validUntil: string;
}

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, "id" | "status" | "createdAt" | "seen">) => string;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  deleteOrder: (id: string) => void;
  getOrder: (id: string) => Order | undefined;
  getOrdersByPhone: (phone: string) => Order[];
  unseenCount: number;
  markAllSeen: () => void;
  offers: Offer[];
  addOffer: (offer: Omit<Offer, "id">) => void;
  updateOffer: (id: string, updates: Partial<Offer>) => void;
  deleteOffer: (id: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem("waffle-da-orders");
    return saved ? JSON.parse(saved) : [];
  });

  const [offers, setOffers] = useState<Offer[]>(() => {
    const saved = localStorage.getItem("waffle-da-offers");
    return saved ? JSON.parse(saved) : [];
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("waffle-da-orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem("waffle-da-offers", JSON.stringify(offers));
  }, [offers]);

  // Cross-tab sync: listen for localStorage changes from other tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "waffle-da-orders" && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setOrders(parsed);
        } catch {}
      }
      if (e.key === "waffle-da-offers" && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setOffers(parsed);
        } catch {}
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Polling fallback: check localStorage every 2 seconds for any changes
  useEffect(() => {
    const interval = setInterval(() => {
      const savedOrders = localStorage.getItem("waffle-da-orders");
      if (savedOrders) {
        try {
          const parsed: Order[] = JSON.parse(savedOrders);
          // Deep compare using JSON string to catch status updates, deletions, etc.
          const currentStr = JSON.stringify(orders);
          const savedStr = JSON.stringify(parsed);
          if (currentStr !== savedStr) {
            setOrders(parsed);
          }
        } catch {}
      }
      const savedOffers = localStorage.getItem("waffle-da-offers");
      if (savedOffers) {
        try {
          const parsed: Offer[] = JSON.parse(savedOffers);
          const currentStr = JSON.stringify(offers);
          const savedStr = JSON.stringify(parsed);
          if (currentStr !== savedStr) {
            setOffers(parsed);
          }
        } catch {}
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [orders, offers]);

  const addOrder = (orderData: Omit<Order, "id" | "status" | "createdAt" | "seen">) => {
    const id = `WD-${Date.now().toString(36).toUpperCase()}`;
    const order: Order = {
      ...orderData,
      id,
      status: "Order Received",
      createdAt: new Date().toISOString(),
      seen: false,
    };
    setOrders((prev) => [order, ...prev]);

    // Play notification sound
    try {
      const audio = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdW+Jj4yKg3xzb3N8hoyQjomDfHRwc3yEjJCOiIN8dHBzfISMkI6Ig3x0cHN8hIyQjoiDfHRwc3yEjJCOiIN8dHBzfA==");
      audio.volume = 0.3;
      audio.play().catch(() => {});
    } catch {}

    return id;
  };

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  const deleteOrder = (id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
  };

  const getOrder = (id: string) => orders.find((o) => o.id === id);

  const getOrdersByPhone = (phone: string) => 
    orders.filter((o) => o.phone.replace(/\s+/g, "").includes(phone.replace(/\s+/g, "")));

  const unseenCount = orders.filter((o) => !o.seen).length;

  const markAllSeen = () => {
    setOrders((prev) => prev.map((o) => ({ ...o, seen: true })));
  };

  // Offers
  const addOffer = (offerData: Omit<Offer, "id">) => {
    const id = `offer-${Date.now()}`;
    setOffers((prev) => [...prev, { ...offerData, id }]);
  };

  const updateOffer = (id: string, updates: Partial<Offer>) => {
    setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, ...updates } : o)));
  };

  const deleteOffer = (id: string) => {
    setOffers((prev) => prev.filter((o) => o.id !== id));
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus, deleteOrder, getOrder, getOrdersByPhone, unseenCount, markAllSeen, offers, addOffer, updateOffer, deleteOffer }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error("useOrders must be used within OrderProvider");
  return context;
};
