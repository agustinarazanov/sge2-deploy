import type {
  inputAprobarReservaLaboratorioCerradoSchema,
  inputEditarReservaLaboratorioCerradoSchema,
  inputGetAllSolicitudesReservaLaboratorioCerrado,
  inputGetReservaLaboratorioPorId,
  inputGetReservaLaboratorioPorUsuarioId,
  inputRechazarReservaLaboratorioCerrado,
  inputReservaLaboratorioCerrado,
} from "@/shared/filters/reserva-laboratorio-filter.schema";
import type { PrismaClient, Prisma, CursoDia } from "@prisma/client";
import type { z } from "zod";
import { informacionUsuario } from "../usuario-helper";
import { construirOrderByDinamico } from "@/shared/dynamic-orderby";
import { lanzarErrorSiLaboratorioOcupado } from "./laboratorioEnUso.repository";
import { obtenerHoraInicioFin, addMinutes, setHours, setMinutes } from "@/shared/get-date";

type InputGetPorUsuarioID = z.infer<typeof inputGetReservaLaboratorioPorUsuarioId>;
export const getReservaPorUsuarioId = async (ctx: { db: PrismaClient }, input: InputGetPorUsuarioID) => {
  const { id } = input;

  const filtrosWhereReservaLaboratorioCerrado: Prisma.ReservaLaboratorioCerradoWhereInput = {
    usuarioCreadorId: id,
  };

  const reservas = await ctx.db.reservaLaboratorioCerrado.findMany({
    where: filtrosWhereReservaLaboratorioCerrado,
    include: {
      reserva: true,
      laboratorio: true,
    },
    orderBy: {
      fechaCreacion: "desc",
    },
  });

  return reservas;
};

type InputGetPorId = z.infer<typeof inputGetReservaLaboratorioPorId>;
export const getReservaPorId = async (ctx: { db: PrismaClient }, input: InputGetPorId) => {
  const { id } = input;

  const reserva = await ctx.db.reservaLaboratorioCerrado.findUnique({
    where: {
      reservaId: id,
    },
    include: {
      reserva: true,
      laboratorio: true,
    },
  });

  return reserva;
};

type InputGetAllReservas = z.infer<typeof inputGetAllSolicitudesReservaLaboratorioCerrado>;
export const getAllReservas = async (ctx: { db: PrismaClient }, input: InputGetAllReservas, userId: string) => {
  const { pageIndex, pageSize, searchText, orderDirection, orderBy, estatus, filtrByUserId } = input;

  const filtrosWhereReservaLaboratorioCerrado: Prisma.ReservaLaboratorioCerradoWhereInput = {
    reserva: {
      ...(filtrByUserId === "true" ? { usuarioSolicitoId: userId } : {}),
      ...(estatus ? { estatus: estatus } : {}),
    },
    ...(searchText
      ? {
          OR: [
            {
              reserva: {
                reservaLaboratorioAbierto: {
                  laboratorio: {
                    nombre: {
                      contains: searchText ?? undefined,
                      mode: "insensitive",
                    },
                  },
                },
              },
            },
          ],
        }
      : {}),
  };

  const orden: Prisma.ReservaLaboratorioAbiertoOrderByWithRelationInput = construirOrderByDinamico(
    orderBy ?? "",
    orderDirection ?? "",
  );

  const [count, reservas] = await ctx.db.$transaction([
    ctx.db.reservaLaboratorioCerrado.count({
      where: filtrosWhereReservaLaboratorioCerrado,
    }),
    ctx.db.reservaLaboratorioCerrado.findMany({
      include: {
        reserva: {
          include: {
            usuarioSolicito: {
              select: informacionUsuario,
            },
            usuarioAprobador: {
              select: informacionUsuario,
            },
            usuarioRenovo: {
              select: informacionUsuario,
            },
            usuarioRecibio: {
              select: informacionUsuario,
            },
          },
        },
        laboratorio: true,
      },
      where: filtrosWhereReservaLaboratorioCerrado,
      orderBy: orden,
      skip: parseInt(pageIndex) * parseInt(pageSize),
      take: parseInt(pageSize),
    }),
  ]);

  return {
    count,
    reservas,
  };
};

type InputAprobarReserva = z.infer<typeof inputAprobarReservaLaboratorioCerradoSchema>;
export const aprobarReserva = async (ctx: { db: PrismaClient }, input: InputAprobarReserva, userId: string) => {
  try {
    const reserva = await ctx.db.$transaction(async (tx) => {
      const reserva = await tx.reserva.findUnique({
        where: {
          id: input.id,
        },
        include: {
          usuarioSolicito: true,
          usuarioAprobador: true,
        },
      });

      if (!reserva) {
        throw new Error("Reserva no encontrada");
      }

      if (reserva.estatus === "RECHAZADA" || reserva.estatus === "CANCELADA") {
        throw new Error("La reserva ya fue rechazada o cancelada");
      }

      await lanzarErrorSiLaboratorioOcupado(
        { db: tx },
        {
          fechaHoraInicio: reserva.fechaHoraInicio,
          fechaHoraFin: reserva.fechaHoraFin,
          laboratorioId: input.laboratorioId,
          reservaId: reserva.id,
        },
      );

      await tx.reserva.update({
        where: {
          id: input.id,
        },
        data: {
          estatus: "FINALIZADA",
          usuarioAprobadorId: userId,
          fechaAprobacion: new Date(),
          reservaLaboratorioCerrado: {
            update: {
              laboratorioId: input.laboratorioId,
              usuarioModificadorId: userId,
            },
          },
        },
      });
      return reserva;
    });

    return reserva;
  } catch (error) {
    throw new Error(`Error aprobando reserva. ${(error as Error).message ?? ""}`);
  }
};

