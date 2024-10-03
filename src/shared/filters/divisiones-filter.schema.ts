import { z } from "zod";

export const inputAgregarDivision = z.object({
  nombre: z.string().min(1, { message: "Requerido" }).max(5, { message: "No debe superar 5 caracteres" }),
  anio: z
    .number()
    .min(1, "El año debe ser al menos 1")
    .max(6, "El año debe ser como máximo 6")
    .int("El año debe ser un número entero")
    .optional(),
});

export const inputGetDivisiones = z.object({
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

export const inputGetDivision = z.object({
  id: z.number(),
});

export const inputEliminarDivision = z.object({ id: z.number() });

export const inputEditarDivision = z
  .object({
    id: z.number(),
  })
  .merge(inputAgregarDivision);
