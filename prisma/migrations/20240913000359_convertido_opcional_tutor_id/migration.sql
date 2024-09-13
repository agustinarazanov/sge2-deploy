-- DropForeignKey
ALTER TABLE "Reserva" DROP CONSTRAINT "Reserva_usuarioTutorId_fkey";

-- AlterTable
ALTER TABLE "Reserva" ALTER COLUMN "usuarioTutorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_usuarioTutorId_fkey" FOREIGN KEY ("usuarioTutorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
