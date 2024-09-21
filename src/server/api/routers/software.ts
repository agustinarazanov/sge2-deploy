import { createTRPCRouter } from "@/server/api/trpc";
import {
  editarSoftwareProcedure,
  getAllSoftwareProcedure,
  nuevoSoftwareProcedure,
  getSoftwarePorIdProcedure,
  eliminarSoftwareProcedure,
} from "../services/laboratorios/software.service";

export const softwareRouter = createTRPCRouter({
  getAll: getAllSoftwareProcedure,
  getPorId: getSoftwarePorIdProcedure,
  editarSoftware: editarSoftwareProcedure,
  nuevoSoftware: nuevoSoftwareProcedure,
  eliminarSoftware: eliminarSoftwareProcedure,
});
