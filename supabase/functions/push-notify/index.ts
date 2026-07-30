import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Generate VAPID keys using Web Crypto API
async function generateVapidKeys() {
  const keyPair = await crypto.subtle.generateKey(
    { name: "ECDSA", namedCurve: "P-256" },
    true,
    ["sign", "verify"]
  );
  const publicKeyRaw = await crypto.subtle.exportKey("raw", keyPair.publicKey);
  const privateKeyJwk = await crypto.subtle.exportKey("jwk", keyPair.privateKey);
  
  const publicKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(publicKeyRaw)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  
  return { publicKey: publicKeyBase64, privateKeyJwk };
}

async function getOrCreateVapidKeys(supabase: any) {
  const { data: pubData } = await supabase
    .from("settings")
    .select("value")
    .eq("key", "vapid_public_key")
    .single();
  
  const { data: privData } = await supabase
    .from("settings")
    .select("value")
    .eq("key", "vapid_private_key_jwk")
    .single();

  if (pubData?.value && privData?.value) {
    return {
      publicKey: pubData.value,
      privateKeyJwk: JSON.parse(privData.value),
    };
  }

  const keys = await generateVapidKeys();
  await supabase.from("settings").upsert({ key: "vapid_public_key", value: keys.publicKey });
  await supabase.from("settings").upsert({ key: "vapid_private_key_jwk", value: JSON.stringify(keys.privateKeyJwk) });
  
  return keys;
}

// Web Push: create JWT for VAPID
async function createVapidJwt(privateKeyJwk: JsonWebKey, audience: string, subject: string) {
  const key = await crypto.subtle.importKey(
    "jwk",
    privateKeyJwk,
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["sign"]
  );

  const header = { typ: "JWT", alg: "ES256" };
  const now = Math.floor(Date.now() / 1000);
  const payload = { aud: audience, exp: now + 86400, sub: subject };

  const encode = (obj: any) =>
    btoa(JSON.stringify(obj)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

  const unsignedToken = `${encode(header)}.${encode(payload)}`;
  const signature = await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" },
    key,
    new TextEncoder().encode(unsignedToken)
  );

  const sigArray = new Uint8Array(signature);
  const sigBase64 = btoa(String.fromCharCode(...sigArray))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

  return `${unsignedToken}.${sigBase64}`;
}

async function sendPushNotification(
  subscription: { endpoint: string; p256dh: string; auth: string },
  payload: string,
  vapidPublicKey: string,
  vapidPrivateKeyJwk: JsonWebKey
) {
  const url = new URL(subscription.endpoint);
  const audience = `${url.protocol}//${url.host}`;
  
  const jwt = await createVapidJwt(vapidPrivateKeyJwk, audience, "mailto:admin@waffleda.com");

  const response = await fetch(subscription.endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Encoding": "identity",
      TTL: "86400",
      Authorization: `vapid t=${jwt}, k=${vapidPublicKey}`,
    },
    body: payload,
  });

  return response;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const url = new URL(req.url);
  const action = url.searchParams.get("action");

  try {
    if (action === "vapid-public-key") {
      const keys = await getOrCreateVapidKeys(supabase);
      return new Response(JSON.stringify({ publicKey: keys.publicKey }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "subscribe") {
      const { endpoint, p256dh, auth } = await req.json();
      await supabase.from("push_subscriptions").upsert(
        { endpoint, p256dh, auth },
        { onConflict: "endpoint" }
      );
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "send") {
      const { title, body, orderId } = await req.json();
      const keys = await getOrCreateVapidKeys(supabase);

      // Fetch FCM device token from settings table
      const { data: fcmSetting } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "admin_fcm_token")
        .maybeSingle();

      const adminFcmToken = fcmSetting?.value;
      let fcmSent = false;

      const fcmTargets = [];
      if (adminFcmToken) fcmTargets.push(adminFcmToken);
      fcmTargets.push("/topics/admin_orders");

      const fcmPayloadTitle = title || "🧇 NEW ORDER RECEIVED!";
      const fcmPayloadBody = body || "Check order dashboard";

      for (const target of fcmTargets) {
        try {
          const fcmServerKey = Deno.env.get("FCM_SERVER_KEY") || "";
          const fcmRes = await fetch("https://fcm.googleapis.com/fcm/send", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `key=${fcmServerKey}`,
            },
            body: JSON.stringify({
              to: target,
              priority: "high",
              content_available: true,
              time_to_live: 2419200,
              notification: {
                title: fcmPayloadTitle,
                body: fcmPayloadBody,
                sound: "default",
                android_channel_id: "waffle_high_priority_orders_v2",
                default_sound: true,
                default_vibrate_timings: true,
                visibility: "public",
              },
              data: {
                title: fcmPayloadTitle,
                body: fcmPayloadBody,
                orderId: orderId,
                click_action: "FLUTTER_NOTIFICATION_CLICK",
              },
            }),
          });
          if (fcmRes.ok || fcmRes.status === 200) {
            fcmSent = true;
          }
        } catch (e) {
          console.error("FCM send error:", e);
        }
      }

      const { data: subscriptions } = await supabase
        .from("push_subscriptions")
        .select("*");

      if (!subscriptions || subscriptions.length === 0) {
        return new Response(JSON.stringify({ sent: fcmSent ? 1 : 0, fcmSent }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const payload = JSON.stringify({ title: fcmPayloadTitle, body: fcmPayloadBody, orderId });
      let sent = 0;
      const failedEndpoints: string[] = [];

      for (const sub of subscriptions) {
        if (sub.endpoint.startsWith("fcm:")) continue;
        try {
          const res = await sendPushNotification(
            { endpoint: sub.endpoint, p256dh: sub.p256dh, auth: sub.auth },
            payload,
            keys.publicKey,
            keys.privateKeyJwk
          );
          if (res.status === 201 || res.status === 200) {
            sent++;
          } else if (res.status === 404 || res.status === 410) {
            failedEndpoints.push(sub.endpoint);
          }
        } catch (e) {
          console.error("Push send error:", e);
        }
      }

      if (failedEndpoints.length > 0) {
        await supabase
          .from("push_subscriptions")
          .delete()
          .in("endpoint", failedEndpoints);
      }

      return new Response(JSON.stringify({ sent: sent + (fcmSent ? 1 : 0), fcmSent, total: subscriptions.length }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Push notify error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
