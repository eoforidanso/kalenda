import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { UserService } from './user.service';
import { authenticate } from '../../hooks/authenticate';
import { ok } from '../../shared/api-response';

const updateMeSchema = z.object({
  name:               z.string().min(1).max(100).optional(),
  avatarColor:        z.string().regex(/^#[0-9a-fA-F]{3,8}$/).optional(),
  phoneNumber:        z.string().max(20).nullable().optional(),
  agendaEmailEnabled: z.boolean().optional(),
  agendaEmailTime:    z.string().max(20).optional(),
});

const userRoutes: FastifyPluginAsync = async (fastify) => {
  const service = new UserService(fastify.db);

  fastify.get('/me', { preHandler: [authenticate] }, async (req) => {
    const user = await service.findById(req.user.sub);
    if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 });
    const { passwordHash: _, ...safe } = user as any;
    return ok(safe);
  });

  fastify.patch('/me', { preHandler: [authenticate] }, async (req) => {
    const body    = updateMeSchema.parse(req.body);
    const updated = await service.update(req.user.sub, body);
    const { passwordHash: _, ...safe } = updated as any;
    return ok(safe);
  });
};

export default userRoutes;
