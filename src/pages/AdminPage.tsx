import { useState } from "react";
import { useOrders, OrderStatus } from "@/context/OrderContext";
import { useMenu } from "@/context/MenuContext";
import { useToast } from "@/hooks/use-toast";
import { Download, Search, Plus, Pencil, Trash2, LogIn, LogOut, ChevronDown } from "lucide-react";
import { MenuItem } from "@/data/menuData";

const ADMIN_PASSWORD = "waffle123";

const AdminPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<"orders" | "menu">("orders");
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      toast({ title: "Welcome, Admin!" });
    } else {
      toast({ title: "Wrong password", variant: "destructive" });
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <form onSubmit={handleLogin} className="waffle-card max-w-sm w-full p-8 space-y-4">
          <h1 className="text-2xl font-bold text-foreground text-center">Admin Login</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button type="submit" className="w-full py-3 rounded-xl waffle-gradient text-primary-foreground font-semibold">
            <LogIn className="w-4 h-4 inline mr-2" /> Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
        <button onClick={() => setIsLoggedIn(false)} className="px-4 py-2 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-secondary">
          <LogOut className="w-4 h-4 inline mr-1" /> Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(["orders", "menu"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
              activeTab === tab ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
            }`}
          >
            {tab === "orders" ? "Orders" : "Menu Management"}
          </button>
        ))}
      </div>

      {activeTab === "orders" ? <OrdersPanel /> : <MenuPanel />}
    </div>
  );
};

const OrdersPanel = () => {
  const { orders, updateOrderStatus } = useOrders();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const filteredOrders = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.phone.includes(searchQuery)
  );

  const downloadCSV = () => {
    const headers = ["Order ID", "Customer Name", "Phone Number", "Address", "Items Ordered", "Add-ons", "Total Price", "Payment Method", "Order Status", "Order Date"];
    const rows = orders.map((o) => [
      o.id,
      o.customerName,
      o.phone,
      o.address,
      o.items.map((i) => `${i.quantity}x ${i.menuItem.name}`).join("; "),
      o.items.map((i) => i.selectedAddOns.map((a) => a.name).join(", ")).filter(Boolean).join("; "),
      o.total,
      o.paymentMethod,
      o.status,
      new Date(o.createdAt).toLocaleString(),
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `waffle-da-orders-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const statuses: OrderStatus[] = ["Order Received", "Preparing", "Out for Delivery", "Delivered"];

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search orders..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <button onClick={downloadCSV} className="px-5 py-3 rounded-xl waffle-gradient text-primary-foreground font-medium flex items-center gap-2 whitespace-nowrap">
          <Download className="w-4 h-4" /> Download CSV
        </button>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="waffle-card text-center py-12">
          <p className="text-muted-foreground">No orders found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <div key={order.id} className="waffle-card">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
              >
                <div>
                  <span className="font-semibold text-foreground">{order.id}</span>
                  <span className="text-sm text-muted-foreground ml-3">{order.customerName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-primary">₹{order.total}</span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    order.status === "Delivered" ? "bg-green-100 text-green-700" :
                    order.status === "Out for Delivery" ? "bg-blue-100 text-blue-700" :
                    order.status === "Preparing" ? "bg-yellow-100 text-yellow-700" :
                    "bg-secondary text-secondary-foreground"
                  }`}>
                    {order.status}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${expandedOrder === order.id ? "rotate-180" : ""}`} />
                </div>
              </div>

              {expandedOrder === order.id && (
                <div className="mt-4 pt-4 border-t border-border space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="text-muted-foreground">Phone:</span> <span className="text-foreground">{order.phone}</span></div>
                    <div><span className="text-muted-foreground">Payment:</span> <span className="text-foreground">{order.paymentMethod}</span></div>
                    <div className="col-span-2"><span className="text-muted-foreground">Address:</span> <span className="text-foreground">{order.address}</span></div>
                    {order.notes && <div className="col-span-2"><span className="text-muted-foreground">Notes:</span> <span className="text-foreground">{order.notes}</span></div>}
                    <div className="col-span-2"><span className="text-muted-foreground">Date:</span> <span className="text-foreground">{new Date(order.createdAt).toLocaleString()}</span></div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">Items:</p>
                    {order.items.map((item, i) => (
                      <div key={i} className="text-sm text-muted-foreground">
                        {item.quantity}x {item.menuItem.name}
                        {item.selectedAddOns.length > 0 && (
                          <span> (+{item.selectedAddOns.map((a) => a.name).join(", ")})</span>
                        )}
                      </div>
                    ))}
                  </div>

                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">Update Status:</p>
                    <div className="flex flex-wrap gap-2">
                      {statuses.map((status) => (
                        <button
                          key={status}
                          onClick={() => updateOrderStatus(order.id, status)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                            order.status === status
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border text-muted-foreground hover:border-primary/30"
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const MenuPanel = () => {
  const { menuItems, categories, addMenuItem, updateMenuItem, deleteMenuItem, addCategory } = useMenu();
  const { toast } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState("");
  const [form, setForm] = useState<Omit<MenuItem, "id">>({
    name: "",
    description: "",
    price: 0,
    category: categories[1] || "",
    isVeg: true,
  });

  const handleAdd = () => {
    if (!form.name.trim() || !form.category) {
      toast({ title: "Name and category are required", variant: "destructive" });
      return;
    }
    addMenuItem(form);
    setForm({ name: "", description: "", price: 0, category: categories[1] || "", isVeg: true });
    setShowAddForm(false);
    toast({ title: "Item added!" });
  };

  const handleUpdate = (id: string) => {
    updateMenuItem(id, form);
    setEditingId(null);
    toast({ title: "Item updated!" });
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      addCategory(newCategory.trim());
      setNewCategory("");
      toast({ title: "Category added!" });
    }
  };

  const startEdit = (item: MenuItem) => {
    setEditingId(item.id);
    setForm({ name: item.name, description: item.description, price: item.price, category: item.category, isVeg: item.isVeg });
  };

  return (
    <div className="space-y-6">
      {/* Add category */}
      <div className="waffle-card p-4">
        <h3 className="font-semibold text-foreground mb-3">Add New Category</h3>
        <div className="flex gap-3">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Category name"
            className="flex-1 px-4 py-2 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button onClick={handleAddCategory} className="px-4 py-2 rounded-xl waffle-gradient text-primary-foreground font-medium">
            Add
          </button>
        </div>
      </div>

      {/* Add item */}
      <div className="waffle-card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground">Menu Items ({menuItems.length})</h3>
          <button onClick={() => { setShowAddForm(!showAddForm); setEditingId(null); }} className="px-4 py-2 rounded-xl waffle-gradient text-primary-foreground font-medium text-sm flex items-center gap-1">
            <Plus className="w-4 h-4" /> Add Item
          </button>
        </div>

        {showAddForm && (
          <div className="p-4 rounded-xl bg-secondary/50 mb-4 space-y-3">
            <input type="text" placeholder="Item name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none" />
            <input type="text" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none" />
            <div className="flex gap-3">
              <input type="number" placeholder="Price" value={form.price || ""} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                className="flex-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none" />
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="flex-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none">
                {categories.filter((c) => c !== "All").map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" checked={form.isVeg} onChange={(e) => setForm({ ...form, isVeg: e.target.checked })} className="rounded" />
              Vegetarian
            </label>
            <button onClick={handleAdd} className="px-4 py-2 rounded-xl waffle-gradient text-primary-foreground font-medium text-sm">
              Add to Menu
            </button>
          </div>
        )}

        {/* Menu items list */}
        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
          {menuItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-background border border-border">
              {editingId === item.id ? (
                <div className="flex-1 space-y-2 mr-3">
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-card border border-border text-foreground text-sm focus:outline-none" />
                  <div className="flex gap-2">
                    <input type="number" value={form.price || ""} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                      className="w-24 px-3 py-1.5 rounded-lg bg-card border border-border text-foreground text-sm focus:outline-none" />
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-card border border-border text-foreground text-sm focus:outline-none">
                      {categories.filter((c) => c !== "All").map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleUpdate(item.id)} className="px-3 py-1 rounded-lg bg-primary text-primary-foreground text-xs font-medium">Save</button>
                    <button onClick={() => setEditingId(null)} className="px-3 py-1 rounded-lg bg-secondary text-secondary-foreground text-xs font-medium">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-sm border ${item.isVeg ? "border-green-600" : "border-red-600"}`}>
                        <span className={`block w-1.5 h-1.5 rounded-full m-[2px] ${item.isVeg ? "bg-green-600" : "bg-red-600"}`} />
                      </span>
                      <span className="text-sm font-medium text-foreground truncate">{item.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{item.category} • ₹{item.price}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => startEdit(item)} className="p-1.5 rounded-lg hover:bg-secondary">
                      <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                    <button onClick={() => { deleteMenuItem(item.id); toast({ title: "Item deleted" }); }} className="p-1.5 rounded-lg hover:bg-destructive/10">
                      <Trash2 className="w-3.5 h-3.5 text-destructive" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
