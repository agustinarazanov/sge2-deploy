import { z } from "zod";
import { publicProcedure } from "../../trpc";
import { getAllLibros } from "../../repositories/biblioteca/biblioteca.repository";


export const inputGetAllBooks = z.object({
  filter: z.object({
    inventory: z.string().optional(),
    bibliotecaId: z.string().optional(),
    title: z.string().optional(),
    author: z.string().optional(),
    year: z.string().optional(),
    editorial: z.string().optional(),
    language: z.string().optional(),
    isbn: z.string().optional(),
    subjects: z.array(z.string()).optional(),
    status: z.enum(["available", "unavailable"]).optional(),
  })
});

export const getAllBooksProcedure = publicProcedure
  .input(inputGetAllBooks)
  .query(async ({ ctx, input }) => {
    const libros = await getAllLibros(ctx, input);

    return libros;
  });
