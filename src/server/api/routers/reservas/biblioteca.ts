import { createTRPCRouter } from "@/server/api/trpc";
import {
  getReservaLibroPorUserProcedure,
  crearPrestamoLibroProcedure,
} from "@/server/api/services/reservas/biblioteca.service";

export const reservaBibliotecaRouter = createTRPCRouter({
  getReservaPorUser: getReservaLibroPorUserProcedure,
  crearReserva: crearPrestamoLibroProcedure,
});
