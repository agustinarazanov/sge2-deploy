import { type inputEliminarRol, type inputGetRoles } from "@/shared/filters/admin-roles-filter.schema";
import { type PrismaClient } from "@prisma/client";
import { type z } from "zod";

type InputGetAll = z.infer<typeof inputGetRoles>;
export const getAllRoles = async (ctx: { db: PrismaClient }, input: InputGetAll) => {
  const { searchText, orderBy, orderDirection } = input;

  const [count, roles] = await ctx.db.$transaction([
    ctx.db.rol.count(),
    ctx.db.rol.findMany({
      select: {
        id: true,
        nombre: true,
        fechaCreacion: true,
        usuarios: {
          select: {
            userId: true,
          },
        },
        rolPermiso: {
          select: {
            permisoId: true,
            permiso: {
              select: {
                nombre: true,
              },
            },
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

type InputEliminarRol = z.infer<typeof inputEliminarRol>;
export const eliminarRol = async (ctx: { db: PrismaClient }, input: InputEliminarRol) => {
  try {
    const role = await ctx.db.rol.delete({
      where: {
        id: input.id,
      },
    });

    return role;
  } catch (error) {
    throw new Error(`Error eliminando rol ${input.id}`);
  }
};

export const getAllPermisos = async (ctx: { db: PrismaClient }) => {
  const permisos = await ctx.db.permiso.findMany({
    orderBy: {
      nombre: "asc",
    },
  });

  return permisos;
};
