import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import multipart from '@fastify/multipart';
import staticFiles from '@fastify/static';
import path from 'path';
import { ZodError } from 'zod';
import { env } from './config/env';
import typeormPlugin from './plugins/typeorm.plugin';
import jwtPlugin from './plugins/jwt.plugin';
import swaggerPlugin from './plugins/swagger.plugin';
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/user.routes';
import familyRoutes from './modules/family/family.routes';
import eventRoutes from './modules/events/event.routes';
import taskRoutes from './modules/tasks/task.routes';
import listRoutes from './modules/lists/list.routes';
import photoRoutes from './modules/photos/photo.routes';
import notificationRoutes from './modules/notifications/notification.routes';
import budgetRoutes from './modules/budget/budget.routes';
import mealRoutes from './modules/meals/meal.routes';
import paymentRoutes from './modules/payments/payment.routes';

export async function buildApp() {
  const app = Fastify({
    logger: {
      transport:
        env.NODE_ENV === 'development'
          ? { target: 'pino-pretty', options: { colorize: true } }
          : undefined,
    },
  });

  // ── Plugins ──────────────────────────────────────────────────
  await app.register(helmet, {
    // CSP only in production — dev tools break with strict CSP
    contentSecurityPolicy: env.NODE_ENV === 'production',
  });
  await app.register(rateLimit, {
    max: 120,
    timeWindow: '1 minute',
    errorResponseBuilder: () => ({ success: false, error: 'Too many requests — please slow down.' }),
  });
  await app.register(cors, { origin: env.CORS_ORIGIN, credentials: true });
  await app.register(multipart, {
    limits: { fileSize: 52_428_800 }, // 50 MB
  });
  await app.register(staticFiles, {
    root: path.resolve(env.UPLOADS_DIR),
    prefix: '/uploads/',
    decorateReply: false,
  });
  await app.register(typeormPlugin);
  await app.register(jwtPlugin);
  await app.register(swaggerPlugin);

  // ── Global error handler ─────────────────────────────────────
  app.setErrorHandler((error: any, _req: FastifyRequest, reply: FastifyReply) => {
    if (error instanceof ZodError) {
      return reply.status(400).send({ success: false, error: 'Validation error', issues: error.issues });
    }
    const status = error.statusCode ?? error.status ?? 500;
    if (status >= 500) app.log.error(error);
    return reply.status(status).send({ success: false, error: error.message ?? 'Internal server error' });
  });

  // ── Routes ───────────────────────────────────────────────────
  const V1 = '/api/v1';
  await app.register(authRoutes,         { prefix: `${V1}/auth` });
  await app.register(userRoutes,         { prefix: `${V1}/users` });
  await app.register(familyRoutes,       { prefix: `${V1}/families` });
  await app.register(eventRoutes,        { prefix: `${V1}/events` });
  await app.register(taskRoutes,         { prefix: `${V1}/tasks` });
  await app.register(listRoutes,         { prefix: `${V1}/lists` });
  await app.register(photoRoutes,        { prefix: `${V1}/photos` });
  await app.register(notificationRoutes, { prefix: `${V1}/notifications` });
  await app.register(budgetRoutes,       { prefix: `${V1}/budget` });
  await app.register(mealRoutes,         { prefix: `${V1}/meals` });
  await app.register(paymentRoutes,      { prefix: `${V1}/payments` });

  app.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }));

  return app;
}
