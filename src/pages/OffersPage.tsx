import { useOrders, Offer } from "@/context/OrderContext";
import { Link } from "react-router-dom";
import { Tag, Percent, Sparkles } from "lucide-react";

const OffersPage = () => {
  const { offers } = useOrders();
  const activeOffers = offers.filter((o) => o.isActive && new Date(o.validUntil) >= new Date());

  return (
    <div className="min-h-screen bg-pattern-dots">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="page-header">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-accent" />
            <span className="text-sm font-medium text-accent uppercase tracking-widest">Special</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
            Offers & <span className="text-gradient italic">Deals</span>
          </h1>
          <p className="text-muted-foreground mt-2">Use these codes at checkout to save!</p>
        </div>

        {activeOffers.length === 0 ? (
          <div className="waffle-card-elevated text-center py-16">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
              <Tag className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-lg text-muted-foreground mb-2">No active offers right now</p>
            <p className="text-sm text-muted-foreground mb-6">Check back soon for new deals!</p>
            <Link to="/menu" className="px-6 py-3 rounded-2xl waffle-gradient-warm text-primary-foreground font-semibold glow-accent">Browse Menu</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {activeOffers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const OfferCard = ({ offer }: { offer: Offer }) => {
  const discount = offer.discountPercent
    ? `${offer.discountPercent}% OFF`
    : offer.discountFlat ? `₹${offer.discountFlat} OFF` : "Special Offer";

  return (
    <div className="waffle-card-elevated overflow-hidden">
      <div className="waffle-gradient-warm px-5 py-4 flex items-center gap-2">
        <Percent className="w-5 h-5 text-primary-foreground" />
        <span className="text-primary-foreground font-bold text-lg">{discount}</span>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-foreground text-lg mb-1">{offer.title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{offer.description}</p>
        <div className="flex items-center justify-between">
          <div className="px-4 py-2 rounded-lg bg-secondary border border-dashed border-primary/40">
            <span className="text-sm font-mono font-bold text-primary tracking-wider">{offer.code}</span>
          </div>
          <span className="text-xs text-muted-foreground">Valid until {new Date(offer.validUntil).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default OffersPage;
