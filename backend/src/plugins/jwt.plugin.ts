import fp from 'fastify-plugin';
import { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';
import fjwt from '@fastify/jwt';
import { env } from '../config/env';

export interface JwtPayload {
  sub: string;
  email: string;
  familyId: string | null;
  type: 'access' | 'refresh';
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: JwtPayload;
    user: JwtPayload;
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

const jwtPlugin: FastifyPluginAsync = async (fastify) => {
  await fastify.register(fjwt, { secret: env.JWT_ACCESS_SECRET });

  fastify.decorate('authenticate', async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      await req.jwtVerify();
      if (req.user.type !== 'access') {
        return reply.status(401).send({ success: false, error: 'Invalid token type' });
      }
    } catch {
      return reply.status(401).send({ success: false, error: 'Unauthorized' });
    }
  });
};

export default fp(jwtPlugin, { name: 'jwt' });
