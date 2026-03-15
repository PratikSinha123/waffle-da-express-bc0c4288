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
    <div className={`waffle-card-elevated flex flex-col justify-between group ${isUnavailable ? "opacity-50 grayscale" : ""}`}>
      <div>
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center ${item.isVeg ? "border-green-600" : "border-red-600"}`}>
              <span className={`w-2 h-2 rounded-full ${item.isVeg ? "bg-green-600" : "bg-red-600"}`} />
            </span>
            {isUnavailable && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-destructive/10 text-destructive font-semibold">Unavailable</span>
            )}
          </div>
        </div>
        <h3 className="font-semibold text-foreground text-base mb-1 group-hover:text-primary transition-colors">{item.name}</h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.description}</p>
      </div>
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/50">
        <div>
          <span className="text-lg font-bold text-foreground">₹{item.price}</span>
          {item.price2 && <span className="text-sm text-muted-foreground ml-1">/ ₹{item.price2}</span>}
        </div>
        <button
          onClick={() => !isDisabled && onCustomize(item)}
          disabled={isDisabled}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            isDisabled
              ? "bg-muted text-muted-foreground cursor-not-allowed"
              : "waffle-gradient text-primary-foreground hover:opacity-90 hover:scale-[1.03] glow-accent"
          }`}
        >
          {isUnavailable ? "Unavailable" : !isShopOpen ? "Shop Closed" : "Customize"}
        </button>
      </div>
    </div>
  );
};

export default MenuCard;
