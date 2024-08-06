import {
  type inputAgregarLaboratorio,
  type inputEditarLaboratorio,
  type inputEliminarLaboratorio,
  type inputGetLaboratorio,
  type inputGetLaboratorios,
} from "@/shared/filters/admin-laboratorios-filter.schema";
import { Prisma, type PrismaClient } from "@prisma/client";
import { type z } from "zod";

type InputGetAll = z.infer<typeof inputGetLaboratorios>;
export const getAllLaboratorios = async (ctx: { db: PrismaClient }, input: InputGetAll) => {
  const { searchText } = input;

  const [count, laboratorios] = await ctx.db.$transaction([
    ctx.db.laboratorio.count(),
    ctx.db.laboratorio.findMany({
      include: {
        armarios: true,
        equipos: true,
        libros: true,
        sede: true,
      },
      where: {
        nombre: {
          contains: searchText ?? undefined,
          mode: "insensitive",
        },
      },
    }),
  ]);

  return {
    count,
    laboratorios,
  };
};

type InputGetLaboratorioPorId = z.infer<typeof inputGetLaboratorio>;
export const getLaboratorioPorId = async (ctx: { db: PrismaClient }, input: InputGetLaboratorioPorId) => {
  const { id } = input;

  const laboratorio = await ctx.db.laboratorio.findUnique({
    include: {
      armarios: {
        include: {
          estantes: true,
        },
      },
      sede: true,
    },
    where: {
      id,
    },
  });

  return laboratorio;
};

type InputEliminarLaboratorio = z.infer<typeof inputEliminarLaboratorio>;
export const eliminarLaboratorio = async (ctx: { db: PrismaClient }, input: InputEliminarLaboratorio) => {
  try {
    const laboratorio = await ctx.db.laboratorio.delete({
      where: {
        id: input.id,
      },
    });

    return laboratorio;
  } catch (error) {
    throw new Error(`Error eliminando laboratorio ${input.id}`);
  }
};

type InputEditarLaboratorio = z.infer<typeof inputEditarLaboratorio>;
export const editarLaboratorio = async (ctx: { db: PrismaClient }, input: InputEditarLaboratorio, userId: string) => {
  try {
    const laboratorio = await ctx.db.laboratorio.update({
      data: {
        nombre: input.nombre,
        sedeId: parseInt(input.sedeId),
        esAbierto: input.esAbierto,

        usuarioModificadorId: userId,
      },
      where: {
        id: input.id,
      },
    });

    return laboratorio;
  } catch (error) {
    throw new Error(`Error modificando laboratorio ${input.id}`);
  }
};

type InputAgregarLaboratorio = z.infer<typeof inputAgregarLaboratorio>;
export const agregarLaboratorio = async (ctx: { db: PrismaClient }, input: InputAgregarLaboratorio, userId: string) => {
  try {
    const laboratorio = await ctx.db.laboratorio.create({
      data: {
        nombre: input.nombre,
        sedeId: parseInt(input.sedeId),
        esAbierto: input.esAbierto,

        usuarioCreadorId: userId,
        usuarioModificadorId: userId,
      },
    });

    return laboratorio;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new Error("El código de laboratorio ya existe");
      }
    }

    throw new Error("Error agregando laboratorio");
  }
};
