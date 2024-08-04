import { type inputGetLaboratorios } from "@/shared/filters/admin-laboratorios-filter.schema";
import { type PrismaClient } from "@prisma/client";
import { type z } from "zod";

type InputGetAll = z.infer<typeof inputGetLaboratorios>;
export const getAllLaboratorios = async (ctx: { db: PrismaClient }, input: InputGetAll) => {
  const { pageIndex, pageSize, searchText, orderBy, orderDirection } = input;

  const [count, laboratorios] = await ctx.db.$transaction([
    ctx.db.laboratorio.count(),
    ctx.db.laboratorio.findMany({
      include: {
        armarios: true,
        equipos: true,
        libros: true,
        sede: true,
      },
      orderBy: {
        nombre: orderDirection,
      },
      skip: parseInt(pageIndex) * parseInt(pageSize),
      take: parseInt(pageSize),
    }),
  ]);

  return {
    count,
    laboratorios,
  };
};
