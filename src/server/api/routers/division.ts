import { getTodasLasDivisiones } from "../services/division/division.service";
import { createTRPCRouter } from "../trpc";

export const divisionRouter = createTRPCRouter({
  getAll: getTodasLasDivisiones,
});
