import React, { useState } from "react";
import { useOrders } from "@/context/OrderContext";
import { useToast } from "@/hooks/use-toast";
import { Search, ChevronDown, Trash2, Bell, Phone, MapPin, Calendar, Clock, CreditCard, Banknote } from "lucide-react";
import { OrderStatus } from "@/context/OrderContext";

const Orders: React.FC = () => {
  const { orders, updateOrderStatus, deleteOrder } = useOrders();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const filteredOrders = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.phone.includes(searchQuery)
  );

  const statuses: OrderStatus[] = ["Order Received", "Preparing", "Out for Delivery", "Delivered", "Can't be Delivered"];

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by ID, name, or phone..."
          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-card border border-border focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
        />
      </div>

      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div key={order.id} className={`waffle-card overflow-hidden transition-all ${!order.seen ? "ring-2 ring-accent" : ""}`}>
            <div
              className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
              onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${!order.seen ? "bg-accent/10 text-accent" : "bg-secondary text-muted-foreground"}`}>
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-lg">{order.id}</h4>
                    {!order.seen && <span className="bg-accent text-white text-[10px] px-2 py-0.5 rounded-full uppercase font-bold animate-pulse">New</span>}
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">{order.customerName} • {order.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right hidden md:block mr-4">
                  <p className="text-sm font-bold text-primary">₹{order.total}</p>
                  <p className="text-xs text-muted-foreground italic">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                  order.status === "Delivered" ? "bg-green-500/10 text-green-500" :
                  order.status === "Preparing" ? "bg-yellow-500/10 text-yellow-500" :
                  order.status === "Order Received" ? "bg-blue-500/10 text-blue-500" :
                  "bg-secondary text-muted-foreground"
                }`}>
                  {order.status}
                </span>
                <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${expandedOrder === order.id ? "rotate-180" : ""}`} />
              </div>
            </div>

            {expandedOrder === order.id && (
              <div className="p-6 bg-secondary/10 border-t border-border space-y-6 animate-in slide-in-from-top-2 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Customer Details</h5>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <a href={`tel:${order.phone}`} className="hover:text-primary transition-colors">{order.phone}</a>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <span className="leading-tight">{order.address || "Store Pickup"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Order Summary</h5>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{new Date(order.createdAt).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-bold text-primary">
                        {order.paymentMethod === "Cashfree" ? <CreditCard className="w-4 h-4" /> : <Banknote className="w-4 h-4" />}
                        <span>{order.paymentMethod} • Paid</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Items</h5>
                    <div className="space-y-1">
                      {order.items.map((item, i) => (
                        <div key={i} className="text-sm">
                          <span className="font-bold">{item.quantity}x</span> {item.menuItem.name}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-2">
                    {statuses.map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          updateOrderStatus(order.id, status);
                          toast({ title: `Order set to ${status}` });
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                          order.status === status
                            ? "bg-primary border-primary text-primary-foreground shadow-md shadow-primary/20"
                            : "bg-background border-border text-muted-foreground hover:border-primary/50"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      if(window.confirm("Are you sure you want to delete this order?")) {
                        deleteOrder(order.id);
                        toast({ title: "Order deleted" });
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-destructive hover:bg-destructive/10 transition-all border border-transparent hover:border-destructive/20"
                  >
                    <Trash2 className="w-4 h-4" /> Delete Order
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const ShoppingBag: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
);

export default Orders;
