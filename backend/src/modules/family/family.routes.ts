import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { FamilyService } from './family.service';
import { authenticate } from '../../hooks/authenticate';
import { ok } from '../../shared/api-response';
import { env } from '../../config/env';

const createFamilySchema = z.object({ name: z.string().min(1).max(100) });
const addMemberSchema = z.object({
  userId:      z.string().uuid(),
  displayName: z.string().min(1).max(100),
  color:       z.string().regex(/^#[0-9a-fA-F]{3,8}$/, 'Invalid hex color'),
});
const createInviteSchema = z.object({
  email: z.string().email().max(254).optional().nullable(),
});
const acceptInviteSchema = z.object({
  displayName: z.string().min(1).max(100).optional(),
  color:       z.string().regex(/^#[0-9a-fA-F]{3,8}$/).optional(),
});

const familyRoutes: FastifyPluginAsync = async (fastify) => {
  const service = new FamilyService(fastify.db);

  fastify.post('/', { preHandler: [authenticate] }, async (req, reply) => {
    const { name } = createFamilySchema.parse(req.body);
    const family   = await service.createFamily(req.user.sub, name);
    return reply.status(201).send(ok(family));
  });

  /** GET /families/mine — return the first family the caller belongs to */
  fastify.get('/mine', { preHandler: [authenticate] }, async (req) => {
    const family = await service.getMyFamily(req.user.sub);
    if (!family) throw Object.assign(new Error('No family yet'), { statusCode: 404 });
    return ok(family);
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

  // ─── Invites ────────────────────────────────────────────────────────────────

  /** POST /families/:id/invites — owner generates an invite link */
  fastify.post('/:id/invites', { preHandler: [authenticate] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    await service.assertOwner(id, req.user.sub);
    const body   = createInviteSchema.parse(req.body);
    const invite = await service.createInvite(id, body.email ?? null);
    const link   = `${env.PUBLIC_URL.replace('/api/v1', '')}/invite/${invite.token}`;
    return reply.status(201).send(ok({ token: invite.token, link, expiresAt: invite.expiresAt }));
  });

  /** GET /families/invites/:token — validate token (public, no auth needed) */
  fastify.get('/invites/:token', async (req) => {
    const { token } = req.params as { token: string };
    const invite    = await service.validateInvite(token);
    // Return only safe info
    const family    = await service.getFamily(invite.familyId);
    return ok({ valid: true, familyName: family?.name, expiresAt: invite.expiresAt });
  });

  /** POST /families/invites/:token/accept — authenticated user joins via invite */
  fastify.post('/invites/:token/accept', { preHandler: [authenticate] }, async (req) => {
    const { token } = req.params as { token: string };
    const body      = acceptInviteSchema.parse(req.body ?? {});
    const member    = await service.acceptInvite(
      token,
      req.user.sub,
      body.displayName ?? 'Family Member',
      body.color ?? '#94a3b8',
    );
    return ok(member);
  });
};

export default familyRoutes;
