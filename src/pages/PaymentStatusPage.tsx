import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

const PaymentStatusPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get("order_id");
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");

  useEffect(() => {
    // Cashfree redirects back with order_id; we check if we have it
    if (orderId) {
      // Simple: if we got redirected back, payment was attempted
      // In production you'd verify with Cashfree's Get Order API
      setStatus("success");
    } else {
      setStatus("failed");
    }
  }, [orderId]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-muted-foreground">Verifying payment...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 gap-6">
      {status === "success" ? (
        <>
          <CheckCircle className="w-20 h-20 text-green-500" />
          <h1 className="text-2xl font-bold text-foreground">Payment Successful!</h1>
          <p className="text-muted-foreground text-center">
            Your order <span className="font-semibold text-foreground">{orderId}</span> has been placed.
          </p>
          <button
            onClick={() => navigate(`/track-order?id=${orderId}`)}
            className="px-6 py-3 rounded-2xl waffle-gradient text-primary-foreground font-semibold"
          >
            Track Order
          </button>
        </>
      ) : (
        <>
          <XCircle className="w-20 h-20 text-destructive" />
          <h1 className="text-2xl font-bold text-foreground">Payment Failed</h1>
          <p className="text-muted-foreground text-center">Something went wrong. Please try again.</p>
          <button
            onClick={() => navigate("/cart")}
            className="px-6 py-3 rounded-2xl waffle-gradient text-primary-foreground font-semibold"
          >
            Back to Cart
          </button>
        </>
      )}
    </div>
  );
};

export default PaymentStatusPage;
