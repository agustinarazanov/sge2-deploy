import { z } from "zod";

export const inputGetReservaLibroPorUsuarioId = z.object({
  id: z.string().min(1),
});

export const inputGetReservasLibroPorLibroId = z.object({
  libroId: z.number().positive().min(1, { message: "Requerido" }),
});

export const inputPrestarLibro = z
  .object({
    libroId: z.number().positive().min(1, { message: "Requerido" }),
    usuarioSolicitanteId: z.string().min(1, { message: "Requerido" }),
    fechaInicio: z.string().min(1, { message: "Requerido" }),
    fechaFin: z.string().min(1, { message: "Requerido" }),
  })
  .superRefine(({ fechaInicio, fechaFin }, ctx) => {
    const date1 = new Date(fechaInicio);
    const date2 = new Date(fechaFin);

    if (date1 > date2) {
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_date,
        message: "La fecha de inicio debe ser menor a la de fin",
        path: ["fechaInicio"],
      });

      return z.NEVER;
    }
  });
