import Stripe from 'stripe';
import { AppDataSource } from '../../config/database';
import { User } from '../users/user.entity';
import { env } from '../../config/env';

function getStripe(): Stripe | null {
  if (!env.STRIPE_SECRET_KEY) return null;
  return new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: '2025-04-30.basil' });
}

export async function createCheckoutSession(userId: string): Promise<{ url: string }> {
  const stripe = getStripe();
  if (!stripe) throw Object.assign(new Error('Stripe is not configured'), { statusCode: 503 });
  if (!env.STRIPE_PRO_PRICE_ID) throw Object.assign(new Error('Pro price not configured'), { statusCode: 503 });

  const repo = AppDataSource.getRepository(User);
  const user = await repo.findOneByOrFail({ id: userId });

  // Reuse existing Stripe customer or create one
  let customerId = user.stripeCustomerId ?? undefined;
  if (!customerId) {
    const customer = await stripe.customers.create({ email: user.email, name: user.name });
    customerId = customer.id;
    await repo.update(userId, { stripeCustomerId: customerId });
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [{ price: env.STRIPE_PRO_PRICE_ID, quantity: 1 }],
    success_url: env.STRIPE_SUCCESS_URL,
    cancel_url: env.STRIPE_CANCEL_URL,
    subscription_data: { metadata: { userId } },
  });

  if (!session.url) throw Object.assign(new Error('Could not create checkout session'), { statusCode: 500 });
  return { url: session.url };
}

export async function handleWebhook(rawBody: Buffer, signature: string): Promise<void> {
  const stripe = getStripe();
  if (!stripe || !env.STRIPE_WEBHOOK_SECRET) return;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, env.STRIPE_WEBHOOK_SECRET);
  } catch {
    throw Object.assign(new Error('Invalid webhook signature'), { statusCode: 400 });
  }

  const repo = AppDataSource.getRepository(User);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.subscription_data?.metadata?.userId ?? session.metadata?.userId;
    if (userId) {
      await repo.update(userId, { plan: 'pro', planExpiresAt: null });
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription;
    const userId = sub.metadata?.userId;
    if (userId) {
      await repo.update(userId, { plan: 'free', planExpiresAt: null });
    }
  }

  if (event.type === 'customer.subscription.updated') {
    const sub = event.data.object as Stripe.Subscription;
    const userId = sub.metadata?.userId;
    if (!userId) return;
    if (sub.status === 'active' || sub.status === 'trialing') {
      await repo.update(userId, { plan: 'pro' });
    } else if (sub.status === 'canceled' || sub.status === 'unpaid') {
      await repo.update(userId, { plan: 'free' });
    }
  }
}
