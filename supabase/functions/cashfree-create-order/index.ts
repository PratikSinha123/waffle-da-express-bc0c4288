const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const CASHFREE_APP_ID = Deno.env.get('CASHFREE_APP_ID');
    const CASHFREE_SECRET_KEY = Deno.env.get('CASHFREE_SECRET_KEY');

    if (!CASHFREE_APP_ID) throw new Error('CASHFREE_APP_ID is not configured');
    if (!CASHFREE_SECRET_KEY) throw new Error('CASHFREE_SECRET_KEY is not configured');

    const { orderId, orderAmount, customerName, customerPhone, returnUrl } = await req.json();

    if (!orderId || !orderAmount || !customerName || !customerPhone || !returnUrl) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const cashfreeUrl = 'https://api.cashfree.com/pg/orders';

    const response = await fetch(cashfreeUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': CASHFREE_APP_ID,
        'x-client-secret': CASHFREE_SECRET_KEY,
        'x-api-version': '2023-08-01',
      },
      body: JSON.stringify({
        order_id: orderId,
        order_amount: orderAmount,
        order_currency: 'INR',
        customer_details: {
          customer_id: customerPhone.replace(/[^0-9]/g, ''),
          customer_name: customerName,
          customer_phone: customerPhone.replace(/[^0-9]/g, ''),
        },
        order_meta: {
          return_url: returnUrl,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Cashfree API error:', data);
      return new Response(JSON.stringify({ error: 'Failed to create Cashfree order', details: data }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Cashfree response:', JSON.stringify(data));

    // Build the Cashfree hosted checkout URL
    const checkoutUrl = `https://payments.cashfree.com/pgappsdo498/order?token=${data.payment_session_id}`;

    return new Response(JSON.stringify({
      paymentSessionId: data.payment_session_id,
      orderId: data.order_id,
      paymentLink: data.payment_link || checkoutUrl,
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
