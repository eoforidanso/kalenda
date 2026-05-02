import { FastifyPluginAsync } from 'fastify';
import { ListService } from './list.service';
import { authenticate } from '../../hooks/authenticate';
import { ok } from '../../shared/api-response';

function requireFamily(req: any) {
  if (!req.user.familyId) throw Object.assign(new Error('No family associated'), { statusCode: 403 });
  return req.user.familyId as string;
}

const listRoutes: FastifyPluginAsync = async (fastify) => {
  const service = new ListService(fastify.db);

  // ── Lists ──────────────────────────────────────────────────────

  fastify.get('/', { preHandler: [authenticate] }, async (req) => {
    return ok(await service.getLists(requireFamily(req)));
  });

  fastify.post('/', { preHandler: [authenticate] }, async (req, reply) => {
    const familyId = requireFamily(req);
    const { name, icon } = req.body as { name: string; icon?: string };
    return reply.status(201).send(ok(await service.createList(familyId, req.user.sub, name, icon)));
  });

  fastify.delete('/:id', { preHandler: [authenticate] }, async (req, reply) => {
    const familyId = requireFamily(req);
    const { id }   = req.params as { id: string };
    await service.deleteList(id, familyId);
    return reply.status(204).send();
  });

  // ── Items ──────────────────────────────────────────────────────

  fastify.get('/:id/items', { preHandler: [authenticate] }, async (req) => {
    const { id } = req.params as { id: string };
    return ok(await service.getItems(id));
  });

  fastify.post('/:id/items', { preHandler: [authenticate] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const { text, addedByName } = req.body as { text: string; addedByName?: string };
    return reply.status(201).send(ok(await service.addItem(id, text, addedByName)));
  });

  fastify.patch('/:id/items/:itemId', { preHandler: [authenticate] }, async (req) => {
    const { id, itemId } = req.params as { id: string; itemId: string };
    return ok(await service.updateItem(itemId, id, req.body as any));
  });

  fastify.delete('/:id/items/:itemId', { preHandler: [authenticate] }, async (req, reply) => {
    const { id, itemId } = req.params as { id: string; itemId: string };
    await service.removeItem(itemId, id);
    return reply.status(204).send();
  });

  // Clear all checked items from a list
  fastify.delete('/:id/items', { preHandler: [authenticate] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    await service.clearCompleted(id);
    return reply.status(204).send();
  });
};

export default listRoutes;
