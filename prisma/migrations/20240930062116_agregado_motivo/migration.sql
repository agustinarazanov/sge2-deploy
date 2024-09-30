-- AlterTable
ALTER TABLE "Reserva" ADD COLUMN     "motivoRechazo" TEXT;

-- CreateIndex
CREATE INDEX "Tutor_especialidad_idx" ON "Tutor"("especialidad");
