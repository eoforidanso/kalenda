import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { NotificationService } from './notification.service';
import { authenticate } from '../../hooks/authenticate';
import { ok } from '../../shared/api-response';

const fcmTokenSchema = z.object({
  token: z.string().min(1).max(512),
  platform: z.enum(['web', 'ios', 'android']).default('web'),
});

const notificationRoutes: FastifyPluginAsync = async (fastify) => {
  const service = new NotificationService(fastify.db);

  fastify.get('/', { preHandler: [authenticate] }, async (req) => {
    const { unread } = req.query as { unread?: string };
    return ok(await service.list(req.user.sub, unread === 'true'));
  });

  fastify.patch('/:id/read', { preHandler: [authenticate] }, async (req) => {
    const { id } = req.params as { id: string };
    await service.markRead(id, req.user.sub);
    return ok(null);
  });

  fastify.post('/mark-all-read', { preHandler: [authenticate] }, async (req) => {
    await service.markAllRead(req.user.sub);
    return ok(null);
  });

  fastify.delete('/:id', { preHandler: [authenticate] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    await service.dismiss(id, req.user.sub);
    return reply.status(204).send();
  });

  fastify.post('/fcm-token', { preHandler: [authenticate] }, async (req) => {
    const { token, platform } = fcmTokenSchema.parse(req.body);
    await service.registerDeviceToken(req.user.sub, token, platform);
    return ok(null);
  });

  fastify.delete('/fcm-token', { preHandler: [authenticate] }, async (req, reply) => {
    const { token } = z.object({ token: z.string().min(1) }).parse(req.body);
    await service.unregisterDeviceToken(req.user.sub, token);
    return reply.status(204).send();
  });
};

export default notificationRoutes;
