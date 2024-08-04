import { createTRPCRouter } from "@/server/api/trpc";
import { getTodosLosRolesProcedure } from "../../services/admin/roles-admin.service";

export const rolesRouter = createTRPCRouter({
  getAll: getTodosLosRolesProcedure,
});
