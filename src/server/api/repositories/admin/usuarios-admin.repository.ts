import { construirOrderByDinamico } from "@/shared/dynamic-orderby";
import {
  type inputGetUsuario,
  type inputEliminarUsuario,
  type inputGetUsuarios,
  type inputEditarUsuario,
  type inputEditarTutor,
  type inputGetTutor,
} from "@/shared/filters/admin-usuarios-filter.schema";
import { type Prisma, type PrismaClient } from "@prisma/client";
import { type z } from "zod";

type InputGetAll = z.infer<typeof inputGetUsuarios>;
export const getAllUsuarios = async (ctx: { db: PrismaClient }, input: InputGetAll) => {
  const { pageIndex, pageSize, searchText, orderDirection, orderBy } = input ?? {};

  const ordenUsuario: Prisma.UserOrderByWithRelationInput = construirOrderByDinamico(
    orderBy ?? "",
    orderDirection ?? "",
  );

  const filtrosWhereUsuario: Prisma.UserWhereInput = {
    ...(searchText
      ? {
          OR: [
            {
              nombre: {
                contains: searchText ?? undefined,
                mode: "insensitive",
              },
            },
            {
              apellido: {
                contains: searchText ?? undefined,
                mode: "insensitive",
              },
            },
            {
              email: {
                contains: searchText ?? undefined,
                mode: "insensitive",
              },
            },
            {
              legajo: {
                contains: searchText ?? undefined,
                mode: "insensitive",
              },
            },
          ],
        }
      : {}),
    ...(input?.rol
      ? {
          usuarioRol: {
            some: {
              rolId: parseInt(input?.rol),
            },
          },
        }
      : {}),
  };

  const [count, usuarios] = await ctx.db.$transaction([
    ctx.db.user.count({
      where: filtrosWhereUsuario,
    }),
    ctx.db.user.findMany({
      include: {
        usuarioRol: {
          include: {
            rol: true,
          },
        },
      },
      where: filtrosWhereUsuario,
      orderBy: ordenUsuario,
      ...(pageIndex && pageSize
        ? {
            skip: parseInt(pageIndex) * parseInt(pageSize),
            take: parseInt(pageSize),
          }
        : {}),
    }),
  ]);

  return {
    count,
    usuarios,
  };
};

type InputEliminarUsuario = z.infer<typeof inputEliminarUsuario>;
export const eliminarUsuario = async (ctx: { db: PrismaClient }, input: InputEliminarUsuario) => {
  try {
    const usuario = await ctx.db.user.update({
      where: {
        id: input.id,
      },
      data: {
        usuarioRol: {
          set: [],
        },
      },
    });

    return usuario;
  } catch (error) {
    throw new Error(`Error eliminando usuario ${input.id}`);
  }
};

type InputGetUsuarioPorId = z.infer<typeof inputGetUsuario>;
export const getUsuarioPorId = async (ctx: { db: PrismaClient }, input: InputGetUsuarioPorId) => {
  const { id } = input;

  const usuario = await ctx.db.user.findUnique({
    include: {
      usuarioRol: {
        include: {
          rol: true,
        },
      },
    },
    where: {
      id,
    },
  });

  return usuario;
};

type InputGetTutorPorId = z.infer<typeof inputGetTutor>;
export const getTutorPorId = async (ctx: { db: PrismaClient }, input: InputGetTutorPorId) => {
  const { id } = input;

  console.log(id);

  return;
};

type InputEditarUsuario = z.infer<typeof inputEditarUsuario>;
export const editarUsuario = async (ctx: { db: PrismaClient }, input: InputEditarUsuario, userId: string) => {
  try {
    const usuario = await ctx.db.$transaction(async (prisma) => {
      const updatedUser = await prisma.user.update({
        data: {
          nombre: input.nombre,
          apellido: input.apellido,
          email: input.email,
          legajo: input.legajo,
          esDocente: input.esDocente,
          esTutor: input.esTutor,
          usuarioRol: {
            deleteMany: {
              userId: input.id,
            },
            createMany: {
              data: input.roles.map((rolId) => ({
                rolId: parseInt(rolId),
                usuarioCreadorId: userId,
              })),
            },
          },
        },
        where: {
          id: input.id,
        },
      });

      if (input.esTutor) {
        await prisma.tutor.upsert({
          where: { userId: input.id },
          create: {
            userId: input.id,
            activo: true,
            diasHorarios: "",
            especialidad: "",
            sede: "",
            usuarioCreadorId: userId,
          },
          update: {},
        });
      } else {
        // buscar si existe un tutor, si no existe no hacer nada, si existe eliminarlo
        const tutor = await prisma.tutor.findUnique({
          where: { userId: input.id },
        });
        if (tutor) {
          await prisma.tutor.delete({
            where: { userId: input.id },
          });
        }
      }

      return updatedUser;
    });

    return usuario;
  } catch (error) {
    console.error(error);
    throw new Error(`Error modificando usuario ${input.id}`);
  }
};

type InputEditarTutor = z.infer<typeof inputEditarTutor>;
export const editarTutor = async (ctx: { db: PrismaClient }, input: InputEditarTutor) => {
  try {
    const tutorActualizado = await ctx.db.tutor.update({
      data: {
        diasHorarios: input.diasHorarios,
        sede: input.sede,
        especialidad: input.especialidad,
      },
      where: {
        userId: input.id,
      },
    });

    return tutorActualizado;
  } catch (error) {
    throw new Error(`Error modificando tutor con ID ${input.id}`);
  }
};

export const getAllTutores = async (ctx: { db: PrismaClient }) => {
  const tutores = await ctx.db.tutor.findMany({
    include: {
      usuario: true,
    },
  });

  return tutores;
};

export const getAllTutoresEspecialidades = async (ctx: { db: PrismaClient }) => {
  const modelos = await ctx.db.tutor.findMany({
    orderBy: {
      especialidad: "asc",
    },
    select: {
      especialidad: true,
    },
    distinct: ["especialidad"],
    where: {
      especialidad: {
        not: "",
      },
    },
  });

  const modelosMapped = modelos.map(({ especialidad }) => especialidad);

  return modelosMapped;
};

type InputEliminarTutor = z.infer<typeof inputEliminarUsuario>;
export const eliminarTutor = async (ctx: { db: PrismaClient }, input: InputEliminarTutor) => {
  try {
    const tutor = await ctx.db.user.delete({
      where: {
        id: input.id,
      },
    });

    return tutor;
  } catch (error) {
    throw new Error(`Error eliminando tutor ${input.id}`);
  }
};

export const getAllProfesores = async (ctx: { db: PrismaClient }) => {
  return await ctx.db.user.findMany({
    select: {
      id: true,
      nombre: true,
      apellido: true,
    },
    where: {
      esDocente: true,
    },
  });
};
