import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Stripe from 'npm:stripe';

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"));

const PRICE_IDS = {
  basic: Deno.env.get("STRIPE_BASIC_PRICE_ID"),
  pro: Deno.env.get("STRIPE_PRO_PRICE_ID"),
  enterprise: Deno.env.get("STRIPE_ENTERPRISE_PRICE_ID")
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { plan } = await req.json();

    if (!PRICE_IDS[plan]) {
      return Response.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      mode: 'subscription',
      line_items: [{
        price: PRICE_IDS[plan],
        quantity: 1
      }],
      metadata: {
        plan,
        user_email: user.email
      },
      success_url: `${req.headers.get('origin')}/billing?success=true`,
      cancel_url: `${req.headers.get('origin')}/billing?cancelled=true`
    });

    return Response.json({ url: session.url });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});