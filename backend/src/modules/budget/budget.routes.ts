import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { TransactionService } from './transaction.service';
import { TransactionType } from './transaction.entity';
import { authenticate } from '../../hooks/authenticate';
import { ok, paginated } from '../../shared/api-response';

const createTxnSchema = z.object({
  type:     z.nativeEnum(TransactionType),
  label:    z.string().min(1).max(255),
  /** Amount in the family currency — stored as integer cents server-side */
  amount:   z.number().positive().max(1_000_000),
  category: z.string().min(1).max(100),
  who:      z.string().max(100).optional(),
  date:     z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
});

function requireFamily(req: any) {
  if (!req.user.familyId) throw Object.assign(new Error('No family associated'), { statusCode: 403 });
  return req.user.familyId as string;
}

const budgetRoutes: FastifyPluginAsync = async (fastify) => {
  const service = new TransactionService(fastify.db);

  fastify.get('/transactions', { preHandler: [authenticate] }, async (req) => {
    const familyId = requireFamily(req);
    const { page, limit } = req.query as { page?: number; limit?: number };
    const r = await service.list(familyId, page, limit);
    return paginated(r.data, r.total, r.page, r.limit);
  });

  fastify.post('/transactions', { preHandler: [authenticate] }, async (req, reply) => {
    const familyId = requireFamily(req);
    const body = createTxnSchema.parse(req.body);
    const dto = {
      ...body,
      amountCents: Math.round(body.amount * 100),
    };
    return reply.status(201).send(ok(await service.create(familyId, dto)));
  });

  fastify.delete('/transactions/:id', { preHandler: [authenticate] }, async (req, reply) => {
    const familyId = requireFamily(req);
    const { id }   = req.params as { id: string };
    await service.remove(id, familyId);
    return reply.status(204).send();
  });
};

export default budgetRoutes;
