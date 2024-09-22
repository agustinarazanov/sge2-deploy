import { createTRPCRouter } from "@/server/api/trpc";
import {
  editarUsuarioProcedure,
  eliminarUsuarioProcedure,
  getAllProfesoresProcedure,
  getAllTutoresProcedure,
  getTodosLosUsuariosProcedure,
  getUsuarioPorIdProcedure,
} from "../../services/admin/usuarios-admin.service";

export const usuariosRouter = createTRPCRouter({
  getAll: getTodosLosUsuariosProcedure,
  getUsuarioPorId: getUsuarioPorIdProcedure,
  eliminarUsuario: eliminarUsuarioProcedure,
  editarUsuario: editarUsuarioProcedure,
  getAllTutores: getAllTutoresProcedure,
  getAllProfesores: getAllProfesoresProcedure,
});
