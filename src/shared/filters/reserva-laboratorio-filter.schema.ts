import { z } from "zod";

export const inputReservaLaboratorioCerrado = z.object({
  cursoId: z.number().min(1, { message: "Requerido" }),
  fechaReserva: z.string().min(1, { message: "Requerido" }),
  requierePc: z.boolean().default(false),
  requiereProyecto: z.boolean().default(false),
  equipoRequerido: z.array(z.object({ idTipo: z.string(), cantidad: z.number() })).default([]),
  observaciones: z.string().default(""),
  aceptoTerminos: z.boolean().default(false),
});
