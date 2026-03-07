import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem } from "./CartContext";

export type OrderStatus = "Order Received" | "Preparing" | "Out for Delivery" | "Delivered";

export interface Order {
  id: string;
  items: CartItem[];
  customerName: string;
  phone: string;
  address: string;
  notes: string;
  paymentMethod: "Paytm" | "Cash On Delivery";
  status: OrderStatus;
  subtotal: number;
  deliveryFee: number;
  total: number;
  createdAt: string;
}

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, "id" | "status" | "createdAt">) => string;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  getOrder: (id: string) => Order | undefined;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem("waffle-da-orders");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("waffle-da-orders", JSON.stringify(orders));
  }, [orders]);

  const addOrder = (orderData: Omit<Order, "id" | "status" | "createdAt">) => {
    const id = `WD-${Date.now().toString(36).toUpperCase()}`;
    const order: Order = {
      ...orderData,
      id,
      status: "Order Received",
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => [order, ...prev]);
    return id;
  };

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  const getOrder = (id: string) => orders.find((o) => o.id === id);

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus, getOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error("useOrders must be used within OrderProvider");
  return context;
};
