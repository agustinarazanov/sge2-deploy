import {
  getReservaLaboratorioAbiertoPorUserProcedure,
  getTodasLasReservasProcedure,
  getReservaLaboratorioAbiertoPorIdProcedure,
  aprobarReservaProcedure,
  rechazarReservaProcedure,
  editarReservaProcedure,
  cancelarReservaProcedure,
  inputCrearReservaLaboratorioAbiertoProcedure,
} from "../../services/reservas/laboratorioAbierto.service";
import { createTRPCRouter } from "../../trpc";

export const reservaLaboratorioAbiertoRouter = createTRPCRouter({
  getReservaPorUser: getReservaLaboratorioAbiertoPorUserProcedure,
  getAll: getTodasLasReservasProcedure,
  getReservaPorID: getReservaLaboratorioAbiertoPorIdProcedure,
  aprobarReserva: aprobarReservaProcedure,
  rechazarReserva: rechazarReservaProcedure,
  cancelarReserva: cancelarReservaProcedure,
  editarReserva: editarReservaProcedure,
  crearReserva: inputCrearReservaLaboratorioAbiertoProcedure,
});
