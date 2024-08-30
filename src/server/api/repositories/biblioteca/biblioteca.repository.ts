import {
  type inputEliminarLibro,
  type inputAddBooks,
  type inputGetBooks,
  type inputGetLibro,
  type inputEditBooks,
} from "@/shared/filters/biblioteca-filter.schema";
import { Prisma, type PrismaClient } from "@prisma/client";
import { type z } from "zod";

type InputGetAll = z.infer<typeof inputGetBooks>;
export const getAllLibros = async (ctx: { db: PrismaClient }, input: InputGetAll) => {
  const filtrosWhereLibro: Prisma.LibroWhereInput = {
    ...(input?.searchText
      ? {
          OR: [
            {
              titulo: {
                contains: input?.searchText ?? undefined,
                mode: "insensitive",
              },
            },
            {
              autor: {
                autorNombre: {
                  contains: input?.searchText ?? undefined,
                  mode: "insensitive",
                },
              },
            },
            {
              inventarioId: {
                contains: input?.searchText ?? undefined,
                mode: "insensitive",
              },
            },
            {
              bibliotecaId: {
                contains: input?.searchText ?? undefined,
                mode: "insensitive",
              },
            },
            {
              anio: {
                equals: isNaN(parseInt(input?.searchText)) ? undefined : parseInt(input?.searchText),
              },
            },
            {
              isbn: {
                contains: input?.searchText ?? undefined,
                mode: "insensitive",
              },
            },
            {
              editorial: {
                editorial: {
                  contains: input?.searchText ?? undefined,
                  mode: "insensitive",
                },
              },
            },
            {
              idioma: {
                idioma: {
                  contains: input?.searchText ?? undefined,
                  mode: "insensitive",
                },
              },
            },
          ],
        }
      : {}),
  };

  const [count, libros] = await ctx.db.$transaction([
    ctx.db.libro.count({
      ...(input?.searchText
        ? {
            where: {
              OR: [
                {
                  titulo: {
                    contains: input?.searchText ?? undefined,
                  },
                },
                {
                  autor: {
                    autorNombre: {
                      contains: input?.searchText ?? undefined,
                    },
                  },
                },
              ],
            },
          }
        : {}),
    }),
    ctx.db.libro.findMany({
      include: {
        autor: true,
        editorial: true,
        idioma: true,
        materias: {
          include: {
            materia: true,
          },
        },
      },
      where: {
        ...(input?.materia
          ? {
              materias: {
                some: {
                  materiaId: parseInt(input?.materia),
                },
              },
            }
          : {}),
        ...filtrosWhereLibro,
      },
      orderBy: {
        ...(input?.orderBy ? { [input?.orderBy]: input?.orderDirection } : {}),
      },
      ...(input?.pageIndex ? { skip: parseInt(input?.pageIndex) * parseInt(input?.pageSize) } : {}),
      ...(input?.pageSize ? { take: parseInt(input?.pageSize) } : {}),
    }),
  ]);

  return {
    count,
    libros,
  };
};

type InputGetLibroPorId = z.infer<typeof inputGetLibro>;
export const getLibroPorId = async (ctx: { db: PrismaClient }, input: InputGetLibroPorId) => {
  const { libroId } = input;

  const libro = await ctx.db.libro.findUnique({
    include: {
      autor: true,
      editorial: true,
      idioma: true,
      materias: {
        include: {
          materia: true,
        },
      },
    },
    where: {
      id: libroId,
    },
  });

  return libro;
};

type InputAddLibro = z.infer<typeof inputAddBooks>;
export const addLibro = async (ctx: { db: PrismaClient }, input: InputAddLibro, userId: string) => {
  try {
    const libro = await ctx.db.libro.create({
      data: {
        anio: input.anio,
        isbn: input.isbn,
        titulo: input.titulo,

        // TODO: Generar inventarioId y bibliotecaId
        inventarioId: input.inventarioId ?? "",
        bibliotecaId: Math.random().toString(),

        usuarioCreadorId: userId,
        usuarioModificadorId: userId,

        // TODO: Obtener los ids de las entidades
        laboratorioId: 2,
        armarioId: 2,
        estanteId: 1,
        autorId: 1,
        idiomaId: 1,
        editorialId: 1,
        sedeId: 1,
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
    const libro = await ctx.db.libro.delete({
      where: {
        id: input.libroId,
      },
    });

    return libro;
  } catch (error) {
    throw new Error(`Error eliminando libro ${input.libroId}`);
  }
};

type InputEditLibro = z.infer<typeof inputEditBooks>;
export const editLibro = async (ctx: { db: PrismaClient }, input: InputEditLibro, userId: string) => {
  try {
    const libro = await ctx.db.libro.update({
      data: {
        anio: input.anio,
        isbn: input.isbn,
        titulo: input.titulo,

        // TODO: Generar inventarioId y bibliotecaId
        inventarioId: input.inventarioId,
        bibliotecaId: Math.random().toString(),

        usuarioModificadorId: userId,

        // TODO: Obtener los ids de las entidades
        laboratorioId: 2,
        armarioId: 2,
        estanteId: 1,
        autorId: 1,
        idiomaId: 1,
        editorialId: 1,
        sedeId: 1,
      },
      where: {
        id: input.id,
      },
    });

    return libro;
  } catch (error) {
    throw new Error(`Error modificando libro ${input.id}`);
  }
};

export const countAllLibros = async (ctx: { db: PrismaClient }) => {
  const count = await ctx.db.libro.count();

  return count;
};

export const getAllEditorial = async (ctx: { db: PrismaClient }) => {
  const editoriales = await ctx.db.libroEditorial.findMany({
    select: {
      id: true,
      editorial: true,
    },
    orderBy: {
      editorial: "asc",
    },
  });

  return editoriales;
};

export const getAllIdiomas = async (ctx: { db: PrismaClient }) => {
  const idiomas = await ctx.db.libroIdioma.findMany({
    select: {
      id: true,
      idioma: true,
    },
    orderBy: {
      idioma: "asc",
    },
  });

  return idiomas;
};
