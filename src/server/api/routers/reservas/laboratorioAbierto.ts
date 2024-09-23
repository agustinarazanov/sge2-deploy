import {
  getReservaLaboratorioAbiertoPorUserProcedure,
  getTodasLasReservasProcedure,
  getReservaLaboratorioAbiertoPorIdProcedure,
  aprobarReservaProcedure,
  rechazarReservaProcedure,
} from "../../services/reservas/laboratorioAbierto.service";
import { createTRPCRouter } from "../../trpc";

export const reservaLaboratorioAbiertoRouter = createTRPCRouter({
  getReservaPorUser: getReservaLaboratorioAbiertoPorUserProcedure,
  getAll: getTodasLasReservasProcedure,
  getReservaPorID: getReservaLaboratorioAbiertoPorIdProcedure,
  aprobarReserva: aprobarReservaProcedure,
  rechazarReserva: rechazarReservaProcedure,
});
