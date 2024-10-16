import { z } from "zod";

export const inputAgregarMateria = z.object({
  nombre: z.string().min(1, { message: "Requerido" }).max(100, { message: "No debe superar 100 caracteres" }),
  codigo: z.string().min(1, { message: "Requerido" }).max(50, { message: "No debe superar 50 caracteres" }),
  anio: z
    .string()
    .min(1, { message: "El año debe ser al menos 1" })
    .max(6, { message: "El año debe ser como máximo 6" }),
  duracion: z.enum(["ANUAL", "CUATRIMESTRAL", "AMBOS"], {
    required_error: "La duración es requerida",
  }),
  tipo: z.enum(["INTEGRADORA", "OBLIGATORIA", "ELECTIVA"], {
    required_error: "El tipo es requerido",
  }),
  regularizadas: z.array(z.string()).default([]),
  aprobadasParaCursar: z.array(z.string()).default([]),
  aprobadasParaRendir: z.array(z.string()).default([]),
  directorUserId: z.string().optional(),
  jefesTrabajoPracticoUserId: z.array(z.string()).optional(),
});

export const inputGetMaterias = z.object({
  pageSize: z.enum(["10", "20", "30", "40", "50"]).default("10").catch("10"),
  pageIndex: z
    .string()
    .default("0")
    .refine((value) => parseInt(value) >= 0, { message: "Debe ser mayor o igual a 0" })
    .catch("0"),
  orderBy: z.enum(["nombre"]).default("nombre").catch("nombre"),
  orderDirection: z.enum(["asc", "desc"]).default("asc").catch("asc"),
  searchText: z.string().default(""),
});

export const inputGetMateria = z.object({
  id: z.number(),
});

export const inputEliminarMateria = z.object({
  id: z.number(),
});

export const inputEditarMateria = z
  .object({
    id: z.number(),
  })
  .merge(inputAgregarMateria);
