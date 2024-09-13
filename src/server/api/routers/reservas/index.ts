import { createTRPCRouter } from "@/server/api/trpc";
import { reservaBibliotecaRouter } from "@/server/api/routers/reservas/biblioteca";

export const reservasRouter = createTRPCRouter({
  reservaBiblioteca: reservaBibliotecaRouter,
});
