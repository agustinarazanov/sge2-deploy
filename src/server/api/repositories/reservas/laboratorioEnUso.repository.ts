import { type PrismaClient, type Prisma, ReservaEstatus } from "@prisma/client";
import type { DefaultArgs } from "@prisma/client/runtime/library";
import { getErrorLaboratorioOcupado } from "../../services/helper";
import { type inputGetReservasExistentesDeLaboratorio } from "@/shared/filters/laboratorio-en-uso.schema";
import { type z } from "zod";

type InputEstaEnUso = z.infer<typeof inputGetReservasExistentesDeLaboratorio>;
export const obtenerReservasExistentesDeLaboratorio = async (
  ctx: {
    db: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
    >;
  },
  input: InputEstaEnUso,
) => {
  const fechaHoraInicio = input.fechaHoraInicio;
  const fechaHoraFin = input.fechaHoraFin;

  const reservasExistentes = await ctx.db.reserva.findMany({
    where: {
      tipo: {
        in: ["LABORATORIO_CERRADO", "LABORATORIO_ABIERTO"],
      },
      estatus: ReservaEstatus.FINALIZADA,
      ...(input.excepcionReservaId ? { id: { not: input.excepcionReservaId } } : {}),
      AND: [
        {
          OR: [
            {
              reservaLaboratorioAbierto: {
                laboratorioId: input.laboratorioId,
              },
            },
            {
              reservaLaboratorioCerrado: {
                laboratorioId: input.laboratorioId,
              },
            },
          ],
        },
        {
          OR: [
            {
              fechaHoraInicio: {
                gte: fechaHoraInicio,
                lte: fechaHoraFin,
              },
            },
            {
              fechaHoraFin: {
                gte: fechaHoraInicio,
                lte: fechaHoraFin,
              },
            },
            {
              fechaHoraInicio: {
                lte: fechaHoraInicio,
              },
              fechaHoraFin: {
                gte: fechaHoraFin,
              },
            },
          ],
        },
      ],
    },
  });

  return reservasExistentes;
};

export const lanzarErrorSiLaboratorioOcupado = async (
  ctx: {
    db: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
    >;
  },
  input: Omit<InputEstaEnUso, "laboratorioId"> & { laboratorioId?: number | undefined },
) => {
  if (!input.laboratorioId) {
    // No hay laboratorio elegido
    return;
  }

  const laboratorioElegido = await ctx.db.laboratorio.findUnique({
    where: {
      id: input.laboratorioId,
    },
    select: {
      nombre: true,
    },
  });

  if (!laboratorioElegido) {
    return;
  }

  if (input.laboratorioId) {
    // Esta ocupado el laboratorio en ese mismo horario
    const existenReservas = await obtenerReservasExistentesDeLaboratorio(
      { db: ctx.db },
      {
        fechaHoraInicio: input.fechaHoraInicio,
        fechaHoraFin: input.fechaHoraFin,
        laboratorioId: input.laboratorioId,
        excepcionReservaId: input.excepcionReservaId,
      },
    );

    if (existenReservas.length > 0) {
      const reservaQueExiste = existenReservas[0];

      const fechaInicio = reservaQueExiste?.fechaHoraInicio ?? input.fechaHoraInicio;
      const fechaFin = reservaQueExiste?.fechaHoraFin ?? input.fechaHoraFin;

      throw getErrorLaboratorioOcupado(laboratorioElegido.nombre, fechaInicio, fechaFin);
    }
  }
};
