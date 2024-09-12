import {
  type inputEditarEquipos,
  type inputEliminarEquipo,
  type inputAgregarEquipo,
  type inputGetEquipo,
  type inputGetEquipos,
} from "@/shared/filters/equipos-filter.schema";
import { Prisma, type PrismaClient } from "@prisma/client";
import { type z } from "zod";

type InputGetAll = z.infer<typeof inputGetEquipos>;
export const getAllEquipos = async (ctx: { db: PrismaClient }, input: InputGetAll) => {
  const { pageIndex, pageSize, searchText } = input;

  const [count, equipos] = await ctx.db.$transaction([
    ctx.db.equipo.count({
      where: {
        OR: [
          {
            observaciones: {
              contains: searchText ?? undefined,
            },
          },
          {
            palabrasClave: {
              contains: searchText ?? undefined,
            },
          },
        ],
      },
    }),
    ctx.db.equipo.findMany({
      include: {
        armario: true,
        estante: true,
        laboratorio: true,
        marca: true,
        estado: true,
        tipo: true,
      },
      orderBy: {
        // [orderBy]: orderDirection,
      },
      skip: parseInt(pageIndex) * parseInt(pageSize),
      take: parseInt(pageSize),
    }),
  ]);

  return {
    count,
    equipos,
  };
};

type InputGetEquipoPorId = z.infer<typeof inputGetEquipo>;
export const getEquipoPorId = async (ctx: { db: PrismaClient }, input: InputGetEquipoPorId) => {
  const { id } = input;

  const equipo = await ctx.db.equipo.findUnique({
    include: {
      armario: true,
      estante: true,
      laboratorio: true,
      marca: true,
      estado: true,
      tipo: true,
    },
    where: {
      id,
    },
  });

  return equipo;
};

type InputAgregarEquipo = z.infer<typeof inputAgregarEquipo>;
export const agregarEquipo = async (ctx: { db: PrismaClient }, input: InputAgregarEquipo, userId: string) => {
  try {
    const equipo = await ctx.db.equipo.create({
      data: {
        observaciones: input.observaciones,
        palabrasClave: input.palabrasClave,
        imagen: input.imagen,

        inventarioId: input.inventarioId,

        modelo: input.modelo,
        numeroSerie: input.numeroSerie,
        usuarioCreadorId: userId,
        usuarioModificadorId: userId,

        tipoId: input.tipoId,
        marcaId: input.marcaId,
        sedeId: input.sedeId,
        laboratorioId: input.laboratorioId,
        armarioId: input.armarioId,
        estanteId: input.estanteId,
        estadoId: input.estadoId,
      },
    });

    return equipo;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new Error("El código de inventario ya existe");
      }
    }

    throw new Error("Error agregando equipo");
  }
};

type InputBorrarEquipo = z.infer<typeof inputEliminarEquipo>;
export const eliminarEquipo = async (ctx: { db: PrismaClient }, input: InputBorrarEquipo) => {
  try {
    const equipo = await ctx.db.equipo.delete({
      where: {
        id: input.id,
      },
    });

    return equipo;
  } catch (error) {
    throw new Error(`Error eliminando equipo ${input.id}`);
  }
};

type InputEditarEquipo = z.infer<typeof inputEditarEquipos>;
export const editarEquipo = async (ctx: { db: PrismaClient }, input: InputEditarEquipo, userId: string) => {
  try {
    const equipo = await ctx.db.equipo.update({
      data: {
        observaciones: input.observaciones,
        palabrasClave: input.palabrasClave,
        imagen: input.imagen,

        inventarioId: input.inventarioId,

        modelo: input.modelo,
        numeroSerie: input.numeroSerie,
        usuarioModificadorId: userId,

        tipoId: input.tipoId,
        marcaId: input.marcaId,
        sedeId: input.sedeId,
        laboratorioId: input.laboratorioId,
        armarioId: input.armarioId,
        estanteId: input.estanteId,
        estadoId: input.estadoId,
      },
      where: {
        id: input.id,
      },
    });

    return equipo;
  } catch (error) {
    throw new Error(`Error modificando equipo ${input.id}`);
  }
};

export const getAllTipos = async (ctx: { db: PrismaClient }) => {
  const tipos = await ctx.db.equipoTipo.findMany({
    orderBy: {
      nombre: "asc",
    },
    select: {
      id: true,
      nombre: true,
    },
  });

  return tipos;
};

export const getAllMarcas = async (ctx: { db: PrismaClient }) => {
  const marcas = await ctx.db.equipoMarca.findMany({
    orderBy: {
      nombre: "asc",
    },
    select: {
      id: true,
      nombre: true,
    },
  });

  return marcas;
};
