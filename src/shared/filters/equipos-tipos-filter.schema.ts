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
  fromFilter: z.string().optional().default("").catch(""),
});

export const inputEliminarTipo = z.object({ id: z.number() });

export const inputGetTipo = z.object({ id: z.number() });

const MAX_FILE_SIZE = 1024 * 1024 * 1;
const ACCEPTED_IMAGE_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png",];

export const inputAgregarTipo = z.object({
  nombre: z.string().min(1, { message: "Requerido" }),
  imagen: z.any()
    .refine(file => file?.[0]?.size <= MAX_FILE_SIZE, {message: "Tamaño maximo es de 1MB"})
    .refine(file => ACCEPTED_IMAGE_MIME_TYPES.includes(file?.[0]?.type), {message: "Solo .jpg, .jpeg, and .png son soportados"})
    .optional(),
});

export const inputEditarTipo = z
  .object({
    id: z.number().optional(), // Si viene significa que se va a usar para editar, si no significa que se va a usar para crear
  })
  .merge(inputAgregarTipo);
