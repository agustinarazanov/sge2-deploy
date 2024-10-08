import type {
  inputGetArmarios,
  inputGetEstantes,
  inputAgregarLaboratorio,
  inputEditarLaboratorio,
  inputEliminarLaboratorio,
  inputGetLaboratorio,
  inputGetLaboratorios,
} from "@/shared/filters/admin-laboratorios-filter.schema";
import { Prisma, type PrismaClient } from "@prisma/client";
import { type z } from "zod";
import { obtenerTodasLasReservasEnHorario } from "../reservas/laboratorioEnUso.repository";

type InputGetAll = z.infer<typeof inputGetLaboratorios>;
export const getAllLaboratorios = async (ctx: { db: PrismaClient }, input: InputGetAll) => {
  console.log(input);

  const { searchText, sedeId, notificarOcupados } = input;

  if (notificarOcupados && input.fechaHoraInicio && input.fechaHoraFin) {
    const res = await obtenerTodasLasReservasEnHorario(ctx, {
      fechaHoraFin: input.fechaHoraFin,
      fechaHoraInicio: input.fechaHoraInicio,
      excepcionReservaId: input.excepcionReservaId,
      searchText,
      sedeId: sedeId ? Number(sedeId) : undefined,
    });

    return {
      count: res.length,
      laboratorios: res,
    };
  }

  const laboratorios = await ctx.db.laboratorio.findMany({
    include: {
      armarios: {
        select: {
          id: true,
          nombre: true,
        },
      },
      sede: {
        select: {
          id: true,
          nombre: true,
        },
      },
    },
    where: {
      nombre: {
        contains: searchText ?? undefined,
        mode: "insensitive",
      },
      ...(sedeId !== undefined && sedeId !== null
        ? {
            sedeId: Number(sedeId),
          }
        : {}),
    },
  });

  return {
    count: laboratorios.length,
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
        esReservable: input.esReservable,
        tienePc: input.tienePc,

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
        esReservable: input.esReservable,

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

export const getAllSedes = async (ctx: { db: PrismaClient }) => {
  const sedes = await ctx.db.sede.findMany({
    select: {
      id: true,
      nombre: true,
    },
    orderBy: {
      nombre: "asc",
    },
  });

  return sedes;
};

type InputGetAllArmarios = z.infer<typeof inputGetArmarios>;
export const getAllArmarios = async (ctx: { db: PrismaClient }, input: InputGetAllArmarios) => {
  const { laboratorioId } = input;

  const armarios = await ctx.db.armario.findMany({
    select: {
      id: true,
      nombre: true,
    },
    where: {
      laboratorioId,
    },
    orderBy: {
      nombre: "asc",
    },
  });

  return armarios;
};

type InputGetAllEstantes = z.infer<typeof inputGetEstantes>;
export const getAllEstantes = async (ctx: { db: PrismaClient }, input: InputGetAllEstantes) => {
  const { armarioId } = input;

  const estantes = await ctx.db.estante.findMany({
    select: {
      id: true,
      nombre: true,
    },
    where: {
      armarioId,
    },
    orderBy: {
      nombre: "asc",
    },
  });

  return estantes;
};
