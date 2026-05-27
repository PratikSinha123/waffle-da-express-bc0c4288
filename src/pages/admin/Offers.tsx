import React, { useState } from "react";
import { useOrders } from "@/context/OrderContext";
import { useToast } from "@/hooks/use-toast";
import { Plus, Tag, Trash2, Calendar, Ticket, Check, X } from "lucide-react";

const Offers: React.FC = () => {
  const { offers, addOffer, updateOffer, deleteOffer } = useOrders();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    discountPercent: 0,
    discountFlat: 0,
    code: "",
    isActive: true,
    validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  });

  const handleSubmit = () => {
    if (!form.title || !form.code) {
      toast({ title: "Please fill in title and code", variant: "destructive" });
      return;
    }

    addOffer({
      ...form,
      code: form.code.toUpperCase(),
      discountPercent: form.discountPercent || undefined,
      discountFlat: form.discountFlat || undefined,
    });

    setIsAdding(false);
    setForm({
      title: "",
      description: "",
      discountPercent: 0,
      discountFlat: 0,
      code: "",
      isActive: true,
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    });
    toast({ title: "Offer created successfully!" });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => setIsAdding(true)}
          className="px-6 py-3 rounded-2xl waffle-gradient text-primary-foreground font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
        >
          <Plus className="w-5 h-5" /> Create New Offer
        </button>
      </div>

      {isAdding && (
        <div className="waffle-card p-8 animate-in zoom-in-95 duration-200">
          <h3 className="text-xl font-bold mb-6">New Discount Offer</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted-foreground">Offer Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Student Special"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted-foreground">Coupon Code</label>
              <input
                type="text"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 transition-all uppercase font-mono font-bold"
                placeholder="STUDENT10"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted-foreground">Discount Percentage (%)</label>
              <input
                type="number"
                value={form.discountPercent || ""}
                onChange={(e) => setForm({ ...form, discountPercent: Number(e.target.value), discountFlat: 0 })}
                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="10"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted-foreground">Flat Amount Off (₹)</label>
              <input
                type="number"
                value={form.discountFlat || ""}
                onChange={(e) => setForm({ ...form, discountFlat: Number(e.target.value), discountPercent: 0 })}
                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted-foreground">Valid Until</label>
              <input
                type="date"
                value={form.validUntil}
                onChange={(e) => setForm({ ...form, validUntil: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-semibold text-muted-foreground">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 transition-all h-20 resize-none"
                placeholder="Get 10% off on all items for university students..."
              />
            </div>
          </div>
          <div className="mt-8 flex gap-3">
            <button onClick={handleSubmit} className="px-8 py-3 rounded-xl waffle-gradient text-primary-foreground font-bold flex items-center gap-2">
              <Check className="w-5 h-5" /> Save Offer
            </button>
            <button onClick={() => setIsAdding(false)} className="px-8 py-3 rounded-xl bg-secondary text-foreground font-bold flex items-center gap-2">
              <X className="w-5 h-5" /> Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {offers.map((offer) => (
          <div key={offer.id} className={`waffle-card p-6 border-l-4 ${offer.isActive ? "border-l-primary" : "border-l-muted-foreground opacity-70"}`}>
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                <Ticket className="w-6 h-6" />
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => updateOffer(offer.id, { isActive: !offer.isActive })}
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold border ${
                    offer.isActive ? "bg-secondary text-muted-foreground" : "bg-primary text-white"
                  }`}
                >
                  {offer.isActive ? "DEACTIVATE" : "ACTIVATE"}
                </button>
                <button
                  onClick={() => { if(window.confirm("Delete offer?")) deleteOffer(offer.id); }}
                  className="p-2 rounded-xl bg-secondary text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h4 className="text-lg font-bold mb-1">{offer.title}</h4>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-mono font-black text-primary bg-primary/10 px-3 py-1 rounded-lg border border-primary/20 tracking-widest">
                {offer.code}
              </span>
              <span className="text-xs font-bold text-muted-foreground">
                • {offer.discountPercent ? `${offer.discountPercent}% OFF` : `₹${offer.discountFlat} OFF`}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2 h-10">{offer.description}</p>
            <div className="pt-4 border-t border-border flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              VALID UNTIL: {new Date(offer.validUntil).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Offers;
