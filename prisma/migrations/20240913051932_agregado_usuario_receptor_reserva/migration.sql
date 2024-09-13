-- AlterTable
ALTER TABLE "Reserva" ADD COLUMN     "fechaRecibido" TIMESTAMP(3),
ADD COLUMN     "usuarioRecibioId" TEXT;

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_usuarioRecibioId_fkey" FOREIGN KEY ("usuarioRecibioId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
