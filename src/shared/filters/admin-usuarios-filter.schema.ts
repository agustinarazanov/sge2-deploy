import { z } from "zod";

export const inputGetUsuarios = z.object({
  pageSize: z.enum(["10", "20", "30", "40", "50"]).default("10").catch("10"),
  pageIndex: z
    .string()
    .default("0")
    .refine((value) => parseInt(value) >= 0, { message: "Debe ser mayor o igual a 0" })
    .catch("0"),
  orderBy: z
    .enum(["inventario", "id", "titulo", "autor", "anio", "editorial", "idioma", "isbn", "materias", "estado"]) // todo: cambiar
    .default("titulo")
    .catch("titulo"),
  orderDirection: z.enum(["asc", "desc"]).default("asc").catch("asc"),
  searchText: z.string().default(""),
  rol: z
    .string()
    .optional()
    .refine((value) => value && parseInt(value) >= 0, { message: "Debe ser mayor o igual a 0" })
    .catch(""),
});

export const inputEliminarUsuario = z.object({ id: z.string() });

export const inputGetUsuario = z.object({ id: z.string() });

export const inputEditarUsuario = z.object({
  id: z.string(),
  roles: z.array(z.string()).default([]),
  nombre: z.string().min(1, { message: "Requerido" }),
  apellido: z.string().min(1, { message: "Requerido" }),
  email: z.string().min(1, { message: "Requerido" }),
  legajo: z.string().min(1, { message: "Requerido" }),
});
