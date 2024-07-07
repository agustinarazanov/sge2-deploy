import { type inputEliminarLibro, type inputAddBooks, type inputGetBooks } from "@/shared/biblioteca-filter.schema";
import { Prisma, type PrismaClient } from "@prisma/client";
import { type z } from "zod";

type InputGetAll = z.infer<typeof inputGetBooks>;
export const getAllLibros = async (ctx: { db: PrismaClient }, input: InputGetAll) => {
  const { pageIndex, pageSize, searchText, orderBy, orderDirection } = input;

  const libros = await ctx.db.biblioteca.findMany({
    where: {
      OR: [
        {
          autor: {
            contains: searchText,
          },
        },
        {
          titulo: {
            contains: searchText,
          },
        },
      ],
    },
    orderBy: {
      [orderBy]: orderDirection,
    },
    skip: (parseInt(pageIndex) - 1) * parseInt(pageSize),
    take: parseInt(pageSize),
  });

  console.log(
    `
      $$$$$ GET ALL LIBROS $$$$$
      pageIndex: ${pageIndex}
      pageSize: ${pageSize}
      searchText: ${searchText}
      orderBy: ${orderBy}
      orderDirection: ${orderDirection}
      length: ${libros.length}
    `,
  );

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

type InputDeleteLibro = z.infer<typeof inputEliminarLibro>;
export const deleteLibro = async (ctx: { db: PrismaClient }, input: InputDeleteLibro) => {
  try {
    const libro = await ctx.db.biblioteca.delete({
      where: {
        id: input.libroId,
      },
    });

    return libro;
  } catch (error) {
    throw new Error(`Error eliminando libro ${input.libroId}`);
  }
};
