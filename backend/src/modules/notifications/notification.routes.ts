import { FastifyPluginAsync } from 'fastify';
import { NotificationService } from './notification.service';
import { authenticate } from '../../hooks/authenticate';
import { ok } from '../../shared/api-response';

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
};

export default notificationRoutes;
