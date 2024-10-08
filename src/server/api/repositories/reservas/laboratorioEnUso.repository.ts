import { type PrismaClient, type LaboratorioAbiertoTipo, Prisma, ReservaEstatus } from "@prisma/client";
import type { DefaultArgs } from "@prisma/client/runtime/library";
import { getErrorLaboratorioOcupado } from "../../services/helper";
import { type inputGetReservasExistentesDeLaboratorio } from "@/shared/filters/laboratorio-en-uso.schema";
import { type z } from "zod";

type InputLaboratoriosEnUso = z.infer<typeof inputGetReservasExistentesDeLaboratorio>;
export const reservaExistenteQuery = ({
  excepcionReservaId,
  laboratorioId,
  fechaHoraInicio,
  fechaHoraFin,
}: InputLaboratoriosEnUso): Prisma.ReservaWhereInput => {
  return {
    tipo: {
      in: ["LABORATORIO_CERRADO", "LABORATORIO_ABIERTO"],
    },
    estatus: ReservaEstatus.FINALIZADA,
    ...(excepcionReservaId ? { id: { not: excepcionReservaId } } : {}),
    AND: [
      {
        OR: [
          {
            reservaLaboratorioAbierto: {
              laboratorioId: laboratorioId,
            },
          },
          {
            reservaLaboratorioCerrado: {
              laboratorioId: laboratorioId,
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
  };
};

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
  const query = reservaExistenteQuery(input);

  const reservasExistentes = await ctx.db.reserva.findMany({
    where: query,
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

type Laboratorio = {
  id: number;
  nombre: string;
  tienePc: boolean;
  esReservable: boolean;
  laboratorioAbiertoTipo: LaboratorioAbiertoTipo;
  sedeId: number;
  estaOcupado: boolean;
  armarios: {
    id: number;
    nombre: string;
  }[];
  sede: {
    id: number;
    nombre: string;
  };
};

/**
 * Realiza una query nativa de sql para obtener todos los laboratorios y notificar si estan ocupadas
 * No se pudo realizar con Prisma nativo, porque es una query muy compleja para el ORM y para evitar
 * hacer multiples queries y transformaciones. Opté por realizar una query nativa para obtener los datos
 * @param ctx Context query
 * @param input Input de la query
 * @returns Array de laboratorios con estaOcupado
 */
export const obtenerTodasLasReservasEnHorario = async (
  ctx: {
    db: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
    >;
  },
  input: Omit<InputLaboratoriosEnUso, "laboratorioId"> & { searchText: string; sedeId?: number },
) => {
  const { excepcionReservaId, fechaHoraInicio, fechaHoraFin, searchText, sedeId } = input;

  const query = Prisma.sql`
    SELECT
        "l"."id",
        "l"."nombre",
        "l"."sedeId",
        "l"."tienePc",
        "l"."esReservable",
        "l"."laboratorioAbiertoTipo",
        CASE
            WHEN "r"."laboratorioId" IS NOT NULL THEN true
            ELSE false
        END AS "estaOcupado",
        json_agg(DISTINCT jsonb_build_object('id', "a"."id", 'nombre', "a"."nombre")) AS "armarios",
        jsonb_build_object('id', "s"."id", 'nombre', "s"."nombre") AS "sede"
    FROM "Laboratorio" "l"
    LEFT JOIN (
        SELECT
        COALESCE("ra"."laboratorioId", "rc"."laboratorioId") AS "laboratorioId"
        FROM "Reserva" "r"
        LEFT JOIN "ReservaLaboratorioAbierto" "ra" ON "r"."id" = "ra"."reservaId"
        LEFT JOIN "ReservaLaboratorioCerrado" "rc" ON "r"."id" = "rc"."reservaId"
        WHERE "r"."tipo" IN ('LABORATORIO_CERRADO', 'LABORATORIO_ABIERTO')
        AND "r"."estatus" = 'FINALIZADA'
        ${excepcionReservaId ? Prisma.sql`AND "r"."id" != ${excepcionReservaId}` : Prisma.empty}
        AND (
            ("r"."fechaHoraInicio" >= ${fechaHoraInicio} AND "r"."fechaHoraInicio" <= ${fechaHoraFin})
            OR ("r"."fechaHoraFin" >= ${fechaHoraInicio} AND "r"."fechaHoraFin" <= ${fechaHoraFin})
            OR ("r"."fechaHoraInicio" <= ${fechaHoraInicio} AND "r"."fechaHoraFin" >= ${fechaHoraFin})
        )
    ) "r" ON "l"."id" = "r"."laboratorioId"
    LEFT JOIN "Sede" "s" ON "l"."sedeId" = "s"."id"
    LEFT JOIN "Armario" "a" ON "l"."id" = "a"."laboratorioId"
    WHERE "l"."nombre" ILIKE '%' || ${searchText} || '%'
        AND (${sedeId}::int IS NULL OR "l"."sedeId" = ${sedeId})
    GROUP BY "l"."id", "r"."laboratorioId", "s"."id"
    ORDER BY "l"."id";
  `;

  const resultados = await ctx.db.$queryRaw<Laboratorio[]>(query);

  return resultados;
};
