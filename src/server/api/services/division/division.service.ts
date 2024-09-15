import { getAllDivisiones } from "../../repositories/division/division.repository";
import { protectedProcedure } from "../../trpc";

export const getTodasLasDivisiones = protectedProcedure.query(async ({ ctx }) => {
  return await getAllDivisiones(ctx);
});
