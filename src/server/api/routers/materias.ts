import { createTRPCRouter } from "@/server/api/trpc";
import { getAllMateriasProcedure } from "../services/materia/materia.service";

export const materiasRouter = createTRPCRouter({
  getAll: getAllMateriasProcedure,
});
