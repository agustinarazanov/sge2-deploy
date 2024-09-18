import type { inputGetReservaPorUsuarioId } from "@/shared/filters/reservas-filter.schema";
import type { PrismaClient, Prisma } from "@prisma/client";
import type { z } from "zod";

type InputGetPorUsuarioID = z.infer<typeof inputGetReservaPorUsuarioId>;
export const getReservaPorUsuarioId = async (ctx: { db: PrismaClient }, input: InputGetPorUsuarioID) => {
  const { id } = input;

  const filtrosWhereReservaLaboratorioAbierto: Prisma.ReservaLaboratorioAbiertoWhereInput = {
    usuarioCreadorId: id,
  };

  const reservas = await ctx.db.reservaLaboratorioAbierto.findMany({
    where: filtrosWhereReservaLaboratorioAbierto,
    include: {
      reserva: true,
      laboratorio: true,
    },
    orderBy: {
      fechaCreacion: "desc",
    },
  });

  return reservas;
};
