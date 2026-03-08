const RefundsPage = () => (
  <div className="min-h-screen bg-pattern-dots">
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="rounded-2xl waffle-gradient-soft p-8 sm:p-10 mb-10">
        <span className="text-sm font-medium text-accent uppercase tracking-widest">Policy</span>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mt-1" style={{ fontFamily: "'Playfair Display', serif" }}>
          Refunds & <span className="text-gradient italic">Cancellations</span>
        </h1>
        <p className="text-muted-foreground mt-2">Last updated: March 2026</p>
      </div>

      <div className="waffle-card-elevated p-8 space-y-8">
        {[
          {
            title: "1. Cancellation Policy",
            content: "You may cancel your order before it moves to the 'Preparing' stage. Once preparation has started, cancellations are not accepted as food items are perishable and prepared fresh. To cancel an eligible order, please contact us immediately at 8909286581."
          },
          {
            title: "2. Refund Policy",
            content: "Refunds are applicable in the following cases:\n• Order was not delivered.\n• Wrong item(s) were delivered.\n• Item quality was significantly below expectations.\n• Online payment was charged but order was not confirmed.\n\nRefund requests must be raised within 24 hours of the order being placed."
          },
          {
            title: "3. Refund Process",
            content: "To request a refund, contact us at 8909286581 or waffleda.express@gmail.com with your Order ID and reason. We will review your request within 2 business days."
          },
          {
            title: "4. Refund Timeline",
            content: "For online payments (Cashfree), approved refunds will be processed within 5–7 business days back to the original payment method. For COD orders, refunds (if any) will be adjusted in your next order or returned via UPI transfer."
          },
          {
            title: "5. Non-Refundable Cases",
            content: "Refunds will not be provided for:\n• Change of mind after order is prepared.\n• Incorrect address provided by the customer.\n• Delay in delivery due to factors beyond our control.\n• Partially consumed items."
          },
          {
            title: "6. Contact for Refunds",
            content: "For any refund or cancellation queries, reach out to us:\nPhone: 8909286581\nEmail: waffleda.express@gmail.com\nWe aim to resolve all queries within 48 hours."
          }
        ].map((section) => (
          <div key={section.title}>
            <h2 className="text-lg font-bold text-foreground mb-2">{section.title}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default RefundsPage;
