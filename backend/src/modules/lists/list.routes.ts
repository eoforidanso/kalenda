import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { ListService } from './list.service';
import { authenticate } from '../../hooks/authenticate';
import { ok } from '../../shared/api-response';

const createListSchema = z.object({
  name: z.string().min(1).max(100),
  icon: z.string().max(10).optional(),
});

const addItemSchema = z.object({
  text:         z.string().min(1).max(500),
  addedByName:  z.string().max(100).optional(),
});

const updateItemSchema = z.object({
  text: z.string().min(1).max(500).optional(),
  done: z.boolean().optional(),
});

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
    const { name, icon } = createListSchema.parse(req.body);
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
    const { text, addedByName } = addItemSchema.parse(req.body);
    return reply.status(201).send(ok(await service.addItem(id, text, addedByName)));
  });

  fastify.patch('/:id/items/:itemId', { preHandler: [authenticate] }, async (req) => {
    const { id, itemId } = req.params as { id: string; itemId: string };
    const body = updateItemSchema.parse(req.body);
    return ok(await service.updateItem(itemId, id, body));
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
