import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { PhotoService } from './photo.service';
import { authenticate } from '../../hooks/authenticate';
import { ok, paginated } from '../../shared/api-response';

const createPhotoSchema = z.object({
  url:              z.string().url(),
  thumbnailUrl:     z.string().url().optional(),
  originalFilename: z.string().max(255).optional(),
  mimeType:         z.string().regex(/^image\/(jpeg|png|webp|heic|gif)$/),
  sizeBytes:        z.number().int().positive().max(50_000_000), // 50 MB cap
  width:            z.number().int().positive().optional(),
  height:           z.number().int().positive().optional(),
  takenAt:          z.string().datetime().optional(),
  albumId:          z.string().uuid().optional(),
  metadata:         z.record(z.unknown()).optional(),
});

const createAlbumSchema = z.object({
  name: z.string().min(1).max(100),
});

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
    const body = createPhotoSchema.parse(req.body);
    return reply.status(201).send(ok(await service.create(familyId, req.user.sub, body)));
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
    const familyId = requireFamily(req);
    const { name } = createAlbumSchema.parse(req.body);
    return reply.status(201).send(ok(await service.createAlbum(familyId, req.user.sub, name)));
  });
};

export default photoRoutes;
