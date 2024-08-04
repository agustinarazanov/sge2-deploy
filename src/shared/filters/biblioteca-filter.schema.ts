import { z } from "zod";

export const inputAddBooks = z.object({
  inventario: z.string().min(1, { message: "Requerido" }),
  titulo: z.string().min(1, { message: "Requerido" }),
  autor: z.string().min(1, { message: "Requerido" }),
  anio: z.number().min(1, { message: "Requerido" }),
  editorial: z.string().min(1, { message: "Requerido" }),
  idioma: z.string().min(1, { message: "Requerido" }),
  isbn: z.string().min(1, { message: "Requerido" }),
  materias: z.array(z.string()).default([]),
  estado: z.enum(["disponible", "prestado"]).default("disponible"),
});

export const inputGetBooks = z.object({
  pageSize: z.enum(["10", "20", "30", "40", "50"]).default("10").catch("10"),
  pageIndex: z
    .string()
    .default("0")
    .refine((value) => parseInt(value) >= 0, { message: "Debe ser mayor o igual a 0" })
    .catch("0"),
  orderBy: z
    .enum(["inventario", "id", "titulo", "autor", "anio", "editorial", "idioma", "isbn", "materias", "estado"])
    .default("titulo")
    .catch("titulo"),
  orderDirection: z.enum(["asc", "desc"]).default("asc").catch("asc"),
  searchText: z.string().default(""),
  materia: z
    .string()
    .optional()
    .refine((value) => value && parseInt(value) >= 0, { message: "Debe ser mayor o igual a 0" })
    .catch(""),
});

export const inputGetLibro = z.object({
  libroId: z.number(),
});

export const inputEliminarLibro = inputGetLibro;

export const inputEditBooks = z
  .object({
    id: z.number().optional(), // Si viene significa que se va a usar para editar, si no significa que se va a usar para crear
  })
  .merge(inputAddBooks);
