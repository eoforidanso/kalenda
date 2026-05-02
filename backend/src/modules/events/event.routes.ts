import { FastifyPluginAsync } from 'fastify';
import { EventService } from './event.service';
import { authenticate } from '../../hooks/authenticate';
import { ok } from '../../shared/api-response';

function requireFamily(req: any) {
  if (!req.user.familyId) throw Object.assign(new Error('No family associated'), { statusCode: 403 });
  return req.user.familyId as string;
}

const eventRoutes: FastifyPluginAsync = async (fastify) => {
  const service = new EventService(fastify.db);

  fastify.get('/', { preHandler: [authenticate] }, async (req) => {
    const familyId = requireFamily(req);
    const { from, to } = req.query as { from?: string; to?: string };
    return ok(await service.list(
      familyId,
      from ? new Date(from) : undefined,
      to   ? new Date(to)   : undefined,
    ));
  });

  fastify.post('/', { preHandler: [authenticate] }, async (req, reply) => {
    const familyId = requireFamily(req);
    return reply.status(201).send(ok(await service.create(familyId, req.user.sub, req.body as any)));
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

export default eventRoutes;
