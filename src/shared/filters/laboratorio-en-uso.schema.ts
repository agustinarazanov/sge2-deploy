import { z } from "zod";

export const inputGetReservasExistentesDeLaboratorio = z.object({
  laboratorioId: z.number().positive().min(1, { message: "Requerido" }),
  fechaHoraInicio: z.date(),
  fechaHoraFin: z.date(),
  excepcionReservaId: z.number().optional(),
});
