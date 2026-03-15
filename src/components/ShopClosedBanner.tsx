import { Clock } from "lucide-react";
import { useShopStatus } from "@/context/ShopStatusContext";

const ShopClosedBanner = () => {
  const { isShopOpen, loading } = useShopStatus();
  if (loading || isShopOpen) return null;
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive mb-6">
      <Clock className="w-5 h-5 flex-shrink-0" />
      <div>
        <p className="font-semibold text-sm">We're currently closed</p>
        <p className="text-xs opacity-80">We're not accepting orders right now. Please check back later!</p>
      </div>
    </div>
  );
};

export default ShopClosedBanner;
