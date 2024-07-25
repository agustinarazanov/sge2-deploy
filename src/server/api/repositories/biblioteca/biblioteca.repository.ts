import { type inputEliminarLibro, type inputAddBooks, type inputGetBooks } from "@/shared/biblioteca-filter.schema";
import { Prisma, type PrismaClient } from "@prisma/client";
import { type z } from "zod";

type InputGetAll = z.infer<typeof inputGetBooks>;
export const getAllLibros = async (ctx: { db: PrismaClient }, input: InputGetAll) => {
  const { pageIndex, pageSize, searchText, orderBy, orderDirection, materia } = input;

  const [count, libros] = await ctx.db.$transaction([
    ctx.db.libro.count({
      where: {
        OR: [
          {
            titulo: {
              contains: searchText,
            },
          },
          {
            autor: {
              autorNombre: {
                contains: searchText,
              },
            },
          },
        ],
      },
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
        materias: {
          some: {
            materiaId: materia ? parseInt(materia) : undefined,
          },
        },
        OR: [
          {
            titulo: {
              contains: searchText,
            },
          },
          {
            autor: {
              autorNombre: {
                contains: searchText,
              },
            },
          },
          {
            inventarioId: {
              contains: searchText,
            },
          },
          {
            bibliotecaId: {
              contains: searchText,
            },
          },
          {
            anio: {
              equals: isNaN(parseInt(searchText)) ? undefined : parseInt(searchText),
            },
          },
          {
            editorial: {
              editorial: {
                contains: searchText,
              },
            },
          },
          {
            idioma: {
              idioma: {
                contains: searchText,
              },
            },
          },
          {
            isbn: {
              contains: searchText,
            },
          },
        ],
      },
      orderBy: {
        [orderBy]: orderDirection,
      },
      skip: parseInt(pageIndex) * parseInt(pageSize),
      take: parseInt(pageSize),
    }),
  ]);

  return {
    count,
    libros,
  };
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
        inventarioId: input.inventario,
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

export const countAllLibros = async (ctx: { db: PrismaClient }) => {
  const count = await ctx.db.libro.count();

  return count;
};

export const countLibros = async (ctx: { db: PrismaClient }, input: InputGetAll) => {
  const { searchText } = input;

  const count = await ctx.db.libro.count({
    where: {
      OR: [
        {
          titulo: {
            contains: searchText,
          },
        },
        {
          autor: {
            autorNombre: {
              contains: searchText,
            },
          },
        },
      ],
    },
  });

  return count;
};
