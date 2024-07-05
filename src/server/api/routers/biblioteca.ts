import { createTRPCRouter } from "@/server/api/trpc";
import {
  getAllBooksProcedure,
  nuevoLibroProcedure,
  eliminarLibroProcedure,
} from "../services/biblioteca/biblioteca.service";

export const bibliotecaRouter = createTRPCRouter({
  getAll: getAllBooksProcedure,
  nuevoLibro: nuevoLibroProcedure,
  eliminarLibro: eliminarLibroProcedure,
});
