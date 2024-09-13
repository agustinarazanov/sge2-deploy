-- DropForeignKey
ALTER TABLE "Reserva" DROP CONSTRAINT "Reserva_usuarioCreadorId_fkey";

-- DropForeignKey
ALTER TABLE "Reserva" DROP CONSTRAINT "Reserva_usuarioModificadorId_fkey";

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_usuarioSolicitoId_fkey" FOREIGN KEY ("usuarioSolicitoId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_usuarioRenovoId_fkey" FOREIGN KEY ("usuarioRenovoId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
