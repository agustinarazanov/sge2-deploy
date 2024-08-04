import { createTRPCRouter } from "@/server/api/trpc";
import { laboratoriosRouter } from "./laboratorios";
import { usuariosRouter } from "./usuarios";
import { rolesRouter } from "./roles";

export const adminRouter = createTRPCRouter({
  roles: rolesRouter,
  usuarios: usuariosRouter,
  laboratorios: laboratoriosRouter,
});
