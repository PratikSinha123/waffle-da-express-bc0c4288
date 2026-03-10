import React, { createContext, useContext, useState, useEffect } from "react";
import { MenuItem, defaultMenuItems, categories as defaultCategories } from "@/data/menuData";

interface MenuContextType {
  menuItems: MenuItem[];
  categories: string[];
  addMenuItem: (item: Omit<MenuItem, "id">) => void;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  addCategory: (category: string) => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

const MENU_VERSION = "v4"; // bump this to force refresh cached menu

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const savedVersion = localStorage.getItem("waffle-da-menu-version");
    if (savedVersion !== MENU_VERSION) {
      localStorage.removeItem("waffle-da-menu");
      localStorage.setItem("waffle-da-menu-version", MENU_VERSION);
      return defaultMenuItems;
    }
    const saved = localStorage.getItem("waffle-da-menu");
    return saved ? JSON.parse(saved) : defaultMenuItems;
  });

  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem("waffle-da-categories");
    return saved ? JSON.parse(saved) : defaultCategories;
  });

  useEffect(() => {
    localStorage.setItem("waffle-da-menu", JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem("waffle-da-categories", JSON.stringify(categories));
  }, [categories]);

  const addMenuItem = (item: Omit<MenuItem, "id">) => {
    const id = `custom-${Date.now()}`;
    setMenuItems((prev) => [...prev, { ...item, id }]);
  };

  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    setMenuItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
  };

  const addCategory = (category: string) => {
    if (!categories.includes(category)) {
      setCategories((prev) => [...prev, category]);
    }
  };

  return (
    <MenuContext.Provider value={{ menuItems, categories, addMenuItem, updateMenuItem, deleteMenuItem, addCategory }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) throw new Error("useMenu must be used within MenuProvider");
  return context;
};
