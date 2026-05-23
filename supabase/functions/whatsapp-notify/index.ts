const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId, customerName, customerPhone, orderType, total, items, address, notes } = await req.json();

    // Fetch webhook URL from settings table
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const settingsRes = await fetch(
      `${SUPABASE_URL}/rest/v1/settings?key=eq.whatsapp_webhook_url&select=value`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        },
      }
    );
    const settingsData = await settingsRes.json();
    const webhookUrl = settingsData?.[0]?.value;

    if (!webhookUrl) {
      console.log('No WhatsApp webhook URL configured, skipping notification');
      return new Response(JSON.stringify({ skipped: true, reason: 'No webhook URL configured' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Build order summary
    const itemsList = (items || [])
      .map((item: any) => `• ${item.name} x${item.quantity} - ₹${item.price * item.quantity}`)
      .join('\n');

    const message = `🧇 *New Order - Waffle Da!*

📋 *Order ID:* ${orderId}
👤 *Customer:* ${customerName}
📞 *Phone:* ${customerPhone}
🛒 *Type:* ${orderType}
${address && orderType === 'Delivery' ? `📍 *Address:* ${address}\n` : ''}${notes ? `📝 *Notes:* ${notes}\n` : ''}
*Items:*
${itemsList}

💰 *Total: ₹${total}*`;

    // Detect CallMeBot (uses GET with text query param)
    const isCallMeBot = webhookUrl.includes('callmebot.com');
    let webhookRes;
    if (isCallMeBot) {
      const sep = webhookUrl.includes('?') ? '&' : '?';
      const url = `${webhookUrl}${sep}text=${encodeURIComponent(message)}`;
      webhookRes = await fetch(url, { method: 'GET' });
    } else {
      // Send to webhook (works with Interakt, Wati, etc.)
      webhookRes = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message, orderId, customerName, customerPhone, orderType, total, items, address, notes,
        }),
      });
    }

    const responseText = await webhookRes.text();
    console.log('WhatsApp webhook response:', webhookRes.status, responseText);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('WhatsApp notify error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
