import React, { useState, useEffect } from "react";
import { useShopStatus } from "@/context/ShopStatusContext";
import { useStallSchedule } from "@/context/StallScheduleContext";
import { getDeliveryFeeAmount, setDeliveryFeeAmount } from "@/context/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import {
  Power,
  Bike,
  MessageSquare,
  Store,
  Calendar,
  Save,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

const Settings: React.FC = () => {
  const { isShopOpen, toggleShopStatus } = useShopStatus();
  const { stallStartDate, stallEndDate, setStallDates, isStallActive } = useStallSchedule();
  const { toast } = useToast();

  const [deliveryFee, setDeliveryFee] = useState(40);
  const [whatsappWebhook, setWhatsappWebhook] = useState("");
  const [tempStart, setTempStart] = useState(stallStartDate);
  const [tempEnd, setTempEnd] = useState(stallEndDate);

  useEffect(() => {
    getDeliveryFeeAmount().then(setDeliveryFee);
    supabase.from("settings").select("value").eq("key", "whatsapp_webhook_url").single().then(({ data }) => {
      if (data?.value) setWhatsappWebhook(data.value);
    });
  }, []);

  const handleSaveStall = async () => {
    await setStallDates(tempStart, tempEnd);
    toast({ title: "Stall schedule updated!" });
  };

  const handleSaveWebhook = async () => {
    await supabase.from("settings").upsert({ key: "whatsapp_webhook_url", value: whatsappWebhook });
    toast({ title: "Webhook saved!" });
  };

  return (
    <div className="max-w-4xl space-y-8">
      {/* Shop Control */}
      <section className="waffle-card p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className={`p-4 rounded-3xl ${isShopOpen ? "bg-green-500/10 text-green-500" : "bg-destructive/10 text-destructive"}`}>
            <Power className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-black italic">Operational Status</h3>
            <p className="text-sm text-muted-foreground font-medium">Control if customers can place orders right now.</p>
          </div>
        </div>

        <div className="flex items-center justify-between p-6 rounded-3xl bg-secondary/30 border border-border/50">
          <div className="flex items-center gap-4">
            <span className={`w-3 h-3 rounded-full ${isShopOpen ? "bg-green-500 animate-pulse" : "bg-destructive"}`} />
            <span className="font-bold text-lg">{isShopOpen ? "Store is OPEN" : "Store is CLOSED"}</span>
          </div>
          <Switch checked={isShopOpen} onCheckedChange={async () => {
            await toggleShopStatus();
            toast({ title: `Shop is now ${!isShopOpen ? 'OPEN' : 'CLOSED'}` });
          }} />
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Delivery Fee */}
        <section className="waffle-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Bike className="w-6 h-6 text-primary" />
            <h3 className="font-bold">Delivery Fee</h3>
          </div>
          <div className="space-y-4">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">₹</span>
              <input
                type="number"
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary/30 border border-border focus:ring-2 focus:ring-primary/20 transition-all font-bold text-lg"
              />
            </div>
            <button
              onClick={async () => {
                await setDeliveryFeeAmount(deliveryFee);
                toast({ title: "Fee updated!" });
              }}
              className="w-full py-3 rounded-xl waffle-gradient text-primary-foreground font-bold flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>
        </section>

        {/* WhatsApp Notification */}
        <section className="waffle-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="w-6 h-6 text-primary" />
            <h3 className="font-bold">WhatsApp Webhook</h3>
          </div>
          <div className="space-y-4">
            <input
              type="text"
              value={whatsappWebhook}
              onChange={(e) => setWhatsappWebhook(e.target.value)}
              placeholder="https://api.callmebot.com/..."
              className="w-full px-4 py-3 rounded-xl bg-secondary/30 border border-border focus:ring-2 focus:ring-primary/20 transition-all text-xs"
            />
            <button
              onClick={handleSaveWebhook}
              className="w-full py-3 rounded-xl waffle-gradient text-primary-foreground font-bold flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" /> Update Webhook
            </button>
          </div>
        </section>
      </div>

      {/* Stall Management */}
      <section className="waffle-card p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className={`p-4 rounded-3xl ${isStallActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
            <Store className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-black italic">Popup Stall Schedule</h3>
            <p className="text-sm text-muted-foreground font-medium">Schedule when the special stall menu should be active.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase ml-1">Start Date</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="date"
                value={tempStart}
                onChange={(e) => setTempStart(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-secondary/30 border border-border focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase ml-1">End Date</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="date"
                value={tempEnd}
                onChange={(e) => setTempEnd(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-secondary/30 border border-border focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-border">
          <div className="flex items-center gap-2">
            {isStallActive ? (
              <div className="flex items-center gap-2 text-green-500 font-bold">
                <CheckCircle2 className="w-5 h-5" />
                STALL IS CURRENTLY ACTIVE
              </div>
            ) : (
              <div className="flex items-center gap-2 text-muted-foreground font-medium">
                <AlertCircle className="w-5 h-5" />
                Stall is currently inactive
              </div>
            )}
          </div>
          <button
            onClick={handleSaveStall}
            className="px-8 py-3 rounded-xl waffle-gradient text-primary-foreground font-bold shadow-lg shadow-primary/20"
          >
            Apply Schedule
          </button>
        </div>
      </section>
    </div>
  );
};

export default Settings;
