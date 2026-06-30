import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { AuthService } from './auth.service';
import { authenticate } from '../../hooks/authenticate';

const registerSchema = z.object({
  name:       z.string().min(1).max(100),
  email:      z.string().email().max(254),
  password:   z.string().min(12).max(128)
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  familyName: z.string().min(1).max(100).optional(),
});

const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

const googleSchema = z.object({
  accessToken: z.string().min(1),
});

const authRoutes: FastifyPluginAsync = async (fastify) => {
  const service = new AuthService(fastify.db);

  fastify.post('/register', {
    config: { rateLimit: { max: 5, timeWindow: '1 hour' } },
  }, async (req, reply) => {
    const body   = registerSchema.parse(req.body);
    const result = await service.register(body);
    return reply.status(201).send({ success: true, data: result });
  });

  fastify.post('/login', {
    config: { rateLimit: { max: 10, timeWindow: '15 minutes' } },
  }, async (req, reply) => {
    const body   = loginSchema.parse(req.body);
    const result = await service.login(body);
    return reply.send({ success: true, data: result });
  });

  fastify.post('/refresh', {
    config: { rateLimit: { max: 20, timeWindow: '15 minutes' } },
  }, async (req, reply) => {
    const { refreshToken } = refreshSchema.parse(req.body);
    const result = await service.refresh(refreshToken);
    return reply.send({ success: true, data: result });
  });

  fastify.post('/google', {
    config: { rateLimit: { max: 20, timeWindow: '15 minutes' } },
  }, async (req, reply) => {
    const { idToken } = googleSchema.parse(req.body);
    const result = await service.googleLogin(idToken);
    return reply.send({ success: true, data: result });
  });

  fastify.post('/logout', { preHandler: [authenticate] }, async (req, reply) => {
    await service.logout(req.user.sub);
    return reply.send({ success: true, data: null });
  });
};

export default authRoutes;
