/*
  Warnings:

  - You are about to drop the column `sexo` on the `User` table. All the data in the column will be lost.
  - The `emailVerified` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[legajo]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `activo` to the `Tutor` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `image` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "usuario_legajo_asc_idx";

-- AlterTable
ALTER TABLE "Tutor" ADD COLUMN     "activo" BOOLEAN NOT NULL,
ALTER COLUMN "sede" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "sexo",
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "email" SET NOT NULL,
DROP COLUMN "emailVerified",
ADD COLUMN     "emailVerified" BOOLEAN,
ALTER COLUMN "image" SET NOT NULL,
ALTER COLUMN "fechaNacimiento" SET DATA TYPE DATE;

-- CreateIndex
CREATE UNIQUE INDEX "usuario_legajo_asc_idx" ON "User"("legajo" ASC);
