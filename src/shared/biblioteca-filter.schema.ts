import { z } from "zod";

export const inputAddBooks = z
  .object({
    inventario: z.string().min(1, { message: "Requerido" }),
    id: z.string().optional(),
    titulo: z.string().min(1, { message: "Requerido" }),
    autor: z.string().min(1, { message: "Requerido" }),
    anio: z.string().min(1, { message: "Requerido" }),
    editorial: z.string().min(1, { message: "Requerido" }),
    idioma: z.string().min(1, { message: "Requerido" }),
    isbn: z.string().min(1, { message: "Requerido" }),
    materias: z.array(z.string()).default([]),
    estado: z.enum(["disponible", "prestado"]).default("disponible"),
  })
  .superRefine((value, ctx) => {
    // if (!value.titulo) {
    //   ctx.addIssue({
    //     code: z.ZodIssueCode.custom,
    //     message: "Requerido",
    //     path: ["titulo"],
    //     fatal: true,
    //   });
    // }
    // if (!value.autor) {
    //   ctx.addIssue({
    //     code: z.ZodIssueCode.custom,
    //     message: "Requerido",
    //   });
    // }
  });

export const inputGetBooks = z.object({
  pageSize: z.enum(["10", "20", "30", "40", "50"]).default("10").catch("10"),
  page: z
    .string()
    .default("1")
    .refine((value) => parseInt(value) > 0, { message: "Debe ser mayor a 0" })
    .catch("1"),
  orderBy: z
    .enum(["inventario", "id", "titulo", "autor", "anio", "editorial", "idioma", "isbn", "materias", "estado"])
    .default("titulo")
    .catch("titulo"),
  orderDirection: z.enum(["asc", "desc"]).default("asc").catch("asc"),
  searchText: z.string().default(""),
});

export const inputEliminarLibro = z.object({
  libroId: z.number(),
});
