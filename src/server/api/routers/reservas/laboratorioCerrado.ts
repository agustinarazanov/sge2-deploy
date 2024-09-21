import { getReservaLaboratorioCerradoPorUserProcedure } from "../../services/reservas/laboratorioCerrado.service";
import { createTRPCRouter } from "../../trpc";

export const reservaLaboratorioCerradoRouter = createTRPCRouter({
  getReservaPorUser: getReservaLaboratorioCerradoPorUserProcedure,
});
