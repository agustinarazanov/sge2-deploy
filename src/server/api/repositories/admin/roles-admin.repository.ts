import { construirOrderByDinamico } from "@/shared/dynamic-orderby";
import {
  type inputEditarRol,
  type inputGetRol,
  type inputAgregarRol,
  type inputEliminarRol,
  type inputGetRoles,
} from "@/shared/filters/admin-roles-filter.schema";
import { Prisma, type PrismaClient } from "@prisma/client";
import { type z } from "zod";

type InputGetById = z.infer<typeof inputGetRol>;
export const getRolById = async (ctx: { db: PrismaClient }, input: InputGetById) => {
  const { id } = input;

  const role = await ctx.db.rol.findUnique({
    select: {
      id: true,
      nombre: true,
      usuarios: {
        select: {
          userId: true,
          usuario: {
            select: {
              email: true,
            },
          },
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
      id,
    },
  });

  return role;
};

type InputGetAll = z.infer<typeof inputGetRoles>;
export const getAllRoles = async (ctx: { db: PrismaClient }, input?: InputGetAll) => {
  const { pageIndex, pageSize, searchText, orderDirection, orderBy } = input ?? {};

  const ordenRol: Prisma.RolOrderByWithRelationInput = orderBy
    ? construirOrderByDinamico(orderBy ?? "", orderDirection ?? "")
    : {};

  const filtrosWhereRol: Prisma.RolWhereInput = {
    ...(searchText
      ? {
          nombre: {
            contains: input?.searchText ?? undefined,
            mode: "insensitive",
          },
          ...(!input?.permiso
            ? undefined
            : {
                rolPermiso: {
                  some: {
                    permisoId: input?.permiso ? parseInt(input?.permiso) : undefined,
                  },
                },
              }),
        }
      : {}),
  };

  const [count, roles] = await ctx.db.$transaction([
    ctx.db.rol.count({
      where: filtrosWhereRol,
    }),
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
      where: filtrosWhereRol,
      orderBy: ordenRol,
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

type InputAgregarRol = z.infer<typeof inputAgregarRol>;
export const agregarRol = async (ctx: { db: PrismaClient }, input: InputAgregarRol, userId: string) => {
  // TODO: Se puede mejorar para que lo haga en una sola transacción
  const existeRol = await ctx.db.rol.findUnique({
    where: {
      nombre: input.nombre,
    },
  });

  if (existeRol) {
    throw new Error("El nombre del rol ya existe");
  }

  const rol = await ctx.db.rol.create({
    data: {
      nombre: input.nombre,
      usuarioCreadorId: userId,
      usuarioModificadorId: userId,
      rolPermiso: {
        createMany: {
          data: input.permisos.map((permisoId) => ({
            permisoId: parseInt(permisoId),
            usuarioCreadorId: userId,
          })),
        },
      },
    },
  });

  return rol;
};

type InputEditarRol = z.infer<typeof inputEditarRol>;
export const editarRol = async (ctx: { db: PrismaClient }, input: InputEditarRol, userId: string) => {
  // TODO: Se puede mejorar para que lo haga en una sola transacción
  const existeRol = await ctx.db.rol.findUnique({
    where: {
      nombre: input.nombre,
      NOT: {
        id: input.id,
      },
    },
  });

  if (existeRol) {
    throw new Error("El nombre del rol ya existe");
  }

  const rol = await ctx.db.rol.update({
    data: {
      nombre: input.nombre,
      usuarioModificadorId: userId,
      rolPermiso: {
        deleteMany: {
          rolId: input.id,
        },
        createMany: {
          data: input.permisos.map((permisoId) => ({
            permisoId: parseInt(permisoId),
            usuarioCreadorId: userId,
          })),
        },
      },
    },
    where: {
      id: input.id,
    },
  });

  return rol;
};

export const getAllPermisos = async (ctx: { db: PrismaClient }) => {
  const permisos = await ctx.db.permiso.findMany({
    orderBy: {
      nombre: "asc",
    },
  });

  return permisos;
};
