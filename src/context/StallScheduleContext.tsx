import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface StallItemConfig {
  id: string;
  stallPrice?: number;
  stallPrice2?: number;
}

interface StallBanner {
  title: string;
  subtitle: string;
  linkText: string;
}

interface StallScheduleContextType {
  stallStartDate: string;
  stallEndDate: string;
  stallStartTime: string;
  stallEndTime: string;
  isStallActive: boolean;
  setStallDates: (start: string, end: string) => Promise<void>;
  setStallTimes: (startTime: string, endTime: string) => Promise<void>;
  banner: StallBanner;
  setBanner: (banner: StallBanner) => Promise<void>;
  stallItemsConfig: StallItemConfig[];
  addStallItem: (id: string) => Promise<void>;
  removeStallItem: (id: string) => Promise<void>;
  updateStallItemPrice: (id: string, stallPrice?: number, stallPrice2?: number) => Promise<void>;
  loading: boolean;
}

const StallScheduleContext = createContext<StallScheduleContextType | undefined>(undefined);

export const StallScheduleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stallStartDate, setStallStartDate] = useState("");
  const [stallEndDate, setStallEndDate] = useState("");
  const [banner, setBannerState] = useState<StallBanner>({
    title: "🎉 Waffle Da Pop-Up Stall",
    subtitle: "Come visit us! Fresh waffles, shakes & more 🧇",
    linkText: "View Stall Menu",
  });
  const [stallItemsConfig, setStallItemsConfig] = useState<StallItemConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from("settings")
        .select("key, value")
        .in("key", ["stall_start_date", "stall_end_date", "stall_banner_title", "stall_banner_subtitle", "stall_banner_link_text", "stall_items_config"]);

      if (data) {
        for (const row of data) {
          if (row.key === "stall_start_date") setStallStartDate(row.value);
          if (row.key === "stall_end_date") setStallEndDate(row.value);
          if (row.key === "stall_banner_title") setBannerState(prev => ({ ...prev, title: row.value }));
          if (row.key === "stall_banner_subtitle") setBannerState(prev => ({ ...prev, subtitle: row.value }));
          if (row.key === "stall_banner_link_text") setBannerState(prev => ({ ...prev, linkText: row.value }));
          if (row.key === "stall_items_config") {
            try {
              setStallItemsConfig(JSON.parse(row.value));
            } catch { /* ignore parse errors */ }
          }
        }
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const isStallActive = (() => {
    if (!stallStartDate || !stallEndDate) return false;
    const now = new Date();
    const start = new Date(stallStartDate + "T00:00:00");
    const end = new Date(stallEndDate + "T23:59:59");
    return now >= start && now <= end;
  })();

  const setStallDates = useCallback(async (start: string, end: string) => {
    setStallStartDate(start);
    setStallEndDate(end);
    await Promise.all([
      supabase.from("settings").upsert({ key: "stall_start_date", value: start }),
      supabase.from("settings").upsert({ key: "stall_end_date", value: end }),
    ]);
  }, []);

  const setBanner = useCallback(async (b: StallBanner) => {
    setBannerState(b);
    await Promise.all([
      supabase.from("settings").upsert({ key: "stall_banner_title", value: b.title }),
      supabase.from("settings").upsert({ key: "stall_banner_subtitle", value: b.subtitle }),
      supabase.from("settings").upsert({ key: "stall_banner_link_text", value: b.linkText }),
    ]);
  }, []);

  const saveStallConfig = useCallback(async (config: StallItemConfig[]) => {
    setStallItemsConfig(config);
    await supabase.from("settings").upsert({ key: "stall_items_config", value: JSON.stringify(config) });
  }, []);

  const addStallItem = useCallback(async (id: string) => {
    const newConfig = [...stallItemsConfig, { id }];
    await saveStallConfig(newConfig);
  }, [stallItemsConfig, saveStallConfig]);

  const removeStallItem = useCallback(async (id: string) => {
    const newConfig = stallItemsConfig.filter(item => item.id !== id);
    await saveStallConfig(newConfig);
  }, [stallItemsConfig, saveStallConfig]);

  const updateStallItemPrice = useCallback(async (id: string, stallPrice?: number, stallPrice2?: number) => {
    const newConfig = stallItemsConfig.map(item =>
      item.id === id ? { ...item, stallPrice, stallPrice2 } : item
    );
    await saveStallConfig(newConfig);
  }, [stallItemsConfig, saveStallConfig]);

  return (
    <StallScheduleContext.Provider value={{
      stallStartDate, stallEndDate, isStallActive, setStallDates,
      banner, setBanner,
      stallItemsConfig, addStallItem, removeStallItem, updateStallItemPrice,
      loading,
    }}>
      {children}
    </StallScheduleContext.Provider>
  );
};

export const useStallSchedule = () => {
  const context = useContext(StallScheduleContext);
  if (!context) throw new Error("useStallSchedule must be used within StallScheduleProvider");
  return context;
};
