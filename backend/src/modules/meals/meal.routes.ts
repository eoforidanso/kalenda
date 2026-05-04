import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { MealPlanService } from './meal-plan.service';
import { authenticate } from '../../hooks/authenticate';
import { ok } from '../../shared/api-response';

const DAY   = z.enum(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
const MTYPE = z.enum(['Breakfast', 'Lunch', 'Dinner', 'Snack']);
const WEEK_RE = /^\d{4}-\d{2}-\d{2}$/;

const upsertSchema = z.object({
  weekStart: z.string().regex(WEEK_RE, 'weekStart must be YYYY-MM-DD'),
  day:       DAY,
  mealType:  MTYPE,
  meal:      z.string().min(1).max(255),
  cook:      z.string().max(100).optional(),
  notes:     z.string().max(500).optional(),
});

const removeSchema = z.object({
  weekStart: z.string().regex(WEEK_RE),
  day:       DAY,
  mealType:  MTYPE,
});

function requireFamily(req: any) {
  if (!req.user.familyId) throw Object.assign(new Error('No family associated'), { statusCode: 403 });
  return req.user.familyId as string;
}

const mealRoutes: FastifyPluginAsync = async (fastify) => {
  const service = new MealPlanService(fastify.db);

  // GET /meals?weekStart=2026-05-04
  fastify.get('/', { preHandler: [authenticate] }, async (req) => {
    const familyId = requireFamily(req);
    const { weekStart } = req.query as { weekStart?: string };
    if (!weekStart || !WEEK_RE.test(weekStart)) {
      throw Object.assign(new Error('weekStart query param (YYYY-MM-DD) is required'), { statusCode: 400 });
    }
    return ok(await service.getWeek(familyId, weekStart));
  });

  // PUT /meals — upsert a single meal slot
  fastify.put('/', { preHandler: [authenticate] }, async (req) => {
    const familyId = requireFamily(req);
    const body = upsertSchema.parse(req.body);
    return ok(await service.upsert(familyId, body));
  });

  // DELETE /meals — remove a meal slot
  fastify.delete('/', { preHandler: [authenticate] }, async (req, reply) => {
    const familyId = requireFamily(req);
    const body = removeSchema.parse(req.body);
    await service.remove(familyId, body.weekStart, body.day, body.mealType);
    return reply.status(204).send();
  });
};

export default mealRoutes;
