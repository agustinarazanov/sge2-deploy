import { protectedProcedure } from "../../trpc";
import { getAllLibros, addLibro } from "../../repositories/biblioteca/biblioteca.repository";
import { inputAddBooks, inputGetBooks } from "@/shared/biblioteca-filter.schema";

export const getAllBooksProcedure = protectedProcedure.input(inputGetBooks).query(async ({ ctx, input }) => {
  const libros = await getAllLibros(ctx, input);

  return libros;
});

export const nuevoLibroProcedure = protectedProcedure.input(inputAddBooks).mutation(async ({ ctx, input }) => {
  const isValidInput = inputAddBooks.safeParse(input);
  if (!isValidInput.success) {
    throw new Error("Invalid input");
  }

  const userId = ctx.session.user.id;

  const libro = await addLibro(ctx, input, userId);

  return libro;
});
