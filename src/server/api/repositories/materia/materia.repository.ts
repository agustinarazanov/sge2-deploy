import { type PrismaClient } from "@prisma/client";

export const getAllMaterias = async (ctx: { db: PrismaClient }) => {
  const materias = await ctx.db.materia.findMany({
    select: {
      id: true,
      nombre: true,
      codigo: true,
      anio: true,
    },
    orderBy: [
      {
        nombre: "asc",
      },
      {
        anio: "asc",
      },
    ],
  });

  return materias;
};
