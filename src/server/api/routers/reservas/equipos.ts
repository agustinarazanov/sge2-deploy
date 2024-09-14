import { createTRPCRouter } from "@/server/api/trpc";
import { getReservaEquipoPorUserProcedure } from "../../services/reservas/equipo.service";

export const reservaEquipoRouter = createTRPCRouter({
  getReservaPorUser: getReservaEquipoPorUserProcedure,
});
