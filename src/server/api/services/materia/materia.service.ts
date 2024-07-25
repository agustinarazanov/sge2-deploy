import { getAllMaterias } from "../../repositories/materia/materia.repository";
import { protectedProcedure } from "../../trpc";

export const getAllMateriasProcedure = protectedProcedure.query(async ({ ctx }) => {
  const libros = await getAllMaterias(ctx);

  return libros;
});
