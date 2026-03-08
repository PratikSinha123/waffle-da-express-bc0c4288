import { MapPin, Phone, Clock3, Mail } from "lucide-react";

const ContactPage = () => (
  <div className="min-h-screen bg-pattern-dots">
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="rounded-2xl waffle-gradient-soft p-8 sm:p-10 mb-10">
        <span className="text-sm font-medium text-accent uppercase tracking-widest">Get in Touch</span>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mt-1" style={{ fontFamily: "'Playfair Display', serif" }}>
          Contact <span className="text-gradient italic">Us</span>
        </h1>
        <p className="text-muted-foreground mt-2">We'd love to hear from you!</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        {[
          { icon: Phone, label: "Phone", value: "8909286581", href: "tel:8909286581" },
          { icon: Mail, label: "Email", value: "waffleda.express@gmail.com", href: "mailto:waffleda.express@gmail.com" },
          { icon: MapPin, label: "Address", value: "Bidholi, Dehradun, Uttarakhand, India" },
          { icon: Clock3, label: "Hours", value: "5:00 PM – 5:00 AM (Daily)" },
        ].map((item) => (
          <div key={item.label} className="waffle-card-elevated p-6 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl waffle-gradient-warm flex items-center justify-center shrink-0">
              <item.icon className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">{item.label}</h3>
              {item.href ? (
                <a href={item.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">{item.value}</a>
              ) : (
                <p className="text-sm text-muted-foreground">{item.value}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="waffle-card-elevated p-8">
        <h2 className="text-xl font-bold text-foreground mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>About Waffle Da</h2>
        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
          Waffle Da is a food venture based in Bidholi, Dehradun, serving handcrafted waffles, shakes, burgers, sandwiches, and more.
          All our products are freshly prepared and priced in INR (₹). We offer delivery, pickup, and dine-in options.
        </p>
        <p className="text-muted-foreground text-sm leading-relaxed">
          For any queries, complaints, or feedback, feel free to reach out via phone or email. We aim to respond within 24 hours.
        </p>
      </div>
    </div>
  </div>
);

export default ContactPage;
