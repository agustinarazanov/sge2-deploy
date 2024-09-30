import { Prisma, type PrismaClient } from "@prisma/client";
import { type z } from "zod";
import {
  type inputAgregarTipo,
  type inputEditarTipo,
  type inputEliminarTipo,
  type inputGetTipo,
  type inputGetTipos,
} from "@/shared/filters/equipos-tipos-filter.schema";

type InputBorrarTipo = z.infer<typeof inputEliminarTipo>;
export const eliminarTipo = async (ctx: { db: PrismaClient }, input: InputBorrarTipo) => {
  try {
    const tipo = await ctx.db.equipoTipo.delete({
      where: {
        id: input.id,
      },
    });

    return tipo;
  } catch (error) {
    throw new Error(`Error eliminando tipo ${input.id}`);
  }
};

type InputGetTipoPorId = z.infer<typeof inputGetTipo>;
export const getTipoPorId = async (ctx: { db: PrismaClient }, input: InputGetTipoPorId) => {
  const { id } = input;

  const tipo = await ctx.db.equipoTipo.findUnique({
    select: {
      id: true,
      nombre: true,
      imagen: true,
      fechaCreacion: true,
      usuarioCreadorId: true,
    },
    where: {
      id,
    },
  });

  return tipo;
};

type InputTipoGetAll = z.infer<typeof inputGetTipos>;
export const getAllTipos = async (ctx: { db: PrismaClient }, input: InputTipoGetAll) => {
  const { pageIndex, pageSize, orderDirection, searchText, fromFilter } = input;

  const [count, tipos] = await ctx.db.$transaction([
    ctx.db.equipoTipo.count(),
    ctx.db.equipoTipo.findMany({
      select: {
        id: true,
        nombre: true,
        imagen: true,
        fechaCreacion: true,
        usuarioCreadorId: true,
        equipos: {
          select: {
            id: true,
          },
        },
      },
      where: {
        nombre: {
          contains: searchText ?? undefined,
          mode: "insensitive",
        },
      },
      orderBy: {
        nombre: orderDirection,
      },
      skip: fromFilter === "false" ? parseInt(pageIndex) * parseInt(pageSize) : undefined,
      take: fromFilter === "false" ? parseInt(pageSize) : undefined,
    }),
  ]);

  return {
    count,
    tipos,
  };
};

type InputEditarTipo = z.infer<typeof inputEditarTipo>;
export const editarTipo = async (ctx: { db: PrismaClient }, input: InputEditarTipo, _userId: string) => {
  try {
    const tipo = await ctx.db.equipoTipo.update({
      data: {
        nombre: input.nombre,
        imagen: input.imagen,
      },
      where: {
        id: input.id,
      },
    });

    return tipo;
  } catch (error) {
    throw new Error(`Error modificando tipo ${input.id}`);
  }
};

type InputAgregarTipo = z.infer<typeof inputAgregarTipo>;
export const agregarTipo = async (ctx: { db: PrismaClient }, input: InputAgregarTipo, userId: string) => {
  try {
    const nuevoTipo = await ctx.db.$transaction(async (tx) => {
      const existeTipo = await ctx.db.equipoTipo.findFirst({
        where: {
          nombre: {
            equals: input.nombre,
            mode: "insensitive",
          },
        },
      });

      if (existeTipo) {
        throw new Error("El nombre del tipo ya existe");
      }

      const tipo = await tx.equipoTipo.create({
        data: {
          nombre: input.nombre,
          imagen: input.imagen,
          usuarioCreadorId: userId,
        },
      });

      return tipo;
    });

    return nuevoTipo;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new Error("Ocurrió un error al agregar el tipo, intente agregarlo de nuevo");
      }
    }

    throw new Error("Error agregando tipo");
  }
};
