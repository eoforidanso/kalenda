import { FastifyPluginAsync } from 'fastify';
import { PhotoService } from './photo.service';
import { authenticate } from '../../hooks/authenticate';
import { ok, paginated } from '../../shared/api-response';

function requireFamily(req: any) {
  if (!req.user.familyId) throw Object.assign(new Error('No family associated'), { statusCode: 403 });
  return req.user.familyId as string;
}

const photoRoutes: FastifyPluginAsync = async (fastify) => {
  const service = new PhotoService(fastify.db);

  // ── Photos ─────────────────────────────────────────────────────

  fastify.get('/', { preHandler: [authenticate] }, async (req) => {
    const familyId = requireFamily(req);
    const { albumId, page, limit } = req.query as {
      albumId?: string; page?: number; limit?: number;
    };
    const r = await service.listPhotos(familyId, albumId, page, limit);
    return paginated(r.data, r.total, r.page, r.limit);
  });

  fastify.post('/', { preHandler: [authenticate] }, async (req, reply) => {
    const familyId = requireFamily(req);
    return reply.status(201).send(ok(await service.create(familyId, req.user.sub, req.body as any)));
  });

  fastify.delete('/:id', { preHandler: [authenticate] }, async (req, reply) => {
    const familyId = requireFamily(req);
    const { id }   = req.params as { id: string };
    await service.remove(id, familyId);
    return reply.status(204).send();
  });

  // ── Albums ─────────────────────────────────────────────────────

  fastify.get('/albums', { preHandler: [authenticate] }, async (req) => {
    return ok(await service.listAlbums(requireFamily(req)));
  });

  fastify.post('/albums', { preHandler: [authenticate] }, async (req, reply) => {
    const familyId  = requireFamily(req);
    const { name }  = req.body as { name: string };
    return reply.status(201).send(ok(await service.createAlbum(familyId, req.user.sub, name)));
  });
};

export default photoRoutes;
