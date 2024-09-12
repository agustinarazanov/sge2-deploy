import { createTRPCRouter } from "@/server/api/trpc";
import {
  getReservaLibroPorUserProcedure,
} from "@/server/api/services/reservas/biblioteca.service";

export const reservaBibliotecaRouter = createTRPCRouter({
  getReservaPorUser:getReservaLibroPorUserProcedure,
});
