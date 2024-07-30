import { createTRPCRouter } from "@/server/api/trpc";
import {
  getTodosLosLibrosProcedure,
  nuevoLibroProcedure,
  eliminarLibroProcedure,
  libroPorIdProcedure,
} from "../services/biblioteca/biblioteca.service";

export const bibliotecaRouter = createTRPCRouter({
  getAll: getTodosLosLibrosProcedure,
  libroPorId: libroPorIdProcedure,
  nuevoLibro: nuevoLibroProcedure,
  eliminarLibro: eliminarLibroProcedure,
});
