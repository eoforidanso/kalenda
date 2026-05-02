import { FastifyPluginAsync } from 'fastify';
import { TaskService } from './task.service';
import { authenticate } from '../../hooks/authenticate';
import { ok } from '../../shared/api-response';
import { TaskCategory } from './task.entity';

function requireFamily(req: any) {
  if (!req.user.familyId) throw Object.assign(new Error('No family associated'), { statusCode: 403 });
  return req.user.familyId as string;
}

const taskRoutes: FastifyPluginAsync = async (fastify) => {
  const service = new TaskService(fastify.db);

  fastify.get('/', { preHandler: [authenticate] }, async (req) => {
    const familyId = requireFamily(req);
    const { assignedToName, category } = req.query as {
      assignedToName?: string; category?: TaskCategory;
    };
    return ok(await service.list(familyId, assignedToName, category));
  });

  fastify.post('/', { preHandler: [authenticate] }, async (req, reply) => {
    const familyId = requireFamily(req);
    return reply.status(201).send(ok(await service.create(familyId, req.body as any)));
  });

  fastify.patch('/:id', { preHandler: [authenticate] }, async (req) => {
    const familyId = requireFamily(req);
    const { id }   = req.params as { id: string };
    return ok(await service.update(id, familyId, req.body as any));
  });

  fastify.delete('/:id', { preHandler: [authenticate] }, async (req, reply) => {
    const familyId = requireFamily(req);
    const { id }   = req.params as { id: string };
    await service.remove(id, familyId);
    return reply.status(204).send();
  });
};

export default taskRoutes;
