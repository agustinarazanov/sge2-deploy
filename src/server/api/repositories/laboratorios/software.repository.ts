import type {
  inputAddSoftware,
  inputEditarSoftware,
  inputEliminarSoftware,
  inputGetSoftware,
} from "@/shared/filters/laboratorio-filter.schema";
import { type PrismaClient } from "@prisma/client";
import { type z } from "zod";

export const getAllSoftware = async (ctx: { db: PrismaClient }) => {
  const softwares = await ctx.db.software.findMany({
    include: {
      laboratorios: {
        include: {
          laboratorio: {
            select: {
              id: true,
              nombre: true,
            },
          },
        },
      },
    },
    orderBy: {
      nombre: "asc",
    },
  });

  return softwares;
};

type InputGetSoftware = z.infer<typeof inputGetSoftware>;
export const getSoftwarePorId = async (ctx: { db: PrismaClient }, input: InputGetSoftware) => {
  const { id } = input;

  const software = await ctx.db.software.findUnique({
    where: {
      id,
    },
    include: {
      laboratorios: {
        include: {
          laboratorio: {
            select: {
              id: true,
              nombre: true,
            },
          },
        },
      },
    },
  });

  return software;
};

type InputEditarSoftware = z.infer<typeof inputEditarSoftware>;
export const editarSoftware = async (ctx: { db: PrismaClient }, input: InputEditarSoftware, userId: string) => {
  const { id } = input;

  try {
    const software = await ctx.db.software.update({
      where: {
        id,
      },
      data: {
        nombre: input.nombre,
        version: input.version,
        estado: input.estado,
        laboratorios: {
          deleteMany: {},
          createMany: {
            data: input.laboratorios.map((laboratorioId) => ({
              laboratorioId: parseInt(laboratorioId),
              usuarioCreadorId: userId,
            })),
          },
        },

        usuarioModificadorId: userId,
      },
    });

    return software;
  } catch (error) {
    throw new Error(`Error modificando software ${input.id}`);
  }
};

type InputAddSoftware = z.infer<typeof inputAddSoftware>;
export const agregarSoftware = async (ctx: { db: PrismaClient }, input: InputAddSoftware, userId: string) => {
  try {
    const software = await ctx.db.software.create({
      data: {
        nombre: input.nombre,
        version: input.version,
        estado: input.estado,
        laboratorios: {
          createMany: {
            data: input.laboratorios.map((laboratorioId) => ({
              laboratorioId: parseInt(laboratorioId),
              usuarioCreadorId: userId,
            })),
          },
        },

        usuarioCreadorId: userId,
        usuarioModificadorId: userId,
      },
    });

    return software;
  } catch (error) {
    throw new Error(`Error agregando software`);
  }
};

type InputEliminarSoftware = z.infer<typeof inputEliminarSoftware>;
export const eliminarSoftware = async (ctx: { db: PrismaClient }, input: InputEliminarSoftware) => {
  try {
    const software = await ctx.db.software.delete({
      where: {
        id: input.id,
      },
    });

    return software;
  } catch (error) {
    throw new Error(`Error eliminando software ${input.id}`);
  }
};
