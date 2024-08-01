import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { bibliotecaRouter } from "./routers/biblioteca";
import { materiasRouter } from "./routers/materias";
import { equiposRouter } from "./routers/equipos";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  biblioteca: bibliotecaRouter,
  materia: materiasRouter,
  equipos: equiposRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
