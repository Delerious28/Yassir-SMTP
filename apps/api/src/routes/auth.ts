import { FastifyPluginAsync } from 'fastify';
import bcrypt from 'bcryptjs';
import { loginSchema } from '@yassir/shared';

export const authRoutes: FastifyPluginAsync = async (app) => {
  app.post('/login', { schema: { body: loginSchema } }, async (request, reply) => {
    const { email, password } = loginSchema.parse(request.body);
    const user = await app.prisma.user.findUnique({ where: { email } });
    if (!user) {
      return reply.code(401).send({ message: 'Invalid credentials' });
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return reply.code(401).send({ message: 'Invalid credentials' });
    }
    const token = app.jwt.sign({ userId: user.id, email: user.email });
    return { token };
  });
};
