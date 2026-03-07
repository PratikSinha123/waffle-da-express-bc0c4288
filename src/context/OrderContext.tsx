import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { CartItem } from "./CartContext";
import { supabase } from "@/integrations/supabase/client";

export type OrderStatus = "Order Received" | "Preparing" | "Out for Delivery" | "Delivered";
export type OrderType = "Delivery" | "Pickup" | "Dine-in";

export interface Order {
  id: string;
  items: CartItem[];
  customerName: string;
  phone: string;
  address: string;
  notes: string;
  paymentMethod: "Cashfree" | "Cash On Delivery";
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
  loading: boolean;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

// Helper: DB row → Order
const rowToOrder = (row: any): Order => ({
  id: row.id,
  items: row.items || [],
  customerName: row.customer_name,
  phone: row.phone,
  address: row.address || "",
  notes: row.notes || "",
  paymentMethod: row.payment_method,
  orderType: row.order_type,
  status: row.status,
  subtotal: Number(row.subtotal),
  deliveryFee: Number(row.delivery_fee),
  total: Number(row.total),
  createdAt: row.created_at,
  seen: row.seen ?? false,
});

// Helper: DB row → Offer
const rowToOffer = (row: any): Offer => ({
  id: row.id,
  title: row.title,
  description: row.description || "",
  discountPercent: row.discount_percent ? Number(row.discount_percent) : undefined,
  discountFlat: row.discount_flat ? Number(row.discount_flat) : undefined,
  code: row.code,
  isActive: row.is_active,
  validUntil: row.valid_until || "",
});

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const prevOrderCountRef = useRef(0);

  // Fetch initial data
  useEffect(() => {
    const fetchAll = async () => {
      const [ordersRes, offersRes] = await Promise.all([
        supabase.from("orders").select("*").order("created_at", { ascending: false }),
        supabase.from("offers").select("*").order("created_at", { ascending: false }),
      ]);
      if (ordersRes.data) setOrders(ordersRes.data.map(rowToOrder));
      if (offersRes.data) setOffers(offersRes.data.map(rowToOffer));
      prevOrderCountRef.current = ordersRes.data?.length ?? 0;
      setLoading(false);
    };
    fetchAll();
  }, []);

