import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { AuthService } from './auth.service';
import { authenticate } from '../../hooks/authenticate';

const registerSchema = z.object({
  name:       z.string().min(1).max(100),
  email:      z.string().email(),
  password:   z.string().min(8),
  familyName: z.string().min(1).max(100).optional(),
});

const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
});

const authRoutes: FastifyPluginAsync = async (fastify) => {
  const service = new AuthService(fastify.db);

  fastify.post('/register', async (req, reply) => {
    const body   = registerSchema.parse(req.body);
    const result = await service.register(body);
    return reply.status(201).send({ success: true, data: result });
  });

  fastify.post('/login', async (req, reply) => {
    const body   = loginSchema.parse(req.body);
    const result = await service.login(body);
    return reply.send({ success: true, data: result });
  });

  fastify.post('/refresh', async (req, reply) => {
    const { refreshToken } = req.body as { refreshToken?: string };
    if (!refreshToken) return reply.status(400).send({ success: false, error: 'refreshToken required' });
    const result = await service.refresh(refreshToken);
    return reply.send({ success: true, data: result });
  });

  fastify.post('/logout', { preHandler: [authenticate] }, async (req, reply) => {
    await service.logout(req.user.sub);
    return reply.send({ success: true, data: null });
  });
};

export default authRoutes;
