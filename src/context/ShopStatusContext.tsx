import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ShopStatusContextType {
  isShopOpen: boolean;
  loading: boolean;
  toggleShopStatus: () => Promise<void>;
}

const ShopStatusContext = createContext<ShopStatusContextType | undefined>(undefined);

export const ShopStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isShopOpen, setIsShopOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  const fetchStatus = useCallback(async () => {
    const { data } = await supabase
      .from("settings")
      .select("key, value")
      .in("key", ["shop_open", "shop_status"]);
    
    if (data && data.length > 0) {
      const openRow = data.find(r => r.key === "shop_open");
      const statusRow = data.find(r => r.key === "shop_status");
      
      const openVal = openRow ? openRow.value : "true";
      const statusVal = statusRow ? statusRow.value : "open";

      setIsShopOpen(openVal === "true" && statusVal !== "closed");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchStatus();

    // Realtime subscription for settings table updates
    const channel = supabase
      .channel("settings-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "settings" }, () => {
        fetchStatus();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchStatus]);

  const toggleShopStatus = async () => {
    const newValue = !isShopOpen;
    setIsShopOpen(newValue);
    const openStr = newValue ? "true" : "false";
    const statusStr = newValue ? "open" : "closed";

    await Promise.all([
      supabase.from("settings").upsert({ key: "shop_open", value: openStr } as any),
      supabase.from("settings").upsert({ key: "shop_status", value: statusStr } as any),
    ]);
  };

  return (
    <ShopStatusContext.Provider value={{ isShopOpen, loading, toggleShopStatus }}>
      {children}
    </ShopStatusContext.Provider>
  );
};

export const useShopStatus = () => {
  const context = useContext(ShopStatusContext);
  if (!context) throw new Error("useShopStatus must be used within ShopStatusProvider");
  return context;
};
