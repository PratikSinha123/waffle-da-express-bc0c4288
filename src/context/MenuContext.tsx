import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { MenuItem, categories as defaultCategories } from "@/data/menuData";
import { supabase } from "@/integrations/supabase/client";

interface MenuContextType {
  menuItems: MenuItem[];
  categories: string[];
  addMenuItem: (item: Omit<MenuItem, "id">) => void;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  addCategory: (category: string) => void;
  loading: boolean;
  refetchMenu: () => Promise<void>;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

const mapDbToMenuItem = (row: any): MenuItem => ({
  id: row.id,
  name: row.name,
  description: row.description,
  price: Number(row.price),
  price2: row.price2 ? Number(row.price2) : undefined,
  priceLabel: row.price_label || undefined,
  priceLabel2: row.price_label2 || undefined,
  category: row.category,
  isVeg: row.is_veg,
  available: row.available,
});

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>(defaultCategories);
  const [loading, setLoading] = useState(true);

  const fetchMenu = useCallback(async () => {
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .order("sort_order", { ascending: true });

    if (data && !error) {
      setMenuItems(data.map(mapDbToMenuItem));
      // Extract unique categories from DB items
      const dbCategories = Array.from(new Set(data.map((r: any) => r.category)));
      const merged = ["All", ...dbCategories.filter((c: string) => c !== "All")];
      setCategories(merged);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  const addMenuItem = async (item: Omit<MenuItem, "id">) => {
    const id = `custom-${Date.now()}`;
    // Get max sort_order
    const maxSort = menuItems.length > 0 ? Math.max(...menuItems.map((_, i) => i)) + 1 : 0;
    
    const newItem: MenuItem = { ...item, id };
    setMenuItems((prev) => [...prev, newItem]);

    await supabase.from("menu_items").insert({
      id,
      name: item.name,
      description: item.description,
      price: item.price,
      price2: item.price2 || null,
      price_label: item.priceLabel || null,
      price_label2: item.priceLabel2 || null,
      category: item.category,
      is_veg: item.isVeg,
      available: item.available !== false,
      sort_order: maxSort + 1,
    });
  };

  const updateMenuItem = async (id: string, updates: Partial<MenuItem>) => {
    setMenuItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));

    const dbUpdates: any = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.price !== undefined) dbUpdates.price = updates.price;
    if (updates.price2 !== undefined) dbUpdates.price2 = updates.price2;
    if (updates.priceLabel !== undefined) dbUpdates.price_label = updates.priceLabel;
    if (updates.priceLabel2 !== undefined) dbUpdates.price_label2 = updates.priceLabel2;
    if (updates.category !== undefined) dbUpdates.category = updates.category;
    if (updates.isVeg !== undefined) dbUpdates.is_veg = updates.isVeg;
    if (updates.available !== undefined) dbUpdates.available = updates.available;

    if (Object.keys(dbUpdates).length > 0) {
      await supabase.from("menu_items").update(dbUpdates).eq("id", id);
    }
  };

  const deleteMenuItem = async (id: string) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
    await supabase.from("menu_items").delete().eq("id", id);
  };

  const addCategory = (category: string) => {
    if (!categories.includes(category)) {
      setCategories((prev) => [...prev, category]);
    }
  };

  return (
    <MenuContext.Provider value={{ menuItems, categories, addMenuItem, updateMenuItem, deleteMenuItem, addCategory, loading, refetchMenu: fetchMenu }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) throw new Error("useMenu must be used within MenuProvider");
  return context;
};
