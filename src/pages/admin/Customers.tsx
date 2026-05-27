import React, { useState } from "react";
import { useOrders } from "@/context/OrderContext";
import { Search, Phone, User, ShoppingBag, TrendingUp, Calendar } from "lucide-react";

const Customers: React.FC = () => {
  const { orders } = useOrders();
  const [searchQuery, setSearchQuery] = useState("");

  // Derive unique customers from orders
  const customerMap = orders.reduce((acc, order) => {
    const phone = order.phone;
    if (!acc[phone]) {
      acc[phone] = {
        name: order.customerName,
        phone: phone,
        totalOrders: 0,
        totalSpent: 0,
        lastOrder: order.createdAt,
        orders: [] as any[]
      };
    }
    acc[phone].totalOrders += 1;
    acc[phone].totalSpent += order.total;
    if (new Date(order.createdAt) > new Date(acc[phone].lastOrder)) {
      acc[phone].lastOrder = order.createdAt;
      acc[phone].name = order.customerName; // Keep latest name
    }
    acc[phone].orders.push(order);
    return acc;
  }, {} as Record<string, any>);

  const customers = Object.values(customerMap).sort((a, b) => b.totalSpent - a.totalSpent);

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search customers by name or phone..."
          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-card border border-border focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer, i) => (
          <div key={i} className="waffle-card p-6 hover:border-primary/50 transition-all group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl group-hover:scale-110 transition-transform">
                {customer.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="font-bold text-lg truncate w-40">{customer.name}</h4>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                  <Phone className="w-3 h-3" />
                  {customer.phone}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Orders</p>
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-blue-500" />
                  <span className="font-bold">{customer.totalOrders}</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Spent</p>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="font-bold text-primary">₹{customer.totalSpent}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground">
                <Calendar className="w-3 h-3" />
                LAST ORDER: {new Date(customer.lastOrder).toLocaleDateString()}
              </div>
              <button className="text-[10px] font-black text-primary hover:underline uppercase tracking-tighter">
                View History
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Customers;
