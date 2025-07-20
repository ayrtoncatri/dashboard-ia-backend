import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function procesosRoutes(fastify: FastifyInstance) {
  // GET /api/procesos
  fastify.get('/', async (_, reply) => {
    const procesos = await prisma.proceso.findMany();
    reply.send(procesos);
  });

  // POST /api/procesos
  fastify.post('/', async (request, reply) => {
    const { nombre, descripcion, estado, fecha, responsable } = request.body as any;
    const nuevo = await prisma.proceso.create({
      data: { nombre, descripcion, estado, fecha: new Date(fecha), responsable }
    });
    reply.code(201).send(nuevo);
  });

  // PUT /api/procesos/:id
  fastify.put('/:id', async (request, reply) => {
    const { id } = request.params as any;
    const { nombre, descripcion, estado, fecha, responsable } = request.body as any;
    const actualizado = await prisma.proceso.update({
      where: { id },
      data: { nombre, descripcion, estado, fecha: new Date(fecha), responsable }
    });
    reply.send(actualizado);
  });

  // DELETE /api/procesos/:id
  fastify.delete('/:id', async (request, reply) => {
    const { id } = request.params as any;
    await prisma.proceso.delete({ where: { id } });
    reply.code(204).send();
  });

  // GET /api/procesos/:id
  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params as any;
    const proceso = await prisma.proceso.findUnique({ where: { id } });
    reply.send(proceso);
  });
}

export default procesosRoutes;
