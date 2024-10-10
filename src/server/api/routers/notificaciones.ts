import { createTRPCRouter } from "@/server/api/trpc";
import { getAllPendientesNotificacionesProcedure } from "../services/notificacion/notificacion.service";

export const notificacionRouter = createTRPCRouter({
  getPendientes: getAllPendientesNotificacionesProcedure,
});
