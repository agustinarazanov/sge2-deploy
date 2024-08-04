import { type inputGetUsuarios } from "@/shared/filters/admin-usuarios-filter.schema";
import { type PrismaClient } from "@prisma/client";
import { type z } from "zod";

type InputGetAll = z.infer<typeof inputGetUsuarios>;
export const getAllUsuarios = async (ctx: { db: PrismaClient }, input: InputGetAll) => {
  const { pageIndex, pageSize, searchText, orderBy, orderDirection } = input;

  const [count, usuarios] = await ctx.db.$transaction([
    ctx.db.user.count(),
    ctx.db.user.findMany({
      include: {
        usuarioRol: {
          include: {
            rol: true,
          },
        },
      },
      where: {
        nombre: {
          contains: searchText ?? undefined,
        },
        apellido: {
          contains: searchText ?? undefined,
        },
        email: {
          contains: searchText ?? undefined,
        },
        legajo: {
          contains: searchText ?? undefined,
        },
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
    usuarios,
  };
};
