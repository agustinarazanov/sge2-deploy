import { createTRPCRouter } from "@/server/api/trpc";
import { reservaBibliotecaRouter } from "@/server/api/routers/reservas/biblioteca";
import { reservaEquipoRouter } from "@/server/api/routers/reservas/equipos";
import { reservaLaboratorioAbiertoRouter } from "@/server/api/routers/reservas/laboratorioAbierto";
import { reservaLaboratorioCerradoRouter } from "@/server/api/routers/reservas/laboratorioCerrado";
import { pantallaRouter } from "./pantalla";
import { laboratorioEnUsoRouter } from "./laboratorioEnUso";

export const reservasRouter = createTRPCRouter({
  reservaBiblioteca: reservaBibliotecaRouter,
  reservaEquipo: reservaEquipoRouter,
  reservaLaboratorioAbierto: reservaLaboratorioAbiertoRouter,
  reservarLaboratorioCerrado: reservaLaboratorioCerradoRouter,
  laboratorioEnUso: laboratorioEnUsoRouter,
  pantalla: pantallaRouter,
});
