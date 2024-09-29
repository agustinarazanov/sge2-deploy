import {
  agregarReservaPantallaProcedure,
  getReservasEnPantallaProcedure,
  removerReservaPantallaProcedure,
} from "../../services/reservas/pantalla.service";
import { createTRPCRouter } from "../../trpc";

export const pantallaRouter = createTRPCRouter({
  getReservaPorUser: getReservasEnPantallaProcedure,
  eliminarReservaPantalla: removerReservaPantallaProcedure,
  agregarReservaPantalla: agregarReservaPantallaProcedure,
});
