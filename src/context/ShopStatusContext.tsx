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
      .select("value")
      .eq("key", "shop_open")
      .single();
    if (data) {
      setIsShopOpen(data.value === "true");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchStatus();

    // Realtime subscription
    const channel = supabase
      .channel("settings-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "settings" }, (payload) => {
        if ((payload.new as any)?.key === "shop_open") {
          setIsShopOpen((payload.new as any).value === "true");
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchStatus]);

  const toggleShopStatus = async () => {
    const newValue = !isShopOpen;
    setIsShopOpen(newValue);
    await supabase
      .from("settings")
      .upsert({ key: "shop_open", value: String(newValue) } as any);
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
