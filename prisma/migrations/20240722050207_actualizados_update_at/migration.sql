-- AlterTable
ALTER TABLE "Armario" ALTER COLUMN "fechaModificacion" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Curso" ALTER COLUMN "fechaModificacion" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Equipo" ALTER COLUMN "fechaModificacion" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Estante" ALTER COLUMN "fechaModificacion" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Laboratorio" ALTER COLUMN "laboratorioAbiertoTipo" DROP NOT NULL,
ALTER COLUMN "fechaModificacion" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Libro" ALTER COLUMN "fechaModificacion" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Materia" ALTER COLUMN "fechaModificacion" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "MateriaCorrelativa" ALTER COLUMN "fechaModificacion" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Permiso" ALTER COLUMN "fechaModificacion" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "ReservaEquipo" ALTER COLUMN "fechaModificacion" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "ReservaLaboratorioAbierto" ALTER COLUMN "fechaModificacion" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "ReservaLaboratorioAbiertoEquipo" ALTER COLUMN "fechaModificacion" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "ReservaLaboratorioCerrado" ALTER COLUMN "fechaModificacion" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "ReservaLaboratorioCerradoEquipo" ALTER COLUMN "fechaModificacion" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "ReservaLibro" ALTER COLUMN "fechaModificacion" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Rol" ALTER COLUMN "fechaModificacion" SET DEFAULT CURRENT_TIMESTAMP;
