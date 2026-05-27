import React, { useState } from "react";
import { useMenu } from "@/context/MenuContext";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, Pencil, Trash2, Tag, Utensils, Check, X } from "lucide-react";
import { MenuItem } from "@/data/menuData";

const Products: React.FC = () => {
  const { menuItems, categories, addMenuItem, updateMenuItem, deleteMenuItem } = useMenu();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState<Omit<MenuItem, "id">>({
    name: "",
    description: "",
    price: 0,
    category: categories[1] || "Waffles",
    isVeg: true,
    available: true
  });

  const filteredItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = () => {
    if (!form.name || !form.price) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }

    if (editingId) {
      updateMenuItem(editingId, form);
      setEditingId(null);
      toast({ title: "Product updated!" });
    } else {
      addMenuItem(form);
      setIsAdding(false);
      toast({ title: "Product added!" });
    }

    setForm({ name: "", description: "", price: 0, category: categories[1] || "Waffles", isVeg: true, available: true });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by name or category..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-card border border-border focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <button
          onClick={() => { setIsAdding(true); setEditingId(null); }}
          className="px-6 py-3 rounded-2xl waffle-gradient text-primary-foreground font-bold flex items-center gap-2 whitespace-nowrap shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
        >
          <Plus className="w-5 h-5" /> Add New Product
        </button>
      </div>

      {isAdding || editingId ? (
        <div className="waffle-card p-8 animate-in zoom-in-95 duration-200">
          <h3 className="text-xl font-bold mb-6">{editingId ? "Edit Product" : "Add New Product"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted-foreground ml-1">Product Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Classic Waffle"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted-foreground ml-1">Price (₹)</label>
              <input
                type="number"
                value={form.price || ""}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="150"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted-foreground ml-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 transition-all"
              >
                {categories.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-4 pt-8">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={form.isVeg}
                  onChange={(e) => setForm({ ...form, isVeg: e.target.checked })}
                  className="w-5 h-5 rounded border-border text-primary focus:ring-primary/20"
                />
                <span className="text-sm font-bold group-hover:text-primary transition-colors">Vegetarian Dish</span>
              </label>
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-semibold text-muted-foreground ml-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 transition-all h-24 resize-none"
                placeholder="Crispy on the outside, fluffy on the inside..."
              />
            </div>
          </div>
          <div className="mt-8 flex gap-3">
            <button
              onClick={handleSubmit}
              className="px-8 py-3 rounded-xl waffle-gradient text-primary-foreground font-bold flex items-center gap-2"
            >
              <Check className="w-5 h-5" /> {editingId ? "Update Product" : "Save Product"}
            </button>
            <button
              onClick={() => { setIsAdding(false); setEditingId(null); }}
              className="px-8 py-3 rounded-xl bg-secondary text-foreground font-bold flex items-center gap-2"
            >
              <X className="w-5 h-5" /> Cancel
            </button>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div key={item.id} className="waffle-card p-6 flex flex-col justify-between group hover:border-primary/50 transition-all">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${item.isVeg ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"}`}>
                  <Utensils className="w-6 h-6" />
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      setEditingId(item.id);
                      setForm({ ...item });
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="p-2 rounded-xl bg-secondary text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if(window.confirm(`Delete ${item.name}?`)) deleteMenuItem(item.id);
                    }}
                    className="p-2 rounded-xl bg-secondary text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-bold text-lg truncate">{item.name}</h4>
                <div className={`w-3 h-3 rounded-full ${item.isVeg ? "bg-green-500" : "bg-red-500"}`} />
              </div>
              <p className="text-xs font-bold text-primary bg-primary/10 inline-block px-2 py-0.5 rounded-full mb-3 italic">
                {item.category}
              </p>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4 h-10">
                {item.description || "No description provided."}
              </p>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <span className="text-xl font-black italic">₹{item.price}</span>
              <button
                onClick={() => updateMenuItem(item.id, { available: !item.available })}
                className={`text-[10px] font-bold px-3 py-1.5 rounded-full border transition-all ${
                  item.available !== false
                    ? "bg-green-500/10 text-green-600 border-green-500/20"
                    : "bg-destructive/10 text-destructive border-destructive/20"
                }`}
              >
                {item.available !== false ? "AVAILABLE" : "OUT OF STOCK"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
