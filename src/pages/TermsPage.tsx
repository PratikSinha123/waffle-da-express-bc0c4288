const TermsPage = () => (
  <div className="min-h-screen bg-pattern-dots">
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="rounded-2xl waffle-gradient-soft p-8 sm:p-10 mb-10">
        <span className="text-sm font-medium text-accent uppercase tracking-widest">Legal</span>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mt-1" style={{ fontFamily: "'Playfair Display', serif" }}>
          Terms & <span className="text-gradient italic">Conditions</span>
        </h1>
        <p className="text-muted-foreground mt-2">Last updated: March 2026</p>
      </div>

      <div className="waffle-card-elevated p-8 space-y-8">
        {[
          {
            title: "1. General",
            content: "By placing an order on Waffle Da (waffle-da-express.lovable.app), you agree to these Terms & Conditions. Waffle Da is a food business based in Bidholi, Dehradun, Uttarakhand, India. All prices are listed in Indian Rupees (INR)."
          },
          {
            title: "2. Products & Services",
            content: "We offer freshly prepared food items including waffles, waffle cakes, burgers, sandwiches, shakes, hot chocolate, ice cream, pasta, pizza, and more. All items, descriptions, and prices are listed on our Menu page. Products are subject to availability."
          },
          {
            title: "3. Ordering & Payment",
            content: "Orders can be placed through our website. We accept Cash On Delivery (COD) and online payments via Cashfree Payment Gateway (UPI, Cards, Netbanking). All payments are processed securely. By placing an order, you confirm that the details provided are accurate."
          },
          {
            title: "4. Delivery",
            content: "We deliver within our serviceable area in and around Bidholi, Dehradun. A delivery fee may apply based on distance and is displayed at checkout. Delivery times are estimates and may vary."
          },
          {
            title: "5. Order Cancellation",
            content: "Orders can only be cancelled before preparation has begun. Once your order status moves to 'Preparing', cancellation is not possible. Please contact us immediately if you need to cancel."
          },
          {
            title: "6. Limitation of Liability",
            content: "Waffle Da shall not be liable for any delays caused by unforeseen circumstances. We reserve the right to refuse or cancel orders at our discretion."
          },
          {
            title: "7. Changes to Terms",
            content: "We reserve the right to update these Terms & Conditions at any time. Continued use of the website constitutes acceptance of the revised terms."
          },
          {
            title: "8. Contact",
            content: "For any questions about these terms, contact us at 8909286581 or waffleda.express@gmail.com."
          }
        ].map((section) => (
          <div key={section.title}>
            <h2 className="text-lg font-bold text-foreground mb-2">{section.title}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default TermsPage;
