import {
  aprobarReservaProcedure,
  cancelarReservaProcedure,
  editarReservaProcedure,
  getReservaLaboratorioCerradoPorIdProcedure,
  getReservaLaboratorioCerradoPorUserProcedure,
  getTodasLasReservasProcedure,
  inputCrearReservaLaboratorioCerradoProcedure,
  rechazarReservaProcedure,
} from "../../services/reservas/laboratorioCerrado.service";
import { createTRPCRouter } from "../../trpc";

export const reservaLaboratorioCerradoRouter = createTRPCRouter({
  getReservaPorUser: getReservaLaboratorioCerradoPorUserProcedure,
  getAll: getTodasLasReservasProcedure,
  getReservaPorID: getReservaLaboratorioCerradoPorIdProcedure,
  aprobarReserva: aprobarReservaProcedure,
  rechazarReserva: rechazarReservaProcedure,
  cancelarReserva: cancelarReservaProcedure,
  editarReserva: editarReservaProcedure,
  crearReserva: inputCrearReservaLaboratorioCerradoProcedure,
});
