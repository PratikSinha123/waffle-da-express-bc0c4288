import React from "react";
import { useOrders } from "@/context/OrderContext";
import { useMenu } from "@/context/MenuContext";
import {
  TrendingUp,
  ShoppingBag,
  Utensils,
  Users,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

const Dashboard: React.FC = () => {
  const { orders } = useOrders();
  const { menuItems } = useMenu();

  const totalRevenue = orders
    .filter(o => o.status === "Delivered")
    .reduce((sum, o) => sum + o.total, 0);

  const stats = [
    { label: "Total Revenue", value: `₹${totalRevenue}`, icon: TrendingUp, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Total Orders", value: orders.length.toString(), icon: ShoppingBag, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Menu Items", value: menuItems.length.toString(), icon: Utensils, color: "text-orange-500", bg: "bg-orange-500/10" },
    { label: "Customers", value: new Set(orders.map(o => o.phone)).size.toString(), icon: Users, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="waffle-card p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
            </div>
            <div className={`p-3 rounded-2xl ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="waffle-card p-6">
          <h3 className="font-bold text-lg mb-4">Recent Orders</h3>
          <div className="space-y-4">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary/30">
                <div>
                  <p className="font-semibold text-sm">{order.customerName}</p>
                  <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-primary">₹{order.total}</p>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">{order.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="waffle-card p-6">
          <h3 className="font-bold text-lg mb-4">Top Selling Categories</h3>
          <div className="space-y-4">
            {["Waffles", "Beverages", "Sides"].map((cat, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{cat}</span>
                  <span className="text-muted-foreground">{85 - i * 20}%</span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full waffle-gradient transition-all"
                    style={{ width: `${85 - i * 20}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
