import { createTRPCRouter } from "@/server/api/trpc";
import {
  editarRolProcedure,
  eliminarRolProcedure,
  getRolByIdProcedure,
  getTodosLosPermisosProcedure,
  getTodosLosRolesProcedure,
  nuevoRolProcedure,
} from "../../services/admin/roles-admin.service";

export const rolesRouter = createTRPCRouter({
  getAllRoles: getTodosLosRolesProcedure,
  getRolById: getRolByIdProcedure,
  eliminarRol: eliminarRolProcedure,
  editarRol: editarRolProcedure,
  nuevoRol: nuevoRolProcedure,

  getAllPermisos: getTodosLosPermisosProcedure,
});
