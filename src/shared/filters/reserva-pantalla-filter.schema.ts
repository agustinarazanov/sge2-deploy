import { z } from "zod";

export const inputEliminarReservaPantallas = z.object({ ids: z.array(z.number()) });

export const inputAgregarReservaPantalla = z.object({
  docente: z.string().min(1, { message: "Requerido" }),
  materiaId: z.number().optional(),
  materia: z.string().min(1, { message: "Requerido" }),
  laboratorio: z.string().min(1, { message: "Requerido" }),
  horaInicio: z.string().min(1, { message: "Requerido" }),
});
