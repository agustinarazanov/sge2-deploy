import {
  type inputEliminarLibro,
  type inputAddBooks,
  type inputGetBooks,
  type inputGetLibro,
  type inputEditBooks,
} from "@/shared/filters/biblioteca-filter.schema";
import { Prisma, type PrismaClient } from "@prisma/client";
import { type z } from "zod";
import { generarBibliotecaInventarioId, getUltimoBibliotecaInventarioId } from "./biblioteca-inventario-id";
import { construirOrderByDinamico } from "@/shared/dynamic-orderby";

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
    ...(input?.materia
      ? {
          materias: {
            some: {
              materiaId: parseInt(input?.materia),
            },
          },
        }
      : {}),
  };

  const ordenLibro: Prisma.LibroOrderByWithRelationInput = construirOrderByDinamico(
    input?.orderBy ?? "",
    input?.orderDirection ?? "",
  );

  const [count, libros] = await ctx.db.$transaction([
    ctx.db.libro.count({
      where: filtrosWhereLibro,
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
      where: filtrosWhereLibro,
      orderBy: {
        ...(input?.orderBy ? ordenLibro : {}),
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
      autor: {
        select: {
          autorNombre: true,
          id: true,
        },
      },
      editorial: {
        select: {
          editorial: true,
          id: true,
        },
      },
      idioma: {
        select: {
          idioma: true,
          id: true,
        },
      },
      materias: {
        include: {
          materia: {
            select: {
              id: true,
              nombre: true,
              codigo: true,
            },
          },
        },
      },
      sede: {
        select: {
          id: true,
          nombre: true,
        },
      },
      laboratorio: {
        select: {
          id: true,
          nombre: true,
        },
      },
      armario: {
        select: {
          id: true,
          nombre: true,
        },
      },
      estante: {
        select: {
          id: true,
          nombre: true,
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
    const nuevoLibro = await ctx.db.$transaction(async (tx) => {
      const ultimoInventarioId = await getUltimoBibliotecaInventarioId({ db: tx });

      const libro = await ctx.db.libro.create({
        data: {
          anio: input.anio,
          isbn: input.isbn,
          titulo: input.titulo,

          inventarioId: generarBibliotecaInventarioId(ultimoInventarioId + 1),
          bibliotecaId: input.bibliotecaId,
          sedeId: Number(input.sedeId),
          editorialId: input.editorialId,
          idiomaId: Number(input.idiomaId),
          laboratorioId: Number(input.laboratorioId),
          armarioId: Number(input.armarioId),
          estanteId: Number(input.estanteId),
          autorId: input.autorId,

          usuarioCreadorId: userId,
          usuarioModificadorId: userId,

          materias: {
            createMany: {
              data: input.materias.map((materiaId) => ({
                materiaId: parseInt(materiaId),
                usuarioCreadorId: userId,
              })),
            },
          },
        },
      });

      return libro;
    });

    return nuevoLibro;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new Error(`Ocurrió un error al agregar el libro, intente agregarlo de nuevo. Error: ${error.message}`);
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

        bibliotecaId: input.bibliotecaId,
        sedeId: Number(input.sedeId),
        editorialId: input.editorialId,
        idiomaId: Number(input.idiomaId),
        laboratorioId: Number(input.laboratorioId),
        armarioId: Number(input.armarioId),
        estanteId: Number(input.estanteId),
        autorId: input.autorId,

        usuarioCreadorId: userId,
        usuarioModificadorId: userId,

        materias: {
          deleteMany: {},
          createMany: {
            data: input.materias.map((materiaId) => ({
              materiaId: parseInt(materiaId),
              usuarioCreadorId: userId,
            })),
          },
        },
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

export const getAllAutores = async (ctx: { db: PrismaClient }) => {
  const autores = await ctx.db.libroAutor.findMany({
    select: {
      id: true,
      autorNombre: true,
    },
    orderBy: {
      autorNombre: "asc",
    },
  });

  return autores;
};
