import { type inputGetReservaPorUsuarioId } from "@/shared/filters/reservas-filter.schema";
import { type PrismaClient, type Prisma } from "@prisma/client";
import { type z } from "zod";

type InputGetPorUsuarioID = z.infer<typeof inputGetReservaPorUsuarioId>;
export const getReservaPorUsuarioId = async (ctx: { db: PrismaClient }, input: InputGetPorUsuarioID) => {
  const { id } = input;

  const filtrosWhereReservaEquipo: Prisma.ReservaEquipoWhereInput = {
    usuarioCreadorId: id,
  };

  const reservas = await ctx.db.reservaEquipo.findMany({
    where: filtrosWhereReservaEquipo,
    include: {
      reserva: true,
      equipo: true,
    },
    orderBy: {
      fechaCreacion: "desc",
    },
  });

  return reservas;
};
