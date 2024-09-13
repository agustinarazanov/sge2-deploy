import { createTRPCRouter } from "@/server/api/trpc";
import {
  getReservaLibroPorUserProcedure,
  crearPrestamoLibroProcedure,
  verReservasProcedure,
  devolverLibroProcedure,
} from "@/server/api/services/reservas/biblioteca.service";

export const reservaBibliotecaRouter = createTRPCRouter({
  getReservaPorUser: getReservaLibroPorUserProcedure,
  crearReserva: crearPrestamoLibroProcedure,
  verReservas: verReservasProcedure,
  devolverLibro: devolverLibroProcedure,
});
