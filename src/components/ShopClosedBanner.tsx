import { Clock } from "lucide-react";

export const isShopOpen = () => {
  const hour = new Date().getHours();
  return hour >= 17 || hour < 5;
};

const ShopClosedBanner = () => {
  if (isShopOpen()) return null;
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive mb-6">
      <Clock className="w-5 h-5 flex-shrink-0" />
      <div>
        <p className="font-semibold text-sm">We're currently closed</p>
        <p className="text-xs opacity-80">Orders are accepted between 5:00 PM – 5:00 AM only. Come back later!</p>
      </div>
    </div>
  );
};

export default ShopClosedBanner;
