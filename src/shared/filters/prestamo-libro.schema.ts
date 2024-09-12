import { z } from "zod";

export const inputPrestarLibro = z.object({
  libroId: z.number().positive().min(1, { message: "Requerido" }),
  usuarioSolicitanteId: z.string().min(1, { message: "Requerido" }),
  fechaInicio: z.string().min(1, { message: "Requerido" }),
  fechaFin: z.string().min(1, { message: "Requerido" }),
});
