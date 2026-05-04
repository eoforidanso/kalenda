import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { EventService } from './event.service';
import { authenticate } from '../../hooks/authenticate';
import { ok, paginated } from '../../shared/api-response';
import { notifyFamily } from '../../shared/notify-family';
import { NotificationType } from '../notifications/notification.entity';

const createEventSchema = z.object({
  title:          z.string().min(1).max(255),
  description:    z.string().max(2000).optional(),
  startAt:        z.string().datetime(),
  endAt:          z.string().datetime().optional(),
  allDay:         z.boolean().optional(),
  assignedToName: z.string().max(100).optional(),
  color:          z.string().max(20).optional(),
  isRecurring:    z.boolean().optional(),
  recurrenceRule: z.string().max(500).optional(),
});

const updateEventSchema = createEventSchema.partial();

function requireFamily(req: any) {
  if (!req.user.familyId) throw Object.assign(new Error('No family associated'), { statusCode: 403 });
  return req.user.familyId as string;
}

const eventRoutes: FastifyPluginAsync = async (fastify) => {
  const service = new EventService(fastify.db);

  fastify.get('/', { preHandler: [authenticate] }, async (req) => {
    const familyId = requireFamily(req);
    const { from, to, page, limit } = req.query as {
      from?: string; to?: string; page?: number; limit?: number;
    };
    const r = await service.list(
      familyId,
      from ? new Date(from) : undefined,
      to   ? new Date(to)   : undefined,
      page,
      limit,
    );
    return paginated(r.data, r.total, r.page, r.limit);
  });

  fastify.post('/', { preHandler: [authenticate] }, async (req, reply) => {
    const familyId = requireFamily(req);
    const body = createEventSchema.parse(req.body);
    const event = await service.create(familyId, req.user.sub, body);
    notifyFamily(fastify.db, familyId, req.user.sub, NotificationType.EVENTS, '📅',
      'New event added', `"${event.title}" was added to the family calendar.`, { eventId: event.id }).catch(() => {});
    return reply.status(201).send(ok(event));
  });

  fastify.patch('/:id', { preHandler: [authenticate] }, async (req) => {
    const familyId = requireFamily(req);
    const { id }   = req.params as { id: string };
    const body = updateEventSchema.parse(req.body);
    return ok(await service.update(id, familyId, body));
  });

  fastify.delete('/:id', { preHandler: [authenticate] }, async (req, reply) => {
    const familyId = requireFamily(req);
    const { id }   = req.params as { id: string };
    await service.remove(id, familyId);
    return reply.status(204).send();
  });
};

export default eventRoutes;
