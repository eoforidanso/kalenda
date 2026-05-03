import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { FamilyService } from './family.service';
import { authenticate } from '../../hooks/authenticate';
import { ok } from '../../shared/api-response';

const createFamilySchema = z.object({ name: z.string().min(1).max(100) });
const addMemberSchema = z.object({
  userId:      z.string().uuid(),
  displayName: z.string().min(1).max(100),
  color:       z.string().regex(/^#[0-9a-fA-F]{3,8}$/, 'Invalid hex color'),
});

const familyRoutes: FastifyPluginAsync = async (fastify) => {
  const service = new FamilyService(fastify.db);

  fastify.post('/', { preHandler: [authenticate] }, async (req, reply) => {
    const { name } = createFamilySchema.parse(req.body);
    const family   = await service.createFamily(req.user.sub, name);
    return reply.status(201).send(ok(family));
  });

  fastify.get('/:id', { preHandler: [authenticate] }, async (req) => {
    const { id } = req.params as { id: string };
    // A01: verify caller is a member of this family
    await service.assertMember(id, req.user.sub);
    const family = await service.getFamily(id);
    if (!family) throw Object.assign(new Error('Family not found'), { statusCode: 404 });
    return ok(family);
  });

  fastify.post('/:id/members', { preHandler: [authenticate] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    // A01: only the owner can add members
    await service.assertOwner(id, req.user.sub);
    const { userId, displayName, color } = addMemberSchema.parse(req.body);
    return reply.status(201).send(ok(await service.addMember(id, userId, displayName, color)));
  });

  fastify.delete('/:id/members/:userId', { preHandler: [authenticate] }, async (req, reply) => {
    const { id, userId } = req.params as { id: string; userId: string };
    // A01: only the owner can remove members
    await service.assertOwner(id, req.user.sub);
    await service.removeMember(id, userId);
    return reply.status(204).send();
  });
};

export default familyRoutes;
