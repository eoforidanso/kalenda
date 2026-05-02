import { FastifyPluginAsync } from 'fastify';
import { UserService } from './user.service';
import { authenticate } from '../../hooks/authenticate';
import { ok } from '../../shared/api-response';

const userRoutes: FastifyPluginAsync = async (fastify) => {
  const service = new UserService(fastify.db);

  fastify.get('/me', { preHandler: [authenticate] }, async (req) => {
    const user = await service.findById(req.user.sub);
    if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 });
    const { passwordHash: _, ...safe } = user as any;
    return ok(safe);
  });

  fastify.patch('/me', { preHandler: [authenticate] }, async (req) => {
    const updated = await service.update(req.user.sub, req.body as any);
    const { passwordHash: _, ...safe } = updated as any;
    return ok(safe);
  });
};

export default userRoutes;
