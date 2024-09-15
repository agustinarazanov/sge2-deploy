import { type PrismaClient } from "@prisma/client";

export const getAllDivisiones = async (ctx: { db: PrismaClient }) => {
  return await ctx.db.division.findMany({
    select: {
      id: true,
      nombre: true,
      anio: true,
    },
    orderBy: {
      nombre: "asc",
    },
  });
};
