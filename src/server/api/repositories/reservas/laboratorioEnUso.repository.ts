import { type PrismaClient, type Prisma, ReservaEstatus } from "@prisma/client";
import type { DefaultArgs } from "@prisma/client/runtime/library";
import { z } from "zod";
import { getErrorLaboratorioOcupado } from "../../services/helper";

const estaLaboratorioEnUso = z.object({
  laboratorioId: z.number().positive().min(1, { message: "Requerido" }),
  fechaHoraInicio: z.date(),
  fechaHoraFin: z.date(),
  reservaId: z.number().optional(),
});

type InputEstaEnUso = z.infer<typeof estaLaboratorioEnUso>;
export const estaEnUsoLaboratorio = async (
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
      ...(input.reservaId ? { id: { not: input.reservaId } } : {}),
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
    const existenReservas = await estaEnUsoLaboratorio(
      { db: ctx.db },
      {
        fechaHoraInicio: input.fechaHoraInicio,
        fechaHoraFin: input.fechaHoraFin,
        laboratorioId: input.laboratorioId,
        reservaId: input.reservaId,
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
