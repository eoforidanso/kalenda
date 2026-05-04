import { FastifyInstance } from 'fastify';
import { authenticate } from '../../hooks/authenticate';
import { createCheckoutSession, handleWebhook } from './payment.service';

export default async function paymentRoutes(app: FastifyInstance) {
  // Create a Stripe Checkout session — returns { url } to redirect the user
  app.post('/checkout', { preHandler: [authenticate] }, async (req, reply) => {
    const userId = (req.user as any).id as string;
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
      // Fastify multipart/raw body: access via req.rawBody if registered,
      // otherwise fall back to the body buffer
      const rawBody: Buffer = (req as any).rawBody ?? Buffer.from(JSON.stringify(req.body));
      await handleWebhook(rawBody, sig);
      return reply.send({ received: true });
    },
  );

  // Get current plan for the logged-in user
  app.get('/plan', { preHandler: [authenticate] }, async (req, reply) => {
    const userId = (req.user as any).id as string;
    const { AppDataSource } = await import('../../config/database');
    const { User } = await import('../users/user.entity');
    const user = await AppDataSource.getRepository(User).findOneByOrFail({ id: userId });
    return reply.send({ success: true, data: { plan: user.plan, planExpiresAt: user.planExpiresAt } });
  });
}
