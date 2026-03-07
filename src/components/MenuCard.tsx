import { MenuItem } from "@/data/menuData";

interface MenuCardProps {
  item: MenuItem;
  onCustomize: (item: MenuItem) => void;
}

const MenuCard = ({ item, onCustomize }: MenuCardProps) => {
  return (
    <div className="waffle-card flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span
              className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center ${
                item.isVeg ? "border-green-600" : "border-red-600"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  item.isVeg ? "bg-green-600" : "bg-red-600"
                }`}
              />
            </span>
          </div>
        </div>
        <h3 className="font-semibold text-foreground text-base mb-1">{item.name}</h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.description}</p>
      </div>
      <div className="flex items-center justify-between mt-auto">
        <div>
          <span className="text-lg font-bold text-foreground">₹{item.price}</span>
          {item.price2 && (
            <span className="text-sm text-muted-foreground ml-1">/ ₹{item.price2}</span>
          )}
        </div>
        <button
          onClick={() => onCustomize(item)}
          className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Customize
        </button>
      </div>
    </div>
  );
};

export default MenuCard;
