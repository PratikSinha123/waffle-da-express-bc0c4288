import { useState, useEffect, useRef } from "react";
import { useOrders, OrderStatus, Offer } from "@/context/OrderContext";
import { useMenu } from "@/context/MenuContext";
import { useToast } from "@/hooks/use-toast";
import { Download, Search, Plus, Pencil, Trash2, LogIn, LogOut, ChevronDown, Bell, BellRing, Tag, Settings } from "lucide-react";
import { MenuItem } from "@/data/menuData";
import { getDeliveryFeeAmount, setDeliveryFeeAmount } from "@/context/CartContext";
import { supabase } from "@/integrations/supabase/client";

const ADMIN_PASSWORD = "waffle123";

// Push notification subscription helper
const subscribeToPush = async () => {
  try {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      return { success: false, error: "Push notifications not supported on this browser" };
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      return { success: false, error: "Notification permission denied" };
    }

    // Register service worker
    const registration = await navigator.serviceWorker.register("/sw.js");
    await navigator.serviceWorker.ready;

    // Get VAPID public key from edge function
    const { data: vapidData, error: vapidError } = await supabase.functions.invoke("push-notify", {
      body: null,
      method: "GET",
    });

    // Try fetching VAPID key directly
    const vapidRes = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/push-notify?action=vapid-public-key`,
      { headers: { "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY } }
    );
    const vapidJson = await vapidRes.json();
    const vapidPublicKey = vapidJson.publicKey;

    if (!vapidPublicKey) {
      return { success: false, error: "Could not get VAPID key" };
    }

    // Convert VAPID key to Uint8Array
    const urlBase64ToUint8Array = (base64String: string) => {
      const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
      const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
      const rawData = window.atob(base64);
      return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)));
    };

    // Subscribe to push
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    });

    const subJson = subscription.toJSON();

    // Save subscription to backend
    await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/push-notify?action=subscribe`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({
          endpoint: subJson.endpoint,
          p256dh: subJson.keys?.p256dh,
          auth: subJson.keys?.auth,
        }),
      }
    );

    return { success: true };
  } catch (e: any) {
    console.error("Push subscription error:", e);
    return { success: false, error: e.message };
  }
};

// Push notification subscribe button
const PushSubscribeButton = () => {
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if already subscribed
    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.pushManager.getSubscription().then((sub) => {
          if (sub) setSubscribed(true);
        });
      }).catch(() => {});
    }
  }, []);

  const handleSubscribe = async () => {
    setLoading(true);
    const result = await subscribeToPush();
    setLoading(false);
    if (result.success) {
      setSubscribed(true);
      toast({ title: "🔔 Push notifications enabled!", description: "You'll receive alerts even when this tab is closed." });
    } else {
      toast({ title: "Could not enable notifications", description: result.error, variant: "destructive" });
    }
  };

  if (subscribed) {
    return (
      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 text-green-500 text-xs font-medium">
        <BellRing className="w-3.5 h-3.5" /> Push ON
      </span>
    );
  }

  return (
    <button
      onClick={handleSubscribe}
      disabled={loading}
      className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-primary/30 text-primary text-xs font-medium hover:bg-primary/10 transition-colors disabled:opacity-50"
    >
      <BellRing className="w-3.5 h-3.5" />
      {loading ? "Enabling..." : "Enable Push"}
    </button>
  );
};

const AdminPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<"orders" | "menu" | "offers">("orders");
  const { toast } = useToast();
  const { unseenCount, markAllSeen } = useOrders();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      toast({ title: "Welcome, Admin!" });
    } else {
      toast({ title: "Wrong password", variant: "destructive" });
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <form onSubmit={handleLogin} className="waffle-card max-w-sm w-full p-8 space-y-4">
          <h1 className="text-2xl font-bold text-foreground text-center">Admin Login</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button type="submit" className="w-full py-3 rounded-xl waffle-gradient text-primary-foreground font-semibold">
            <LogIn className="w-4 h-4 inline mr-2" /> Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Admin Panel</h1>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Push notification subscribe button */}
          <PushSubscribeButton />
          {/* Notification bell */}
          <button
            onClick={() => { setActiveTab("orders"); markAllSeen(); }}
            className="relative p-2 rounded-full hover:bg-secondary transition-colors"
          >
            <Bell className="w-5 h-5 text-foreground" />
            {unseenCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                {unseenCount}
              </span>
            )}
          </button>
          <button onClick={() => setIsLoggedIn(false)} className="px-3 sm:px-4 py-2 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-secondary">
            <LogOut className="w-4 h-4 inline mr-1" /> Logout
          </button>
        </div>
      </div>

      {/* Notification banner */}
      <NotificationBanner />

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(["orders", "menu", "offers"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); if (tab === "orders") markAllSeen(); }}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all relative ${
              activeTab === tab ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
            }`}
          >
            {tab === "orders" ? "Orders" : tab === "menu" ? "Menu" : "Offers"}
            {tab === "orders" && unseenCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {unseenCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {activeTab === "orders" ? <OrdersPanel /> : activeTab === "menu" ? <MenuPanel /> : <OffersPanel />}
    </div>
  );
};

// Shared AudioContext - initialized on first user interaction
let sharedAudioCtx: AudioContext | null = null;

const getAudioContext = () => {
  if (!sharedAudioCtx) {
    sharedAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  // Resume if suspended (browser policy)
  if (sharedAudioCtx.state === "suspended") {
    sharedAudioCtx.resume();
  }
  return sharedAudioCtx;
};

// Initialize AudioContext on any user click (bypasses browser autoplay policy)
if (typeof window !== "undefined") {
  const initAudio = () => {
    getAudioContext();
    document.removeEventListener("click", initAudio);
  };
  document.addEventListener("click", initAudio);
}

// Ringtone notification sound hook
const useOrderRingtone = () => {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startRinging = () => {
    stopRinging();
    const playTone = () => {
      try {
        const audioCtx = getAudioContext();
        // First beep
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.value = 880;
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
        osc.start(audioCtx.currentTime);
        osc.stop(audioCtx.currentTime + 0.4);
        // Second beep (higher pitch)
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        osc2.frequency.value = 1100;
        gain2.gain.setValueAtTime(0.3, audioCtx.currentTime + 0.2);
        gain2.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);
        osc2.start(audioCtx.currentTime + 0.2);
        osc2.stop(audioCtx.currentTime + 0.6);
      } catch (e) {
        console.error("Audio playback error:", e);
      }
    };
    playTone();
    // Beep every 800ms for 10 seconds continuous
    intervalRef.current = setInterval(playTone, 800);
    timeoutRef.current = setTimeout(() => stopRinging(), 10000);
  };

  const stopRinging = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  useEffect(() => () => stopRinging(), []);

  return { startRinging, stopRinging };
};

// Real-time notification banner
const NotificationBanner = () => {
  const { orders, unseenCount } = useOrders();
  const [showBanner, setShowBanner] = useState(false);
  const [latestOrder, setLatestOrder] = useState<string | null>(null);
  const prevCountRef = useRef(orders.length);
  const { startRinging, stopRinging } = useOrderRingtone();

  useEffect(() => {
    if (orders.length > prevCountRef.current) {
      const newest = orders[0];
      setLatestOrder(newest.id);
      setShowBanner(true);
      startRinging();
    }
    prevCountRef.current = orders.length;
  }, [orders]);

  const handleDismiss = () => {
    setShowBanner(false);
    stopRinging();
  };

  if (!showBanner || !latestOrder) return null;

  const order = orders.find((o) => o.id === latestOrder);
  if (!order) return null;

  return (
    <div className="mb-4 p-4 rounded-2xl bg-accent/10 border-2 border-accent animate-in slide-in-from-top-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full waffle-gradient flex items-center justify-center animate-pulse">
            <Bell className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <p className="font-semibold text-foreground">🔔 New Order Received!</p>
            <p className="text-sm text-muted-foreground">
              {order.id} • {order.customerName} • {order.orderType} • ₹{order.total}
            </p>
          </div>
        </div>
        <button onClick={handleDismiss} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          ✓ Acknowledge
        </button>
      </div>
    </div>
  );
};

const OrdersPanel = () => {
  const { orders, updateOrderStatus, deleteOrder } = useOrders();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [deliveryFee, setDeliveryFeeLocal] = useState(40);
  const [editingFee, setEditingFee] = useState(false);

  useEffect(() => {
    getDeliveryFeeAmount().then(setDeliveryFeeLocal);
  }, []);

  const filteredOrders = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.phone.includes(searchQuery)
  );

  const handleDelete = (id: string) => {
    deleteOrder(id);
    setConfirmDelete(null);
    setExpandedOrder(null);
    toast({ title: "Order deleted" });
  };

  const downloadCSV = () => {
    const headers = ["Order ID", "Customer Name", "Phone Number", "Address", "Order Type", "Items Ordered", "Add-ons", "Total Price", "Payment Method", "Order Status", "Order Date"];
    const rows = orders.map((o) => [
      o.id,
      o.customerName,
      o.phone,
      o.address,
      o.orderType || "Delivery",
      o.items.map((i) => `${i.quantity}x ${i.menuItem.name}`).join("; "),
      o.items.map((i) => i.selectedAddOns.map((a) => a.name).join(", ")).filter(Boolean).join("; "),
      o.total,
      o.paymentMethod,
      o.status,
      new Date(o.createdAt).toLocaleString(),
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `waffle-da-orders-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const statuses: OrderStatus[] = ["Order Received", "Preparing", "Out for Delivery", "Delivered"];

  return (
    <div>
      {/* Live indicator */}
      <div className="flex items-center gap-2 mb-4">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
        <span className="text-sm text-muted-foreground">Live — Auto-updating every 3s</span>
        <span className="ml-auto text-sm font-medium text-foreground">{orders.length} total orders</span>
      </div>

      {/* Delivery Fee Setting */}
      <div className="waffle-card p-4 mb-4 flex items-center gap-3">
        <Settings className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">Delivery Fee:</span>
        {editingFee ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">₹</span>
            <input
              type="number"
              value={deliveryFee}
              onChange={(e) => setDeliveryFeeLocal(Number(e.target.value))}
              className="w-20 px-3 py-1.5 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              min={0}
            />
            <button
              onClick={async () => {
                await setDeliveryFeeAmount(deliveryFee);
                setEditingFee(false);
                toast({ title: `Delivery fee updated to ₹${deliveryFee}` });
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium waffle-gradient text-primary-foreground"
            >
              Save
            </button>
            <button onClick={() => { getDeliveryFeeAmount().then(setDeliveryFeeLocal); setEditingFee(false); }} className="px-3 py-1.5 rounded-lg text-xs font-medium border border-border text-muted-foreground">
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-sm text-foreground font-semibold">₹{deliveryFee}</span>
            <button onClick={() => setEditingFee(true)} className="px-3 py-1.5 rounded-lg text-xs font-medium border border-border text-muted-foreground hover:bg-secondary">
              <Pencil className="w-3 h-3 inline mr-1" /> Change
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, phone, or order ID..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <button onClick={downloadCSV} className="px-5 py-3 rounded-xl waffle-gradient text-primary-foreground font-medium flex items-center gap-2 whitespace-nowrap">
          <Download className="w-4 h-4" /> Download CSV
        </button>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="waffle-card text-center py-12">
          <p className="text-muted-foreground">No orders found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <div key={order.id} className={`waffle-card ${!order.seen ? "ring-2 ring-accent" : ""}`}>
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
              >
                <div className="flex items-center gap-2">
                  {!order.seen && <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />}
                  <div>
                    <span className="font-semibold text-foreground">{order.id}</span>
                    <span className="text-sm text-muted-foreground ml-3">{order.customerName}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    order.paymentMethod === "Cashfree" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                  }`}>
                    {order.paymentMethod === "Cashfree" ? "💳 Paid" : "💵 COD"}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground font-medium">
                    {order.orderType || "Delivery"}
                  </span>
                  <span className="text-sm font-medium text-primary">₹{order.total}</span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    order.status === "Delivered" ? "bg-green-100 text-green-700" :
                    order.status === "Out for Delivery" ? "bg-blue-100 text-blue-700" :
                    order.status === "Preparing" ? "bg-yellow-100 text-yellow-700" :
                    "bg-secondary text-secondary-foreground"
                  }`}>
                    {order.status}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${expandedOrder === order.id ? "rotate-180" : ""}`} />
                </div>
              </div>

              {expandedOrder === order.id && (
                <div className="mt-4 pt-4 border-t border-border space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="text-muted-foreground">Phone:</span> <span className="text-foreground">{order.phone}</span></div>
                    <div><span className="text-muted-foreground">Payment:</span> <span className="text-foreground">{order.paymentMethod}</span></div>
                    <div><span className="text-muted-foreground">Order Type:</span> <span className="text-foreground font-medium">{order.orderType || "Delivery"}</span></div>
                    {order.orderType === "Delivery" && (
                      <div className="col-span-2"><span className="text-muted-foreground">Address:</span> <span className="text-foreground">{order.address}</span></div>
                    )}
                    {order.notes && <div className="col-span-2"><span className="text-muted-foreground">Notes:</span> <span className="text-foreground">{order.notes}</span></div>}
                    <div className="col-span-2"><span className="text-muted-foreground">Date:</span> <span className="text-foreground">{new Date(order.createdAt).toLocaleString()}</span></div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">Items:</p>
                    {order.items.map((item, i) => (
                      <div key={i} className="text-sm text-muted-foreground">
                        {item.quantity}x {item.menuItem.name}
                        {item.selectedAddOns.length > 0 && (
                          <span> (+{item.selectedAddOns.map((a) => a.name).join(", ")})</span>
                        )}
                      </div>
                    ))}
                  </div>

                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">Update Status:</p>
                    <div className="flex flex-wrap gap-2">
                      {statuses.map((status) => (
                        <button
                          key={status}
                          onClick={() => updateOrderStatus(order.id, status)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                            order.status === status
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border text-muted-foreground hover:border-primary/30"
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Delete order */}
                  <div className="pt-2 border-t border-border">
                    {confirmDelete === order.id ? (
                      <div className="flex items-center gap-3">
                        <p className="text-sm text-destructive font-medium">Are you sure?</p>
                        <button
                          onClick={() => handleDelete(order.id)}
                          className="px-4 py-1.5 rounded-full text-xs font-medium bg-destructive text-destructive-foreground hover:opacity-90"
                        >
                          Yes, Delete
                        </button>
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className="px-4 py-1.5 rounded-full text-xs font-medium border border-border text-muted-foreground hover:bg-secondary"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDelete(order.id)}
                        className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium text-destructive border border-destructive/30 hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete Order
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const MenuPanel = () => {
  const { menuItems, categories, addMenuItem, updateMenuItem, deleteMenuItem, addCategory } = useMenu();
  const { toast } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState("");
  const [form, setForm] = useState<Omit<MenuItem, "id">>({
    name: "",
    description: "",
    price: 0,
    category: categories[1] || "",
    isVeg: true,
  });

  const handleAdd = () => {
    if (!form.name.trim() || !form.category) {
      toast({ title: "Name and category are required", variant: "destructive" });
      return;
    }
    addMenuItem(form);
    setForm({ name: "", description: "", price: 0, category: categories[1] || "", isVeg: true });
    setShowAddForm(false);
    toast({ title: "Item added!" });
  };

  const handleUpdate = (id: string) => {
    updateMenuItem(id, form);
    setEditingId(null);
    toast({ title: "Item updated!" });
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      addCategory(newCategory.trim());
      setNewCategory("");
      toast({ title: "Category added!" });
    }
  };

  const startEdit = (item: MenuItem) => {
    setEditingId(item.id);
    setForm({ name: item.name, description: item.description, price: item.price, category: item.category, isVeg: item.isVeg });
  };

  return (
    <div className="space-y-6">
      <div className="waffle-card p-4">
        <h3 className="font-semibold text-foreground mb-3">Add New Category</h3>
        <div className="flex gap-3">
          <input type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="Category name"
            className="flex-1 px-4 py-2 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
          <button onClick={handleAddCategory} className="px-4 py-2 rounded-xl waffle-gradient text-primary-foreground font-medium">Add</button>
        </div>
      </div>

      <div className="waffle-card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground">Menu Items ({menuItems.length})</h3>
          <button onClick={() => { setShowAddForm(!showAddForm); setEditingId(null); }} className="px-4 py-2 rounded-xl waffle-gradient text-primary-foreground font-medium text-sm flex items-center gap-1">
            <Plus className="w-4 h-4" /> Add Item
          </button>
        </div>

        {showAddForm && (
          <div className="p-4 rounded-xl bg-secondary/50 mb-4 space-y-3">
            <input type="text" placeholder="Item name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none" />
            <input type="text" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none" />
            <div className="flex gap-3">
              <input type="number" placeholder="Price" value={form.price || ""} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                className="flex-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none" />
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="flex-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none">
                {categories.filter((c) => c !== "All").map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" checked={form.isVeg} onChange={(e) => setForm({ ...form, isVeg: e.target.checked })} className="rounded" />
              Vegetarian
            </label>
            <button onClick={handleAdd} className="px-4 py-2 rounded-xl waffle-gradient text-primary-foreground font-medium text-sm">Add to Menu</button>
          </div>
        )}

        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
          {menuItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-background border border-border">
              {editingId === item.id ? (
                <div className="flex-1 space-y-2 mr-3">
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-card border border-border text-foreground text-sm focus:outline-none" />
                  <div className="flex gap-2">
                    <input type="number" value={form.price || ""} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                      className="w-24 px-3 py-1.5 rounded-lg bg-card border border-border text-foreground text-sm focus:outline-none" />
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-card border border-border text-foreground text-sm focus:outline-none">
                      {categories.filter((c) => c !== "All").map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleUpdate(item.id)} className="px-3 py-1 rounded-lg bg-primary text-primary-foreground text-xs font-medium">Save</button>
                    <button onClick={() => setEditingId(null)} className="px-3 py-1 rounded-lg bg-secondary text-secondary-foreground text-xs font-medium">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-sm border ${item.isVeg ? "border-green-600" : "border-red-600"}`}>
                        <span className={`block w-1.5 h-1.5 rounded-full m-[2px] ${item.isVeg ? "bg-green-600" : "bg-red-600"}`} />
                      </span>
                      <span className="text-sm font-medium text-foreground truncate">{item.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{item.category} • ₹{item.price}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => startEdit(item)} className="p-1.5 rounded-lg hover:bg-secondary">
                      <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                    <button onClick={() => { deleteMenuItem(item.id); toast({ title: "Item deleted" }); }} className="p-1.5 rounded-lg hover:bg-destructive/10">
                      <Trash2 className="w-3.5 h-3.5 text-destructive" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const OffersPanel = () => {
  const { offers, addOffer, updateOffer, deleteOffer } = useOrders();
  const { toast } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    discountPercent: 0,
    discountFlat: 0,
    code: "",
    isActive: true,
    validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  });

  const handleAdd = () => {
    if (!form.title.trim() || !form.code.trim()) {
      toast({ title: "Title and code are required", variant: "destructive" });
      return;
    }
    addOffer({
      title: form.title,
      description: form.description,
      discountPercent: form.discountPercent || undefined,
      discountFlat: form.discountFlat || undefined,
      code: form.code.toUpperCase(),
      isActive: form.isActive,
      validUntil: form.validUntil,
    });
    setForm({ title: "", description: "", discountPercent: 0, discountFlat: 0, code: "", isActive: true, validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0] });
    setShowAddForm(false);
    toast({ title: "Offer created!" });
  };

  return (
    <div className="space-y-6">
      <div className="waffle-card p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Offers ({offers.length})</h3>
          <button onClick={() => setShowAddForm(!showAddForm)} className="px-4 py-2 rounded-xl waffle-gradient text-primary-foreground font-medium text-sm flex items-center gap-1">
            <Plus className="w-4 h-4" /> Add Offer
          </button>
        </div>

        {showAddForm && (
          <div className="p-4 rounded-xl bg-secondary/50 mb-4 space-y-3">
            <input type="text" placeholder="Offer title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none" />
            <input type="text" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none" />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">Discount %</label>
                <input type="number" value={form.discountPercent || ""} onChange={(e) => setForm({ ...form, discountPercent: Number(e.target.value), discountFlat: 0 })}
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Flat ₹ Off</label>
                <input type="number" value={form.discountFlat || ""} onChange={(e) => setForm({ ...form, discountFlat: Number(e.target.value), discountPercent: 0 })}
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">Coupon Code</label>
                <input type="text" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none uppercase" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Valid Until</label>
                <input type="date" value={form.validUntil} onChange={(e) => setForm({ ...form, validUntil: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none" />
              </div>
            </div>
            <button onClick={handleAdd} className="px-4 py-2 rounded-xl waffle-gradient text-primary-foreground font-medium text-sm">Create Offer</button>
          </div>
        )}

        {offers.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No offers yet. Create your first one!</p>
        ) : (
          <div className="space-y-3">
            {offers.map((offer) => (
              <div key={offer.id} className="p-4 rounded-xl bg-background border border-border">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Tag className="w-4 h-4 text-primary" />
                      <span className="font-semibold text-foreground">{offer.title}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${offer.isActive ? "bg-green-100 text-green-700" : "bg-secondary text-muted-foreground"}`}>
                        {offer.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{offer.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="font-mono font-bold text-primary">{offer.code}</span>
                      <span>•</span>
                      <span>{offer.discountPercent ? `${offer.discountPercent}% off` : `₹${offer.discountFlat} off`}</span>
                      <span>•</span>
                      <span>Until {new Date(offer.validUntil).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateOffer(offer.id, { isActive: !offer.isActive })}
                      className={`px-3 py-1 rounded-lg text-xs font-medium ${offer.isActive ? "bg-secondary text-secondary-foreground" : "bg-primary/10 text-primary"}`}
                    >
                      {offer.isActive ? "Deactivate" : "Activate"}
                    </button>
                    <button onClick={() => { deleteOffer(offer.id); toast({ title: "Offer deleted" }); }} className="p-1.5 rounded-lg hover:bg-destructive/10">
                      <Trash2 className="w-3.5 h-3.5 text-destructive" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
