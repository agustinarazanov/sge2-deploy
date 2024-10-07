import { getTimeISOString } from "@/shared/get-date";
import { TRPCError } from "@trpc/server";
import { type z } from "zod";

export const validarInput = (schema: z.ZodTypeAny, input: unknown) => {
  const result = schema.safeParse(input);

  if (!result.success) {
    throw new TRPCError({
      code: "UNPROCESSABLE_CONTENT",
      message: `Error en los parametros: ${result.error.message}`,
      cause: result.error,
    });
  }

  return result.data;
};

export const validarFechaReserva = (fecha: string | Date) => {
  const fechaHoy = new Date();
  const fechaReserva = new Date(fecha);

  if (fechaReserva < fechaHoy) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `La fecha de reserva no puede ser anterior a la fecha actual`,
    });
  }
};

export const getErrorLaboratorioOcupado = (laboratorioNombre: string, fechaHoraInicio: Date, fechaHoraFin: Date) => {
  return new TRPCError({
    code: "CONFLICT",
    message: `El laboratorio ${laboratorioNombre} está ocupado en el horario de ${getTimeISOString(fechaHoraInicio)} a ${getTimeISOString(
      fechaHoraFin,
    )}`,
  });
};
