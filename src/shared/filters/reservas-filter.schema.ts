import {z} from "zod";

export const inputGetReservaLibroPorUsuarioId = z.object({
    id: z.string().min(1),
});