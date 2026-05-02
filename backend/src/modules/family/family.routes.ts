import { FastifyPluginAsync } from 'fastify';
import { FamilyService } from './family.service';
import { authenticate } from '../../hooks/authenticate';
import { ok } from '../../shared/api-response';

const familyRoutes: FastifyPluginAsync = async (fastify) => {
  const service = new FamilyService(fastify.db);

  fastify.post('/', { preHandler: [authenticate] }, async (req, reply) => {
    const { name } = req.body as { name: string };
    const family   = await service.createFamily(req.user.sub, name);
    return reply.status(201).send(ok(family));
  });

  fastify.get('/:id', { preHandler: [authenticate] }, async (req) => {
    const { id } = req.params as { id: string };
    const family  = await service.getFamily(id);
    if (!family) throw Object.assign(new Error('Family not found'), { statusCode: 404 });
    return ok(family);
  });

  fastify.post('/:id/members', { preHandler: [authenticate] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const { userId, displayName, color } = req.body as {
      userId: string; displayName: string; color: string;
    };
    return reply.status(201).send(ok(await service.addMember(id, userId, displayName, color)));
  });

  fastify.delete('/:id/members/:userId', { preHandler: [authenticate] }, async (req, reply) => {
    const { id, userId } = req.params as { id: string; userId: string };
    await service.removeMember(id, userId);
    return reply.status(204).send();
  });
};

export default familyRoutes;
