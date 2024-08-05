import { z } from "zod";

export const inputGetRoles = z.object({
  orderBy: z
    .enum(["inventario", "id", "titulo", "autor", "anio", "editorial", "idioma", "isbn", "materias", "estado"])
    .default("titulo")
    .catch("titulo"),
  orderDirection: z.enum(["asc", "desc"]).default("asc").catch("asc"),
  searchText: z.string().default(""),
  permiso: z
    .string()
    .optional()
    .refine((value) => value && parseInt(value) >= 0, { message: "Debe ser mayor o igual a 0" })
    .catch(""),
});

export const inputEliminarRol = z.object({ id: z.number() });

export const inputGetRol = z.object({ id: z.number() });

export const inputAgregarRol = z.object({
  nombre: z.string().min(1, { message: "Requerido" }),
  permisos: z.array(z.string()).default([]),
});

export const inputEditarRol = z
  .object({
    id: z.number().optional(), // Si viene significa que se va a usar para editar, si no significa que se va a usar para crear
  })
  .merge(inputAgregarRol);
