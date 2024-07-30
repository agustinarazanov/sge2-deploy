import { createTRPCRouter } from "@/server/api/trpc";
import {
  getTodosLosLibrosProcedure,
  nuevoLibroProcedure,
  eliminarLibroProcedure,
  libroPorIdProcedure,
  editarLibroProcedure,
} from "../services/biblioteca/biblioteca.service";

export const bibliotecaRouter = createTRPCRouter({
  getAll: getTodosLosLibrosProcedure,
  libroPorId: libroPorIdProcedure,
  nuevoLibro: nuevoLibroProcedure,
  editarLibro: editarLibroProcedure,
  eliminarLibro: eliminarLibroProcedure,
});
