import {
  type inputEditarEquipos,
  type inputEliminarEquipo,
  type inputAgregarEquipo,
  type inputGetEquipo,
  type inputGetEquipos,
} from "@/shared/filters/equipos-filter.schema";
import { Prisma, type PrismaClient } from "@prisma/client";
import { type z } from "zod";
import { generarEquipoInventarioId, getUltimoEquipoInventarioId } from "./generador-inventario-id";
import {
  type inputAgregarTipo,
  type inputEditarTipo,
  type inputEliminarTipo,
  type inputGetTipo,
  type inputGetTipos,
} from "@/shared/filters/equipos-tipos-filter.schema";

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
    const nuevoEquipo = await ctx.db.$transaction(async (tx) => {
      const ultimoInventarioId = await getUltimoEquipoInventarioId({ db: tx });

      const equipo = await tx.equipo.create({
        data: {
          observaciones: input.observaciones,
          palabrasClave: input.palabrasClave,
          imagen: input.imagen,

          inventarioId: generarEquipoInventarioId(ultimoInventarioId + 1),

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
    });

    return nuevoEquipo;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new Error("Ocurrió un error al agregar el equipo, intente agregarlo de nuevo");
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
  const { orderDirection, searchText } = input;

  const [count, tipos] = await ctx.db.$transaction([
    ctx.db.equipoTipo.count(),
    ctx.db.equipoTipo.findMany({
      select: {
        id: true,
        nombre: true,
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
    }),
  ]);

  return {
    count,
    tipos,
  };
};

type InputEditarTipo = z.infer<typeof inputEditarTipo>;
export const editarTipo = async (ctx: { db: PrismaClient }, input: InputEditarTipo, userId: string) => {
  try {
    const tipo = await ctx.db.equipoTipo.update({
      data: {
        nombre: input.nombre,
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
        //TODO: ver porque no acepta findUnique
        where: {
          nombre: input.nombre,
        },
      });

      if (existeTipo) {
        throw new Error("El nombre del tipo ya existe");
      }

      const tipo = await tx.equipoTipo.create({
        data: {
          nombre: input.nombre,
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

export const getAllEstados = async (ctx: { db: PrismaClient }) => {
  const estados = await ctx.db.equipoEstado.findMany({
    orderBy: {
      nombre: "asc",
    },
    select: {
      id: true,
      nombre: true,
    },
  });

  return estados;
};
