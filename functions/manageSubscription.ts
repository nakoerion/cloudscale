import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Stripe from 'npm:stripe';

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"));

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, plan } = await req.json();
    
    const subscriptions = await base44.entities.Subscription.filter({ user_email: user.email });
    const subscription = subscriptions[0];

    if (!subscription) {
      return Response.json({ error: 'No subscription found' }, { status: 404 });
    }

    if (action === 'cancel') {
      await stripe.subscriptions.update(subscription.stripe_subscription_id, {
        cancel_at_period_end: true
      });

      await base44.entities.Subscription.update(subscription.id, {
        cancel_at_period_end: true
      });

      return Response.json({ success: true, message: 'Subscription will cancel at period end' });
    }

    if (action === 'reactivate') {
      await stripe.subscriptions.update(subscription.stripe_subscription_id, {
        cancel_at_period_end: false
      });

      await base44.entities.Subscription.update(subscription.id, {
        cancel_at_period_end: false
      });

      return Response.json({ success: true, message: 'Subscription reactivated' });
    }

    if (action === 'upgrade' || action === 'downgrade') {
      const PRICE_IDS = {
        basic: Deno.env.get("STRIPE_BASIC_PRICE_ID"),
        pro: Deno.env.get("STRIPE_PRO_PRICE_ID"),
        enterprise: Deno.env.get("STRIPE_ENTERPRISE_PRICE_ID")
      };

      const stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripe_subscription_id);
      
      await stripe.subscriptions.update(subscription.stripe_subscription_id, {
        items: [{
          id: stripeSubscription.items.data[0].id,
          price: PRICE_IDS[plan]
        }],
        proration_behavior: 'create_prorations'
      });

      await base44.entities.Subscription.update(subscription.id, {
        plan
      });

      return Response.json({ success: true, message: `Plan ${action}d to ${plan}` });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});