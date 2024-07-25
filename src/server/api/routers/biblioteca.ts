import { createTRPCRouter } from "@/server/api/trpc";
import {
  getTodosLosLibrosProcedure,
  nuevoLibroProcedure,
  eliminarLibroProcedure,
} from "../services/biblioteca/biblioteca.service";

export const bibliotecaRouter = createTRPCRouter({
  getAll: getTodosLosLibrosProcedure,
  nuevoLibro: nuevoLibroProcedure,
  eliminarLibro: eliminarLibroProcedure,
});
