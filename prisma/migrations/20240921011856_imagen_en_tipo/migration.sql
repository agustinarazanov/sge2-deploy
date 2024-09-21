-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "refresh_expires_in" INTEGER;

-- AlterTable
ALTER TABLE "EquipoTipo" ADD COLUMN     "imagen" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "esTutor" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "image" SET DEFAULT '/default-avatar.svg';