  // Realtime subscription for orders
  useEffect(() => {
    const channel = supabase
      .channel("orders-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, (payload) => {
        if (payload.eventType === "INSERT") {
          const newOrder = rowToOrder(payload.new);
          setOrders((prev) => {
            if (prev.find((o) => o.id === newOrder.id)) return prev;
            return [newOrder, ...prev];
          });
          // Play notification sound
          try {
            const audio = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdW+Jj4yKg3xzb3N8hoyQjomDfHRwc3yEjJCOiIN8dHBzfISMkI6Ig3x0cHN8hIyQjoiDfHRwc3yEjJCOiIN8dHBzfA==");
            audio.volume = 0.3;
            audio.play().catch(() => {});
          } catch {}
        } else if (payload.eventType === "UPDATE") {
          const updated = rowToOrder(payload.new);
          setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
        } else if (payload.eventType === "DELETE") {
          const deletedId = (payload.old as any).id;
          setOrders((prev) => prev.filter((o) => o.id !== deletedId));
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // Realtime subscription for offers
  useEffect(() => {
    const channel = supabase
      .channel("offers-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "offers" }, (payload) => {
        if (payload.eventType === "INSERT") {
          const newOffer = rowToOffer(payload.new);
          setOffers((prev) => {
            if (prev.find((o) => o.id === newOffer.id)) return prev;
            return [newOffer, ...prev];
          });
        } else if (payload.eventType === "UPDATE") {
          const updated = rowToOffer(payload.new);
          setOffers((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
        } else if (payload.eventType === "DELETE") {
          const deletedId = (payload.old as any).id;
          setOffers((prev) => prev.filter((o) => o.id !== deletedId));
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const addOrder = (orderData: Omit<Order, "id" | "status" | "createdAt" | "seen">) => {
    const id = `WD-${Date.now().toString(36).toUpperCase()}`;
    const now = new Date().toISOString();

    // Insert into DB (async, realtime will update state)
    supabase.from("orders").insert({
      id,
      items: JSON.parse(JSON.stringify(orderData.items)),
      customer_name: orderData.customerName,
      phone: orderData.phone,
      address: orderData.address,
      notes: orderData.notes,
      payment_method: orderData.paymentMethod,
      order_type: orderData.orderType,
      status: "Order Received",
      subtotal: orderData.subtotal,
      delivery_fee: orderData.deliveryFee,
      total: orderData.total,
      seen: false,
      created_at: now,
    } as any).then(({ error }) => {
      if (error) console.error("Failed to insert order:", error);
    });

    // Optimistic update
    const order: Order = {
      ...orderData,
      id,
      status: "Order Received",
      createdAt: now,
      seen: false,
    };
    setOrders((prev) => [order, ...prev]);

    return id;
  };

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    // Optimistic
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    supabase.from("orders").update({ status } as any).eq("id", id).then(({ error }) => {
      if (error) console.error("Failed to update order status:", error);
    });
  };

  const deleteOrder = (id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
    supabase.from("orders").delete().eq("id", id).then(({ error }) => {
      if (error) console.error("Failed to delete order:", error);
    });
  };

  const getOrder = (id: string) => orders.find((o) => o.id === id);

  const getOrdersByPhone = (phone: string) =>
    orders.filter((o) => o.phone.replace(/\s+/g, "").includes(phone.replace(/\s+/g, "")));

  const unseenCount = orders.filter((o) => !o.seen).length;

  const markAllSeen = () => {
    setOrders((prev) => prev.map((o) => ({ ...o, seen: true })));
    // Update all unseen orders in DB
    const unseenIds = orders.filter((o) => !o.seen).map((o) => o.id);
    if (unseenIds.length > 0) {
      supabase.from("orders").update({ seen: true } as any).in("id", unseenIds).then(({ error }) => {
        if (error) console.error("Failed to mark orders as seen:", error);
      });
    }
  };

  // Offers
  const addOffer = (offerData: Omit<Offer, "id">) => {
    const id = `offer-${Date.now()}`;
    const newOffer: Offer = { ...offerData, id };
    setOffers((prev) => [newOffer, ...prev]);

    supabase.from("offers").insert({
      id,
      title: offerData.title,
      description: offerData.description,
      discount_percent: offerData.discountPercent ?? null,
      discount_flat: offerData.discountFlat ?? null,
      code: offerData.code,
      is_active: offerData.isActive,
      valid_until: offerData.validUntil,
    } as any).then(({ error }) => {
      if (error) console.error("Failed to insert offer:", error);
    });
  };

  const updateOffer = (id: string, updates: Partial<Offer>) => {
    setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, ...updates } : o)));

    const dbUpdates: any = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.discountPercent !== undefined) dbUpdates.discount_percent = updates.discountPercent;
    if (updates.discountFlat !== undefined) dbUpdates.discount_flat = updates.discountFlat;
    if (updates.code !== undefined) dbUpdates.code = updates.code;
    if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive;
    if (updates.validUntil !== undefined) dbUpdates.valid_until = updates.validUntil;

    supabase.from("offers").update(dbUpdates).eq("id", id).then(({ error }) => {
      if (error) console.error("Failed to update offer:", error);
    });
  };

  const deleteOffer = (id: string) => {
    setOffers((prev) => prev.filter((o) => o.id !== id));
    supabase.from("offers").delete().eq("id", id).then(({ error }) => {
      if (error) console.error("Failed to delete offer:", error);
    });
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus, deleteOrder, getOrder, getOrdersByPhone, unseenCount, markAllSeen, offers, addOffer, updateOffer, deleteOffer, loading }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error("useOrders must be used within OrderProvider");
  return context;
};
