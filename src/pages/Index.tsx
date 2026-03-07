import { Link } from "react-router-dom";
import { ArrowRight, UtensilsCrossed, Truck, Clock } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 sm:py-32 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
            🧇 Freshly Made Waffles
          </div>
          <h1 className="text-5xl sm:text-7xl font-extrabold text-foreground mb-6 leading-tight">
            Waffle <span className="text-accent">Da!</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Delicious waffles, burgers, pizzas, and much more — freshly made and delivered to your doorstep.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/menu"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl waffle-gradient text-primary-foreground font-semibold text-lg hover:opacity-95 transition-opacity"
            >
              View Menu <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/track-order"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border-2 border-border bg-card text-foreground font-semibold text-lg hover:bg-secondary transition-colors"
            >
              Track Order
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: UtensilsCrossed, title: "Fresh & Tasty", desc: "Made with premium ingredients, prepared fresh for every order" },
            { icon: Truck, title: "Fast Delivery", desc: "Quick delivery right to your doorstep in minimum time" },
            { icon: Clock, title: "Track Live", desc: "Real-time order tracking so you know exactly when it arrives" },
          ].map((feature) => (
            <div key={feature.title} className="waffle-card text-center p-8">
              <div className="w-14 h-14 rounded-2xl waffle-gradient flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="font-bold text-foreground text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular categories */}
      <section className="py-16 px-4 bg-secondary/30">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-10">Our Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {["Waffles", "Burgers", "Pizza", "Shakes", "Pasta", "Garlic Bread", "Ice Cream", "Quick Bites"].map((cat) => (
              <Link
                key={cat}
                to="/menu"
                className="waffle-card p-6 hover:scale-[1.02] transition-transform text-center"
              >
                <span className="text-3xl mb-2 block">
                  {cat === "Waffles" ? "🧇" : cat === "Burgers" ? "🍔" : cat === "Pizza" ? "🍕" : cat === "Shakes" ? "🥤" : cat === "Pasta" ? "🍝" : cat === "Garlic Bread" ? "🍞" : cat === "Ice Cream" ? "🍦" : "🍗"}
                </span>
                <span className="font-semibold text-foreground">{cat}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center border-t border-border">
        <p className="text-sm text-muted-foreground">© 2024 Waffle Da! All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
