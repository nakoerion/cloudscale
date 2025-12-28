import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Stripe from 'npm:stripe';

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"));

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const sig = req.headers.get('stripe-signature');
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

    let event;
    const body = await req.text();

    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err) {
      return Response.json({ error: 'Webhook signature verification failed' }, { status: 400 });
    }

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const customer = await stripe.customers.retrieve(subscription.customer);
        
        await base44.asServiceRole.entities.Subscription.bulkCreate([{
          user_email: customer.email,
          plan: subscription.metadata.plan || 'basic',
          status: subscription.status,
          stripe_customer_id: subscription.customer,
          stripe_subscription_id: subscription.id,
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          cancel_at_period_end: subscription.cancel_at_period_end,
          monthly_price: subscription.items.data[0].price.unit_amount / 100
        }]);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const subs = await base44.asServiceRole.entities.Subscription.filter({
          stripe_subscription_id: subscription.id
        });
        if (subs[0]) {
          await base44.asServiceRole.entities.Subscription.update(subs[0].id, {
            status: 'cancelled'
          });
        }
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object;
        const customer = await stripe.customers.retrieve(invoice.customer);
        
        await base44.asServiceRole.entities.Invoice.bulkCreate([{
          user_email: customer.email,
          subscription_id: invoice.subscription,
          invoice_number: invoice.number,
          amount: invoice.amount_paid / 100,
          currency: invoice.currency,
          status: 'paid',
          stripe_invoice_id: invoice.id,
          invoice_pdf: invoice.invoice_pdf,
          billing_period_start: new Date(invoice.period_start * 1000).toISOString().split('T')[0],
          billing_period_end: new Date(invoice.period_end * 1000).toISOString().split('T')[0],
          paid_at: new Date(invoice.status_transitions.paid_at * 1000).toISOString()
        }]);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const subs = await base44.asServiceRole.entities.Subscription.filter({
          stripe_subscription_id: invoice.subscription
        });
        if (subs[0]) {
          await base44.asServiceRole.entities.Subscription.update(subs[0].id, {
            status: 'past_due'
          });
        }
        break;
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});