type InputRechazarReserva = z.infer<typeof inputRechazarReservaLaboratorioCerrado>;
export const rechazarReserva = async (ctx: { db: PrismaClient }, input: InputRechazarReserva, userId: string) => {
  try {
    const reserva = await ctx.db.$transaction(async (tx) => {
      const reserva = await tx.reserva.findUnique({
        where: {
          id: input.id,
        },
        include: {
          usuarioSolicito: true,
          usuarioAprobador: true,
        },
      });

      if (!reserva) {
        throw new Error("Reserva no encontrada");
      }

      if (reserva.estatus === "RECHAZADA" || reserva.estatus === "CANCELADA") {
        throw new Error("La reserva ya fue rechazada o cancelada");
      }

      await tx.reserva.update({
        where: {
          id: input.id,
        },
        data: {
          estatus: "RECHAZADA",
          usuarioRechazadoId: userId,
          fechaRechazo: new Date(),
          reservaLaboratorioCerrado: {
            update: {
              usuarioModificadorId: userId,
              laboratorioId: null,
            },
          },
        },
      });
      return reserva;
    });

    return reserva;
  } catch (error) {
    throw new Error(`Error rechazando reserva. ${(error as Error).message ?? ""}`);
  }
};

type InputEditarReserva = z.infer<typeof inputEditarReservaLaboratorioCerradoSchema>;
export const editarReserva = async (ctx: { db: PrismaClient }, input: InputEditarReserva, userId: string) => {
  try {
    const reserva = await ctx.db.$transaction(async (tx) => {
      const reserva = await tx.reserva.findUnique({
        where: {
          id: input.id,
        },
        select: {
          usuarioCreadorId: true,
          usuarioSolicitoId: true,
          estatus: true,
        },
      });

      if (!reserva) {
        throw new Error("Reserva no encontrada");
      }

      if (reserva.estatus === "RECHAZADA" || reserva.estatus === "CANCELADA") {
        throw new Error("La reserva ya fue rechazada o cancelada");
      }

      await tx.reservaLaboratorioCerrado.delete({
        where: {
          reservaId: input.id,
        },
      });

      await tx.reserva.update({
        where: {
          id: input.id,
        },
        ...getReservaCerradaCreateArgs(input, userId), //TODO
      });
      return reserva;
    });

    return reserva;
  } catch (error) {
    throw new Error(`Error rechazando reserva. ${(error as Error).message ?? ""}`);
  }
};

export const cancelarReserva = async (ctx: { db: PrismaClient }, input: InputRechazarReserva, userId: string) => {
  try {
    const reserva = await ctx.db.$transaction(async (tx) => {
      const reserva = await tx.reserva.findUnique({
        where: {
          id: input.id,
        },
        select: {
          usuarioCreadorId: true,
          usuarioSolicitoId: true,
          estatus: true,
        },
      });

      if (!reserva) {
        throw new Error("Reserva no encontrada");
      }

      if (reserva.estatus === "RECHAZADA" || reserva.estatus === "CANCELADA") {
        throw new Error("La reserva ya fue rechazada o cancelada");
      }

      if (reserva.usuarioCreadorId === userId || reserva.usuarioSolicitoId === userId) {
        await tx.reserva.update({
          where: {
            id: input.id,
          },
          data: {
            estatus: "CANCELADA",
            usuarioModificadorId: userId,
            reservaLaboratorioCerrado: {
              update: {
                usuarioModificadorId: userId,
                laboratorioId: null,
              },
            },
          },
        });

        return reserva;
      }
      throw new Error("No tienes permisos para cancelar esta reserva");
    });

    return reserva;
  } catch (error) {
    throw new Error(`Error rechazando reserva. ${(error as Error).message ?? ""}`);
  }
};

