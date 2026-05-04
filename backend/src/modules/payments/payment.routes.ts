import { FastifyInstance } from 'fastify';
import { authenticate } from '../../hooks/authenticate';
import { createCheckoutSession, handleWebhook } from './payment.service';

export default async function paymentRoutes(app: FastifyInstance) {
  // Create a Stripe Checkout session — returns { url } to redirect the user
  app.post('/checkout', { preHandler: [authenticate] }, async (req, reply) => {
    const userId = req.user.sub;
    const result = await createCheckoutSession(userId);
    return reply.send({ success: true, data: result });
  });

  // Stripe webhook — must receive the raw body, NOT parsed JSON
  app.post(
    '/webhook',
    {
      config: { rawBody: true },
      // Stripe sends its own signature — no JWT auth here
    },
    async (req, reply) => {
      const sig = req.headers['stripe-signature'] as string;
      const rawBody: Buffer | undefined = (req as any).rawBody;
      if (!rawBody) {
        return reply.status(400).send({ success: false, error: 'Raw body unavailable' });
      }
      await handleWebhook(rawBody, sig);
      return reply.send({ received: true });
    },
  );

  // Get current plan for the logged-in user
  app.get('/plan', { preHandler: [authenticate] }, async (req, reply) => {
    const userId = req.user.sub;
    const { AppDataSource } = await import('../../config/database');
    const { User } = await import('../users/user.entity');
    const user = await AppDataSource.getRepository(User).findOneByOrFail({ id: userId });
    return reply.send({ success: true, data: { plan: user.plan, planExpiresAt: user.planExpiresAt } });
  });
}
