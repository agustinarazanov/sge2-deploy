import { z } from "zod";

const inputEquipoRequerido = z.object({ idTipo: z.string(), cantidad: z.number() });

export const inputReservaLaboratorioCerrado = z.object({
  cursoId: z.number().min(1, { message: "Requerido" }),
  fechaReserva: z.string().min(1, { message: "Requerido" }),
  requierePc: z.boolean().default(false),
  requiereProyecto: z.boolean().default(false),
  equipoRequerido: z.array(inputEquipoRequerido).default([]),
  observaciones: z.string().default(""),
  aceptoTerminos: z.boolean().default(false),
});

export const inputReservaLaboratorioAbierto = z.object({
  tipo: z.string().min(1, { message: "Requerido" }),
  fechaReserva: z.string().min(1, { message: "Requerido" }),
  horaInicio: z.string().min(1, { message: "Requerido" }),
  horaFin: z.string().min(1, { message: "Requerido" }),
  concurrentes: z.number().min(1, { message: "Requerido" }),
  sedeId: z.number().min(1, { message: "Requerido" }),
  equipoRequerido: z.array(inputEquipoRequerido).default([]),
  observaciones: z.string().default(""),
  aceptoTerminos: z.boolean().default(false),
});

export const inputAprobarReservaSchema = z.object({
  id: z.number().positive().min(1, { message: "Requerido" }),
  tutorId: z.string().optional(),
  inventarioRevisado: z.array(z.string()),
  laboratorioId: z.string().min(1, "Seleccione un laboratorio"),
});
