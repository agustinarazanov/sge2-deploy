import { type PrismaClient } from "@prisma/client";
import { type z } from "zod";
import { type inputGetAllBooks } from "../../services/biblioteca/biblioteca.service";

type Input = z.infer<typeof inputGetAllBooks>;
export const getAllLibros = (
  ctx: { db: PrismaClient },
  input: Input,
) => {
  const libros = ctx.db.biblioteca.findMany({});

  return libros;
};
