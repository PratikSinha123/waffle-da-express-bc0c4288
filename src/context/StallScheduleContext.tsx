import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface StallScheduleContextType {
  stallStartDate: string; // ISO date string e.g. "2026-03-17"
  stallEndDate: string;
  isStallActive: boolean;
  setStallDates: (start: string, end: string) => Promise<void>;
  loading: boolean;
}

const StallScheduleContext = createContext<StallScheduleContextType | undefined>(undefined);

export const StallScheduleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stallStartDate, setStallStartDate] = useState("");
  const [stallEndDate, setStallEndDate] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDates = async () => {
      const { data } = await supabase
        .from("settings")
        .select("key, value")
        .in("key", ["stall_start_date", "stall_end_date"]);

      if (data) {
        for (const row of data) {
          if (row.key === "stall_start_date") setStallStartDate(row.value);
          if (row.key === "stall_end_date") setStallEndDate(row.value);
        }
      }
      setLoading(false);
    };
    fetchDates();
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

  return (
    <StallScheduleContext.Provider value={{ stallStartDate, stallEndDate, isStallActive, setStallDates, loading }}>
      {children}
    </StallScheduleContext.Provider>
  );
};

export const useStallSchedule = () => {
  const context = useContext(StallScheduleContext);
  if (!context) throw new Error("useStallSchedule must be used within StallScheduleProvider");
  return context;
};
