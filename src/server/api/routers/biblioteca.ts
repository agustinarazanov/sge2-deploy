import { createTRPCRouter } from "@/server/api/trpc";
import { getAllBooksProcedure } from "../services/biblioteca/biblioteca.service";

export const bibliotecaRouter = createTRPCRouter({
    getAll: getAllBooksProcedure,
});
