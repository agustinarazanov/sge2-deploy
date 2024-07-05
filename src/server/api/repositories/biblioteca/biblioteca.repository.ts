import { type inputAddBooks, type inputGetBooks } from "@/shared/biblioteca-filter.schema";
import { Prisma, type PrismaClient } from "@prisma/client";
import { type z } from "zod";

type InputGetAll = z.infer<typeof inputGetBooks>;
export const getAllLibros = (ctx: { db: PrismaClient }, input?: InputGetAll) => {
  const orderByProp = input?.filter.orderBy;

  const libros = ctx.db.biblioteca.findMany({
    orderBy: [
      {
        ...(orderByProp === "year_asc" ? { anio: "desc" } : orderByProp === "name_asc" ? { titulo: "asc" } : {}),
      },
    ],
  });

  return libros;
};

type InputAddLibro = z.infer<typeof inputAddBooks>;
export const addLibro = async (ctx: { db: PrismaClient }, input: InputAddLibro, userId: string) => {
  try {
    const libro = await ctx.db.biblioteca.create({
      data: {
        anio: input.anio,
        autor: input.autor,
        editorial: input.editorial,
        idioma: input.idioma,
        inventario: input.inventario,
        isbn: input.isbn,
        titulo: input.titulo,
        estado: input.estado,
        bibliotecaId: Math.random().toString(),
        createdById: userId,
      },
    });

    return libro;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new Error("El código de inventario ya existe");
      }
    }

    throw new Error("Error agregando libro");
  }
};
