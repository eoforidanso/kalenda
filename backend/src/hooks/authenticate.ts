import { FastifyRequest, FastifyReply } from 'fastify';

/** Drop-in preHandler that verifies the JWT access token. */
export async function authenticate(req: FastifyRequest, reply: FastifyReply) {
  try {
    await req.jwtVerify();
    if ((req.user as any).type !== 'access') {
      return reply.status(401).send({ success: false, error: 'Invalid token type' });
    }
  } catch {
    return reply.status(401).send({ success: false, error: 'Unauthorized' });
  }
}
