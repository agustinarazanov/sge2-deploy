import { inputGetReservaPorUsuarioId } from "@/shared/filters/reservas-filter.schema";
import { PrismaClient, Prisma } from "@prisma/client";
import { z } from "zod";

type InputGetPorUsuarioID = z.infer<typeof inputGetReservaPorUsuarioId>;
export const getReservaPorUsuarioId = async (ctx: { db: PrismaClient }, input: InputGetPorUsuarioID) => {
  const { id } = input;

  const filtrosWhereReservaLaboratorioCerrado: Prisma.ReservaLaboratorioAbiertoWhereInput = {
    usuarioCreadorId: id,
  };

  const reservas = await ctx.db.reservaLaboratorioAbierto.findMany({
    where: filtrosWhereReservaLaboratorioCerrado,
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
