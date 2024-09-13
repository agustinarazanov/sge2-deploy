import { createTRPCRouter } from "@/server/api/trpc";
import {
  getReservaLibroPorUserProcedure,
  crearPrestamoLibroProcedure,
  verReservasProcedure,
  devolverLibroProcedure,
  getTodasLasReservasProcedure,
  renovarLibroProcedure,
} from "@/server/api/services/reservas/biblioteca.service";

export const reservaBibliotecaRouter = createTRPCRouter({
  getAll: getTodasLasReservasProcedure,

  getReservaPorUser: getReservaLibroPorUserProcedure,
  crearReserva: crearPrestamoLibroProcedure,
  verReservas: verReservasProcedure,
  devolverLibro: devolverLibroProcedure,
  renovarLibro: renovarLibroProcedure,
});
