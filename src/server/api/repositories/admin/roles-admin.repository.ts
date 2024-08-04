import { type inputGetRoles } from "@/shared/filters/admin-roles-filter.schema";
import { type PrismaClient } from "@prisma/client";
import { type z } from "zod";

type InputGetAll = z.infer<typeof inputGetRoles>;
export const getAllRoles = async (ctx: { db: PrismaClient }, input: InputGetAll) => {
  const { searchText, orderBy, orderDirection } = input;

  const [count, roles] = await ctx.db.$transaction([
    ctx.db.rol.count(),
    ctx.db.rol.findMany({
      include: {
        usuarios: true,
        rolPermiso: {
          include: {
            permiso: true,
          },
        },
      },
      where: {
        nombre: {
          contains: searchText ?? undefined,
        },
      },
      orderBy: {
        nombre: orderDirection,
      },
    }),
  ]);

  return {
    count,
    roles,
  };
};
