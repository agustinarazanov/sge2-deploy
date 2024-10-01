import { z } from "zod";

export const inputGetTipos = z.object({
  pageSize: z.enum(["10", "20", "30", "40", "50"]).default("10").catch("10"),
  pageIndex: z
    .string()
    .default("0")
    .refine((value) => parseInt(value) >= 0, { message: "Debe ser mayor o igual a 0" })
    .catch("0"),
  orderBy: z
    .enum(["tipo", "inventario", "id", "titulo", "autor", "anio", "editorial", "isbn", "materias", "estado"])
    .default("tipo")
    .catch("tipo"),
  orderDirection: z.enum(["asc", "desc"]).default("asc").catch("asc"),
  searchText: z.string().default(""),
  tipoId: z
    .string()
    .optional()
    .refine((value) => value && parseInt(value) >= 0, { message: "Debe ser mayor o igual a 0" })
    .catch(""),
  fromFilter: z.enum(["true", "false"]).optional().default("false").catch("false"),
  getAll: z.boolean().optional().default(false).catch(false),
});

export const inputEliminarTipo = z.object({ id: z.number() });

export const inputGetTipo = z.object({ id: z.number() });

export const inputAgregarTipo = z.object({
  nombre: z.string().min(1, { message: "Requerido" }),
  imagen: z.string().optional().default(""),
});

export const inputEditarTipo = z
  .object({
    id: z.number().optional(), // Si viene significa que se va a usar para editar, si no significa que se va a usar para crear
  })
  .merge(inputAgregarTipo);