type InputCrearReserva = z.infer<typeof inputReservaLaboratorioCerrado>;
export const crearReservaLaboratorioCerrado = async (
  ctx: { db: PrismaClient },
  input: InputCrearReserva,
  userId: string,
) => {
  try {
    // Buscar el curso con los días y horas
    const curso = await ctx.db.curso.findUnique({
      where: { id: input.cursoId },
    });

    if (!curso) {
      throw new Error(`Curso no encontrado para el ID ${input.cursoId}`);
    }

    // Obtener el día de la fecha de reserva
    const fechaReserva = new Date(input.fechaReserva);
    const diaReserva = fechaReserva.getDay(); // Esto devolverá 0-6
    const diaReservaAjustado = diaReserva;

    const diaReservaFinal = obtenerCursoDia(diaReservaAjustado);

    console.log("Fecha de la reserva:", fechaReserva);
    const diaSemana = obtenerDiaSemana(fechaReserva);
    console.log("Día de la semana (ajustado):", diaSemana);

    const cursoDiaReserva = obtenerCursoDia(diaSemana); // Convertir el número al formato de día del curso
    console.log("Día del curso esperado:", cursoDiaReserva);

    // Determinar si la reserva es para el dia1 o dia2 del curso
    let horaInicioStr: string | undefined;
    let duracionStr: string | undefined;

    if (diaReservaFinal === curso.dia1) {
      // Si el día de la reserva coincide con dia1
      horaInicioStr = curso.horaInicio1;
      duracionStr = curso.duracion1;
    } else if (diaReservaFinal === curso.dia2) {
      // Si el día de la reserva coincide con dia2
      horaInicioStr = curso.horaInicio2 ?? undefined;
      duracionStr = curso.duracion2 ?? undefined;
    }

    // Validar si el curso tiene clases ese día
    if (!horaInicioStr || !duracionStr) {
      throw new Error(`El curso no tiene clases el día ${diaReservaFinal}`);
    }

    const horaInicioNumero = parseInt(curso.horaInicio1); // '1'
    const { horaInicio, horaFin } = obtenerHoraInicioFin(horaInicioNumero, curso.turno);
    console.log(horaInicio);
    console.log(horaFin);

    // Calcular las fechas finales basadas en la hora de inicio y duración
    const fechaHoraInicio = calcularFechaHora(fechaReserva, horaInicio);
    const fechaHoraFin = calcularFechaFin(fechaHoraInicio, duracionStr);

    // Crear la reserva
    const reserva = await ctx.db.$transaction(async (tx) => {
      const reserva = await tx.reserva.create({
        ...getReservaCerradaCreateArgs(input, userId, fechaHoraInicio, fechaHoraFin, curso.sedeId),
      });

      return reserva;
    });

    return reserva;
  } catch (error) {
    throw new Error(`Error creando reserva. ${(error as Error).message ?? ""}`);
  }
};

const getReservaCerradaCreateArgs = (
  input: InputCrearReserva,
  userId: string,
  fechaHoraInicio?: Date,
  fechaHoraFin?: Date,
  sedeId?: number,
) => {
  return {
    data: {
      estatus: "PENDIENTE",
      tipo: "LABORATORIO_CERRADO",
      fechaHoraInicio: fechaHoraInicio,
      fechaHoraFin: fechaHoraFin,
      usuarioSolicitoId: userId,
      usuarioCreadorId: userId,
      usuarioModificadorId: userId,
      reservaLaboratorioCerrado: {
        create: {
          sedeId: sedeId,
          usuarioCreadorId: userId,
          usuarioModificadorId: userId,
          laboratorioId: null,
          cursoId: input.cursoId,
          //TODO EQUIPO RESERVADO
        },
      },
    },
  } as Prisma.ReservaCreateArgs;
};

// Función para obtener el día en formato CursoDia en base al día de la semana
function obtenerCursoDia(dia: number): CursoDia {
  const dias = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO", "DOMINGO"];
  return dias[dia] as CursoDia;
}

function calcularFechaHora(fechaReserva: Date, horaInicio: string): Date {
  // Verificar si la fecha de reserva es válida
  if (isNaN(fechaReserva.getTime())) {
    throw new Error(`Fecha de reserva inválida: ${fechaReserva.toISOString()}`);
  }

  // Verificar si la hora de inicio está en el formato correcto (HH:mm)
  const [horas, minutos] = horaInicio.split(":").map(Number);
  if (horas === undefined || minutos === undefined) {
    throw new Error(`Hora de inicio inválida: ${horaInicio}`);
  }

  if (isNaN(horas) || isNaN(minutos)) {
    throw new Error(`Hora de inicio inválida: ${horaInicio}`);
  }

  // Ajustar la fecha con la hora y minutos
  const fechaHoraInicio = setHours(setMinutes(fechaReserva, minutos), horas);

  if (isNaN(fechaHoraInicio.getTime())) {
    throw new Error(`Error al calcular fecha de inicio con hora: ${fechaHoraInicio.toISOString()}`);
  }

  return fechaHoraInicio;
}

// Función para calcular la fecha de finalización en base a la duración
function calcularFechaFin(fechaHoraInicio: Date, duracion: string): Date {
  const duracionEnMinutos = parseInt(duracion);

  if (isNaN(duracionEnMinutos)) {
    throw new Error(`Duración inválida: ${duracion}`);
  }

  const fechaHoraFin = addMinutes(fechaHoraInicio, duracionEnMinutos);

  if (isNaN(fechaHoraFin.getTime())) {
    throw new Error(`Error al calcular fecha de fin: ${fechaHoraFin.toISOString()}`);
  }

  return fechaHoraFin;
}

function obtenerDiaSemana(fecha: Date): number {
  const dia = fecha.getDay(); // 0 = domingo, 1 = lunes, ..., 6 = sábado
  console.log("Día original obtenido de la fecha:", dia);
  return dia === 0 ? 6 : dia;
}
