import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { PhotoService } from './photo.service';
import { authenticate } from '../../hooks/authenticate';
import { ok, paginated } from '../../shared/api-response';
import { env } from '../../config/env';
import { notifyFamily } from '../../shared/notify-family';
import { NotificationType } from '../notifications/notification.entity';

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/gif']);
const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png':  'png',
  'image/webp': 'webp',
  'image/heic': 'heic',
  'image/gif':  'gif',
};

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
    const photo = await service.create(familyId, req.user.sub, body);
    notifyFamily(fastify.db, familyId, req.user.sub, NotificationType.PHOTOS, '📸',
      'New photo added', `A new photo was added to the family gallery.`, { photoId: photo.id }).catch(() => {});
    return reply.status(201).send(ok(photo));
  });

  // Multipart file upload — POST /photos/upload
  fastify.post('/upload', { preHandler: [authenticate] }, async (req, reply) => {
    const familyId = requireFamily(req);
    const data = await req.file();
    if (!data) throw Object.assign(new Error('No file provided'), { statusCode: 400 });
    if (!ALLOWED_MIME.has(data.mimetype)) {
      throw Object.assign(new Error('Unsupported file type'), { statusCode: 415 });
    }
    const uploadsDir = path.resolve(env.UPLOADS_DIR);
    fs.mkdirSync(uploadsDir, { recursive: true });
    // Derive extension from validated MIME type — never trust client filename
    const ext      = MIME_TO_EXT[data.mimetype] ?? 'jpg';
    const filename = `${crypto.randomUUID()}.${ext}`;
    const dest     = path.join(uploadsDir, filename);
    const chunks: Buffer[] = [];
    for await (const chunk of data.file) chunks.push(chunk);
    const buffer = Buffer.concat(chunks);
    fs.writeFileSync(dest, buffer);
    const url = `${env.PUBLIC_URL}/uploads/${filename}`;
    const photo = await service.create(familyId, req.user.sub, {
      url,
      thumbnailUrl:     url,
      originalFilename: data.filename,
      mimeType:         data.mimetype,
      sizeBytes:        buffer.length,
    });
    notifyFamily(fastify.db, familyId, req.user.sub, NotificationType.PHOTOS, '📸',
      'New photo uploaded', `A photo was uploaded to the family gallery.`, { photoId: photo.id }).catch(() => {});
    return reply.status(201).send(ok(photo));
  });

  fastify.delete('/:id', { preHandler: [authenticate] }, async (req, reply) => {
    const familyId = requireFamily(req);
    const { id }   = req.params as { id: string };
    await service.remove(id, familyId);
    return reply.status(204).send();
  });

  // ── Albums ─────────────────────────────────────────────────────
  // NOTE: GET must be declared before POST so ':id' param doesn't swallow "albums"

  fastify.get('/albums', { preHandler: [authenticate] }, async (req) => {
    return ok(await service.listAlbums(requireFamily(req)));
  });

  fastify.post('/albums', { preHandler: [authenticate] }, async (req, reply) => {
    const familyId = requireFamily(req);
    const { name } = createAlbumSchema.parse(req.body);
    return reply.status(201).send(ok(await service.createAlbum(familyId, req.user.sub, name)));
  });

  fastify.delete('/albums/:id', { preHandler: [authenticate] }, async (req, reply) => {
    const familyId = requireFamily(req);
    const { id }   = req.params as { id: string };
    await service.removeAlbum(id, familyId);
    return reply.status(204).send();
  });
};

export default photoRoutes;
