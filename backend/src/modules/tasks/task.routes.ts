import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { TaskService } from './task.service';
import { authenticate } from '../../hooks/authenticate';
import { ok, paginated } from '../../shared/api-response';
import { TaskCategory } from './task.entity';
import { notifyFamily } from '../../shared/notify-family';
import { NotificationType } from '../notifications/notification.entity';

const taskCategoryEnum = z.nativeEnum(TaskCategory);

const createTaskSchema = z.object({
  title:          z.string().min(1).max(255),
  category:       taskCategoryEnum.optional(),
  assignedToName: z.string().max(100).optional(),
  stars:          z.number().int().min(1).max(5).optional(),
  icon:           z.string().max(10).optional(),
  isRecurring:    z.boolean().optional(),
  recurrenceRule: z.string().max(500).optional(),
});

const updateTaskSchema = createTaskSchema.partial().extend({
  done: z.boolean().optional(),
});

function requireFamily(req: any) {
  if (!req.user.familyId) throw Object.assign(new Error('No family associated'), { statusCode: 403 });
  return req.user.familyId as string;
}

const taskRoutes: FastifyPluginAsync = async (fastify) => {
  const service = new TaskService(fastify.db);

  fastify.get('/', { preHandler: [authenticate] }, async (req) => {
    const familyId = requireFamily(req);
    const { assignedToName, category, page, limit } = req.query as {
      assignedToName?: string; category?: TaskCategory; page?: number; limit?: number;
    };
    const r = await service.list(familyId, assignedToName, category, page, limit);
    return paginated(r.data, r.total, r.page, r.limit);
  });

  fastify.post('/', { preHandler: [authenticate] }, async (req, reply) => {
    const familyId = requireFamily(req);
    const body = createTaskSchema.parse(req.body);
    return reply.status(201).send(ok(await service.create(familyId, body)));
  });

  fastify.patch('/:id', { preHandler: [authenticate] }, async (req) => {
    const familyId = requireFamily(req);
    const { id }   = req.params as { id: string };
    const body = updateTaskSchema.parse(req.body);
    const task = await service.update(id, familyId, body);
    // Notify family when a task is completed
    if (body.done === true) {
      notifyFamily(fastify.db, familyId, req.user.sub, NotificationType.CHORES, '✅',
        'Task completed!', `"${task.title}" was marked as done.`, { taskId: task.id }).catch(() => {});
    }
    return ok(task);
  });

  fastify.delete('/:id', { preHandler: [authenticate] }, async (req, reply) => {
    const familyId = requireFamily(req);
    const { id }   = req.params as { id: string };
    await service.remove(id, familyId);
    return reply.status(204).send();
  });
};

export default taskRoutes;
