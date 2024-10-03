import {
  eliminarDivisionProcedure,
  getTodasLasDivisiones,
  editarDivisionProcedure,
  nuevaDivisionProcedure,
  getDivisionByIdProcedure,
} from "../services/division/division.service";
import { createTRPCRouter } from "../trpc";

export const divisionRouter = createTRPCRouter({
  getAll: getTodasLasDivisiones,
  getDivisionById: getDivisionByIdProcedure,
  eliminarDivision: eliminarDivisionProcedure,
  editarDivision: editarDivisionProcedure,
  nuevaDivision: nuevaDivisionProcedure,
});
