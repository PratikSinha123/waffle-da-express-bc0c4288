import { MenuItem } from "@/data/menuData";
import { useShopStatus } from "@/context/ShopStatusContext";

interface MenuCardProps {
  item: MenuItem;
  onCustomize: (item: MenuItem) => void;
}

const MenuCard = ({ item, onCustomize }: MenuCardProps) => {
  const isUnavailable = item.available === false;
  const { isShopOpen } = useShopStatus();
  const isDisabled = isUnavailable || !isShopOpen;

  return (
    <div className={`waffle-card-elevated flex flex-col justify-between group overflow-hidden ${isUnavailable ? "opacity-55 grayscale" : ""}`}>
      <div className="absolute inset-x-0 top-0 h-1 waffle-gradient-warm opacity-70" />
      <div className="relative">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center ${item.isVeg ? "border-green-600" : "border-red-600"}`}>
                <span className={`w-2 h-2 rounded-full ${item.isVeg ? "bg-green-600" : "bg-red-600"}`} />
              </span>
              <span className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">{item.category}</span>
            </div>
            {isUnavailable && (
              <span className="inline-flex w-fit text-[10px] px-2 py-1 rounded-full bg-destructive/10 text-destructive font-semibold">Unavailable</span>
            )}
          </div>
          <div className="text-right shrink-0">
            <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">From</div>
            <div className="text-xl font-bold text-foreground">₹{item.price}</div>
            {item.price2 && <div className="text-xs text-muted-foreground">up to ₹{item.price2}</div>}
          </div>
        </div>
        <h3 className="font-semibold text-foreground text-lg mb-2 group-hover:text-primary transition-colors leading-tight">{item.name}</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3 leading-relaxed">{item.description}</p>
      </div>
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/60 gap-3">
        <div className="text-xs text-muted-foreground">
          {isUnavailable ? "Temporarily hidden from ordering" : !isShopOpen ? "Ordering is currently paused" : "Customize your order"}
        </div>
        <button
          onClick={() => !isDisabled && onCustomize(item)}
          disabled={isDisabled}
          className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all shrink-0 ${
            isDisabled
              ? "bg-muted text-muted-foreground cursor-not-allowed"
              : "waffle-gradient text-primary-foreground hover:opacity-95 hover:scale-[1.03] shadow-md hover:shadow-lg"
          }`}
        >
          {isUnavailable ? "Unavailable" : !isShopOpen ? "Shop Closed" : "Customize"}
        </button>
      </div>
    </div>
  );
};

export default MenuCard;
