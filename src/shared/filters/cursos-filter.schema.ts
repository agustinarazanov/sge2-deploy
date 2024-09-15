import { z } from "zod";

const diaEnum = z.enum(["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO"]).default("LUNES").catch("LUNES");

export const inputAgregarCurso = z.object({
  horaInicio1: z.string().min(1, { message: "Requerido" }),
  duracion1: z.string().min(1, { message: "Requerido" }),
  horaInicio2: z.string().min(1, { message: "Requerido" }),
  duracion2: z.string().min(1, { message: "Requerido" }),
  dia1: diaEnum,
  dia2: diaEnum,
  profesorUserId: z.string().min(1, { message: "Requerido" }),
  ayudanteUserId: z.string().min(1, { message: "Requerido" }),
  anioDeCarrera: z.number().min(1, { message: "Requerido" }),
  activo: z.boolean().default(true).catch(true),
  ac: z.string().min(1, { message: "Requerido" }),
  sedeId: z.string().min(1, { message: "Requerido" }),
  materiaId: z.string().min(1, { message: "Requerido" }),
  divisionId: z.string().min(1, { message: "Requerido" }),
  turnoId: z.string().min(1, { message: "Requerido" }),
});

export const inputGetCursos = z.object({
  pageSize: z.enum(["10", "20", "30", "40", "50"]).default("20").catch("10"),
  pageIndex: z
    .string()
    .default("0")
    .refine((value) => parseInt(value) >= 0, { message: "Debe ser mayor o igual a 0" })
    .catch("0"),
  orderBy: z
    .enum(["division_nombre", "ac", "turno", "sede_nombre"])
    .default("division_nombre")
    .catch("division_nombre"),
  orderDirection: z.enum(["asc", "desc"]).default("asc").catch("asc"),
  searchText: z.string().default(""),
  materia: z
    .string()
    .optional()
    .refine((value) => value && parseInt(value) >= 0, { message: "Debe ser mayor o igual a 0" })
    .catch(""),
  anioDeCarrera: z.string().optional(),
  userId: z.string().optional(),
});

export const inputGetCursosParaReserva = z.object({});

export const inputGetCurso = z.object({
  id: z.number(),
});

export const inputEliminarCurso = inputGetCurso;

export const inputEditarCurso = z
  .object({
    id: z.number().optional(), // Si viene significa que se va a usar para editar, si no significa que se va a usar para crear
  })
  .merge(inputAgregarCurso);
