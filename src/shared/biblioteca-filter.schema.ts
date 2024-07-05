import { z } from "zod";

export const inputGetBooks = z.object({
  filter: z.object({
    orderBy: z.enum(["year_asc", "name_asc"]).optional(),
  }),
});

export const inputAddBooks = z
  .object({
    inventario: z.string().min(1, { message: "Requerido" }),
    bibliotecaId: z.string().optional(),
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

export const inputEliminarLibro = z.object({
  libroId: z.number(),
});
