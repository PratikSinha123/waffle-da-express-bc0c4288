import { useOrders, Offer } from "@/context/OrderContext";
import { Link } from "react-router-dom";
import { Tag, Percent } from "lucide-react";

const OffersPage = () => {
  const { offers } = useOrders();
  const activeOffers = offers.filter((o) => o.isActive && new Date(o.validUntil) >= new Date());

  return (
    <div className="min-h-screen max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-foreground mb-2">Offers & Deals</h1>
      <p className="text-muted-foreground mb-8">Use these codes at checkout to save!</p>

      {activeOffers.length === 0 ? (
        <div className="waffle-card text-center py-16">
          <Tag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg text-muted-foreground mb-2">No active offers right now</p>
          <p className="text-sm text-muted-foreground mb-6">Check back soon for new deals!</p>
          <Link to="/menu" className="px-6 py-3 rounded-2xl waffle-gradient text-primary-foreground font-semibold">
            Browse Menu
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {activeOffers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      )}
    </div>
  );
};

const OfferCard = ({ offer }: { offer: Offer }) => {
  const discount = offer.discountPercent
    ? `${offer.discountPercent}% OFF`
    : offer.discountFlat
    ? `₹${offer.discountFlat} OFF`
    : "Special Offer";

  return (
    <div className="waffle-card overflow-hidden">
      <div className="waffle-gradient px-4 py-3 flex items-center gap-2">
        <Percent className="w-5 h-5 text-primary-foreground" />
        <span className="text-primary-foreground font-bold text-lg">{discount}</span>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-foreground text-lg mb-1">{offer.title}</h3>
        <p className="text-sm text-muted-foreground mb-3">{offer.description}</p>
        <div className="flex items-center justify-between">
          <div className="px-3 py-1.5 rounded-lg bg-secondary border border-dashed border-primary/40">
            <span className="text-sm font-mono font-bold text-primary tracking-wider">{offer.code}</span>
          </div>
          <span className="text-xs text-muted-foreground">
            Valid until {new Date(offer.validUntil).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OffersPage;
