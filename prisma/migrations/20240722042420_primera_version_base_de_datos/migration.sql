/*
  Warnings:

  - You are about to drop the `Biblioteca` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "CursoDia" AS ENUM ('LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO');

-- CreateEnum
CREATE TYPE "LaboratorioAbiertoTipo" AS ENUM ('LA', 'TLA_BASICA', 'TLA');

-- CreateEnum
CREATE TYPE "MateriaDuracion" AS ENUM ('ANUAL', 'CUATRIMESTRAL', 'AMBOS');

-- CreateEnum
CREATE TYPE "MateriaTipo" AS ENUM ('INTEGRADORA', 'OBLIGATORIA', 'ELECTIVA');

-- CreateEnum
CREATE TYPE "EstatusCorrelativa" AS ENUM ('CURSAR_REGULARIZADA', 'CURSAR_APROBADA', 'RENDIR_APROBADA');

-- CreateEnum
CREATE TYPE "ReservaEstatus" AS ENUM ('PENDIENTE', 'FINALIZADA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "ReservaTipo" AS ENUM ('LABORATORIO_ABIERTO', 'LABORATORIO_CERRADO', 'INVENTARIO', 'LIBRO');

-- DropForeignKey
ALTER TABLE "Biblioteca" DROP CONSTRAINT "Biblioteca_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_createdById_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "apellido" TEXT,
ADD COLUMN     "ciudad" TEXT,
ADD COLUMN     "codigoPostal" TEXT,
ADD COLUMN     "departamento" TEXT,
ADD COLUMN     "direccion" TEXT,
ADD COLUMN     "documentoNumero" TEXT,
ADD COLUMN     "documentoTipoId" INTEGER,
ADD COLUMN     "fechaNacimiento" TIMESTAMP(3),
ADD COLUMN     "fechaRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "fechaUltimaActualizacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "fechaUltimoAcceso" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "gitlab" TEXT,
ADD COLUMN     "legajo" TEXT,
ADD COLUMN     "paisIso" TEXT,
ADD COLUMN     "penalizaciones" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "piso" TEXT,
ADD COLUMN     "provinciaIso" TEXT,
ADD COLUMN     "sexo" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "telefonoCasa" TEXT,
ADD COLUMN     "telefonoCelular" TEXT,
ADD COLUMN     "telefonoLaboral" TEXT;

-- DropTable
DROP TABLE "Biblioteca";

-- DropTable
DROP TABLE "Post";

-- CreateTable
CREATE TABLE "Libro" (
    "id" SERIAL NOT NULL,
    "bibliotecaId" TEXT NOT NULL,
    "inventarioId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "anio" INTEGER NOT NULL,
    "isbn" TEXT NOT NULL,
    "laboratorioId" INTEGER NOT NULL,
    "armarioId" INTEGER NOT NULL,
    "estanteId" INTEGER NOT NULL,
    "autorId" INTEGER NOT NULL,
    "idiomaId" INTEGER NOT NULL,
    "editorialId" INTEGER NOT NULL,
    "sedeId" INTEGER NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaModificacion" TIMESTAMP(3) NOT NULL,
    "usuarioCreadorId" TEXT NOT NULL,
    "usuarioModificadorId" TEXT NOT NULL,

    CONSTRAINT "Libro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LibroMateria" (
    "libroId" INTEGER NOT NULL,
    "materiaId" INTEGER NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioCreadorId" TEXT NOT NULL,

    CONSTRAINT "LibroMateria_pkey" PRIMARY KEY ("libroId","materiaId")
);

-- CreateTable
CREATE TABLE "LibroAutor" (
    "id" SERIAL NOT NULL,
    "autorNombre" TEXT NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioCreadorId" TEXT NOT NULL,

    CONSTRAINT "LibroAutor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LibroIdioma" (
    "id" SERIAL NOT NULL,
    "idioma" TEXT NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioCreadorId" TEXT NOT NULL,

    CONSTRAINT "LibroIdioma_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LibroEditorial" (
    "id" SERIAL NOT NULL,
    "editorial" TEXT NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioCreadorId" TEXT NOT NULL,

    CONSTRAINT "LibroEditorial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Curso" (
    "id" SERIAL NOT NULL,
    "horaInicio1" TEXT NOT NULL,
    "duracion1" TEXT NOT NULL,
    "horaInicio2" TEXT NOT NULL,
    "duracion2" TEXT NOT NULL,
    "dia1" "CursoDia" NOT NULL,
    "dia2" "CursoDia" NOT NULL,
    "profesorUserId" TEXT NOT NULL,
    "ayudanteUserId" TEXT NOT NULL,
    "anioDeCarrera" INTEGER NOT NULL,
    "activo" BOOLEAN NOT NULL,
    "ac" TEXT NOT NULL,
    "sedeId" INTEGER NOT NULL,
    "materiaId" INTEGER NOT NULL,
    "divisionId" INTEGER NOT NULL,
    "turnoId" INTEGER NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaModificacion" TIMESTAMP(3) NOT NULL,
    "usuarioCreadorId" TEXT NOT NULL,
    "usuarioModificadorId" TEXT NOT NULL,

    CONSTRAINT "Curso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Division" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "anio" INTEGER NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioCreadorId" TEXT NOT NULL,

    CONSTRAINT "Division_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CursoTurno" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioCreadorId" TEXT NOT NULL,

    CONSTRAINT "CursoTurno_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Equipo" (
    "id" SERIAL NOT NULL,
    "inventarioId" INTEGER NOT NULL,
    "modelo" TEXT NOT NULL,
    "numeroSerie" TEXT NOT NULL,
    "observaciones" TEXT NOT NULL,
    "palabrasClave" TEXT NOT NULL,
    "imagen" TEXT NOT NULL,
    "tipoId" INTEGER NOT NULL,
    "marcaId" INTEGER NOT NULL,
    "sedeId" INTEGER NOT NULL,
    "laboratorioId" INTEGER NOT NULL,
    "armarioId" INTEGER NOT NULL,
    "estanteId" INTEGER NOT NULL,
    "estadoId" INTEGER NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaModificacion" TIMESTAMP(3) NOT NULL,
    "usuarioCreadorId" TEXT NOT NULL,
    "usuarioModificadorId" TEXT NOT NULL,

    CONSTRAINT "Equipo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EquipoMarca" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioCreadorId" TEXT NOT NULL,

    CONSTRAINT "EquipoMarca_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EquipoTipo" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioCreadorId" TEXT NOT NULL,

    CONSTRAINT "EquipoTipo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EquipoEstado" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioCreadorId" TEXT NOT NULL,

    CONSTRAINT "EquipoEstado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Laboratorio" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "tienePc" BOOLEAN NOT NULL,
    "esAbierto" BOOLEAN NOT NULL,
    "laboratorioAbiertoTipo" "LaboratorioAbiertoTipo" NOT NULL,
    "sedeId" INTEGER NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaModificacion" TIMESTAMP(3) NOT NULL,
    "usuarioCreadorId" TEXT NOT NULL,
    "usuarioModificadorId" TEXT NOT NULL,

    CONSTRAINT "Laboratorio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Armario" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "laboratorioId" INTEGER NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaModificacion" TIMESTAMP(3) NOT NULL,
    "usuarioCreadorId" TEXT NOT NULL,
    "usuarioModificadorId" TEXT NOT NULL,

    CONSTRAINT "Armario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Estante" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "estanteId" INTEGER NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaModificacion" TIMESTAMP(3) NOT NULL,
    "usuarioCreadorId" TEXT NOT NULL,
    "usuarioModificadorId" TEXT NOT NULL,

    CONSTRAINT "Estante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Materia" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "anio" INTEGER NOT NULL,
    "duracion" "MateriaDuracion" NOT NULL,
    "tipo" "MateriaTipo" NOT NULL,
    "directorUsuarioId" TEXT NOT NULL,
    "jefeTrabajoPracticoUsuarioId" TEXT NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaModificacion" TIMESTAMP(3) NOT NULL,
    "usuarioCreadorId" TEXT NOT NULL,
    "usuarioModificadorId" TEXT NOT NULL,

    CONSTRAINT "Materia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MateriaCorrelativa" (
    "materiaPrerequisitoId" INTEGER NOT NULL,
    "correlativaId" INTEGER NOT NULL,
    "estatusCorrelativa" "EstatusCorrelativa" NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaModificacion" TIMESTAMP(3) NOT NULL,
    "usuarioCreadorId" TEXT NOT NULL,
    "usuarioModificadorId" TEXT NOT NULL,

    CONSTRAINT "MateriaCorrelativa_pkey" PRIMARY KEY ("materiaPrerequisitoId","correlativaId")
);

-- CreateTable
CREATE TABLE "Reserva" (
    "id" SERIAL NOT NULL,
    "estatus" "ReservaEstatus" NOT NULL,
    "fechaHoraInicio" TIMESTAMP(3) NOT NULL,
    "fechaHoraFin" TIMESTAMP(3) NOT NULL,
    "codigo" TEXT NOT NULL,
    "tipo" "ReservaTipo" NOT NULL,
    "usuarioCreadorId" TEXT NOT NULL,
    "usuarioModificadorId" TEXT NOT NULL,
    "usuarioTutorId" TEXT NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaModificacion" TIMESTAMP(3) NOT NULL,
    "fechaAprobacion" TIMESTAMP(3),

    CONSTRAINT "Reserva_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReservaEquipo" (
    "id" SERIAL NOT NULL,
    "fechaEntregado" TIMESTAMP(3) NOT NULL,
    "numeroReserva" INTEGER NOT NULL,
    "reservaId" INTEGER NOT NULL,
    "equipoId" INTEGER NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaModificacion" TIMESTAMP(3) NOT NULL,
    "usuarioCreadorId" TEXT NOT NULL,
    "usuarioModificadorId" TEXT NOT NULL,

    CONSTRAINT "ReservaEquipo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReservaLibro" (
    "id" SERIAL NOT NULL,
    "fechaEntregado" TIMESTAMP(3) NOT NULL,
    "reservaId" INTEGER NOT NULL,
    "libroId" INTEGER NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaModificacion" TIMESTAMP(3) NOT NULL,
    "usuarioCreadorId" TEXT NOT NULL,
    "usuarioModificadorId" TEXT NOT NULL,

    CONSTRAINT "ReservaLibro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReservaLaboratorioCerrado" (
    "id" SERIAL NOT NULL,
    "reservaId" INTEGER NOT NULL,
    "laboratorioId" INTEGER NOT NULL,
    "cursoId" INTEGER NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaModificacion" TIMESTAMP(3) NOT NULL,
    "usuarioCreadorId" TEXT NOT NULL,
    "usuarioModificadorId" TEXT NOT NULL,

    CONSTRAINT "ReservaLaboratorioCerrado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReservaLaboratorioCerradoEquipo" (
    "id" SERIAL NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "reservaLaboratorioCerradoId" INTEGER NOT NULL,
    "equipoId" INTEGER NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaModificacion" TIMESTAMP(3) NOT NULL,
    "usuarioCreadorId" TEXT NOT NULL,
    "usuarioModificadorId" TEXT NOT NULL,

    CONSTRAINT "ReservaLaboratorioCerradoEquipo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReservaLaboratorioAbierto" (
    "id" SERIAL NOT NULL,
    "especialidad" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "numeroReserva" INTEGER NOT NULL,
    "mailConfirmado" BOOLEAN NOT NULL,
    "reservaId" INTEGER NOT NULL,
    "laboratorioId" INTEGER NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaModificacion" TIMESTAMP(3) NOT NULL,
    "usuarioCreadorId" TEXT NOT NULL,
    "usuarioModificadorId" TEXT NOT NULL,

    CONSTRAINT "ReservaLaboratorioAbierto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReservaLaboratorioAbiertoEquipo" (
    "id" SERIAL NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "reservaLaboratorioAbiertoId" INTEGER NOT NULL,
    "equipoId" INTEGER NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaModificacion" TIMESTAMP(3) NOT NULL,
    "usuarioCreadorId" TEXT NOT NULL,
    "usuarioModificadorId" TEXT NOT NULL,

    CONSTRAINT "ReservaLaboratorioAbiertoEquipo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sede" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Sede_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsuarioRol" (
    "userId" TEXT NOT NULL,
    "rolId" INTEGER NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioCreadorId" TEXT NOT NULL,

    CONSTRAINT "UsuarioRol_pkey" PRIMARY KEY ("userId","rolId")
);

-- CreateTable
CREATE TABLE "Rol" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaModificacion" TIMESTAMP(3) NOT NULL,
    "usuarioCreadorId" TEXT NOT NULL,
    "usuarioModificadorId" TEXT NOT NULL,

    CONSTRAINT "Rol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolPermiso" (
    "rolId" INTEGER NOT NULL,
    "permisoId" INTEGER NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioCreadorId" TEXT NOT NULL,

    CONSTRAINT "RolPermiso_pkey" PRIMARY KEY ("rolId","permisoId")
);

-- CreateTable
CREATE TABLE "Permiso" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaModificacion" TIMESTAMP(3) NOT NULL,
    "usuarioCreadorId" TEXT NOT NULL,
    "usuarioModificadorId" TEXT NOT NULL,

    CONSTRAINT "Permiso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Provincia" (
    "iso" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "paisIso" TEXT NOT NULL,

    CONSTRAINT "Provincia_pkey" PRIMARY KEY ("iso")
);

-- CreateTable
CREATE TABLE "Pais" (
    "iso" TEXT NOT NULL,
    "nombreEspanol" TEXT NOT NULL,
    "nombreIngles" TEXT NOT NULL,
    "iso3" TEXT NOT NULL,
    "codigoNumerico" INTEGER NOT NULL,

    CONSTRAINT "Pais_pkey" PRIMARY KEY ("iso")
);

-- CreateTable
CREATE TABLE "DocumentoTipo" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "DocumentoTipo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Libro_bibliotecaId_key" ON "Libro"("bibliotecaId");

-- CreateIndex
CREATE UNIQUE INDEX "Libro_inventarioId_key" ON "Libro"("inventarioId");

-- CreateIndex
CREATE UNIQUE INDEX "Libro_isbn_key" ON "Libro"("isbn");

-- CreateIndex
CREATE INDEX "Libro_bibliotecaId_idx" ON "Libro"("bibliotecaId");

-- CreateIndex
CREATE INDEX "Libro_inventarioId_idx" ON "Libro"("inventarioId");

-- CreateIndex
CREATE INDEX "Libro_titulo_idx" ON "Libro"("titulo" ASC);

-- CreateIndex
CREATE INDEX "Libro_anio_idx" ON "Libro"("anio" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "LibroAutor_autorNombre_key" ON "LibroAutor"("autorNombre");

-- CreateIndex
CREATE INDEX "LibroAutor_autorNombre_idx" ON "LibroAutor"("autorNombre" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "LibroIdioma_idioma_key" ON "LibroIdioma"("idioma");

-- CreateIndex
CREATE INDEX "LibroIdioma_idioma_idx" ON "LibroIdioma"("idioma" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "LibroEditorial_editorial_key" ON "LibroEditorial"("editorial");

-- CreateIndex
CREATE INDEX "LibroEditorial_editorial_idx" ON "LibroEditorial"("editorial" ASC);

-- CreateIndex
CREATE INDEX "Curso_anioDeCarrera_idx" ON "Curso"("anioDeCarrera" ASC);

-- CreateIndex
CREATE INDEX "Curso_activo_idx" ON "Curso" USING HASH ("activo");

-- CreateIndex
CREATE INDEX "Division_anio_idx" ON "Division"("anio" ASC);

-- CreateIndex
CREATE INDEX "Division_nombre_idx" ON "Division"("nombre" ASC);

-- CreateIndex
CREATE INDEX "CursoTurno_nombre_idx" ON "CursoTurno"("nombre" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Equipo_inventarioId_key" ON "Equipo"("inventarioId");

-- CreateIndex
CREATE INDEX "Equipo_modelo_idx" ON "Equipo"("modelo" ASC);

-- CreateIndex
CREATE INDEX "Equipo_numeroSerie_idx" ON "Equipo"("numeroSerie" ASC);

-- CreateIndex
CREATE INDEX "EquipoMarca_nombre_idx" ON "EquipoMarca"("nombre" ASC);

-- CreateIndex
CREATE INDEX "EquipoTipo_nombre_idx" ON "EquipoTipo"("nombre" ASC);

-- CreateIndex
CREATE INDEX "EquipoEstado_nombre_idx" ON "EquipoEstado"("nombre" ASC);

-- CreateIndex
CREATE INDEX "Laboratorio_nombre_idx" ON "Laboratorio"("nombre" ASC);

-- CreateIndex
CREATE INDEX "Laboratorio_tienePc_idx" ON "Laboratorio" USING HASH ("tienePc");

-- CreateIndex
CREATE INDEX "Laboratorio_esAbierto_idx" ON "Laboratorio" USING HASH ("esAbierto");

-- CreateIndex
CREATE INDEX "Laboratorio_laboratorioAbiertoTipo_idx" ON "Laboratorio"("laboratorioAbiertoTipo");

-- CreateIndex
CREATE UNIQUE INDEX "Materia_codigo_key" ON "Materia"("codigo");

-- CreateIndex
CREATE INDEX "Materia_nombre_idx" ON "Materia"("nombre" ASC);

-- CreateIndex
CREATE INDEX "Materia_anio_idx" ON "Materia"("anio" ASC);

-- CreateIndex
CREATE INDEX "Materia_duracion_idx" ON "Materia"("duracion");

-- CreateIndex
CREATE INDEX "Materia_tipo_idx" ON "Materia"("tipo");

-- CreateIndex
CREATE UNIQUE INDEX "Reserva_codigo_key" ON "Reserva"("codigo");

-- CreateIndex
CREATE INDEX "Reserva_estatus_idx" ON "Reserva"("estatus");

-- CreateIndex
CREATE INDEX "Reserva_fechaHoraInicio_idx" ON "Reserva"("fechaHoraInicio" ASC);

-- CreateIndex
CREATE INDEX "Reserva_fechaHoraFin_idx" ON "Reserva"("fechaHoraFin" ASC);

-- CreateIndex
CREATE INDEX "Reserva_tipo_idx" ON "Reserva"("tipo");

-- CreateIndex
CREATE UNIQUE INDEX "ReservaEquipo_reservaId_key" ON "ReservaEquipo"("reservaId");

-- CreateIndex
CREATE INDEX "ReservaEquipo_fechaEntregado_idx" ON "ReservaEquipo"("fechaEntregado" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "ReservaLibro_reservaId_key" ON "ReservaLibro"("reservaId");

-- CreateIndex
CREATE INDEX "ReservaLibro_fechaEntregado_idx" ON "ReservaLibro"("fechaEntregado" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "ReservaLaboratorioCerrado_reservaId_key" ON "ReservaLaboratorioCerrado"("reservaId");

-- CreateIndex
CREATE UNIQUE INDEX "ReservaLaboratorioAbierto_reservaId_key" ON "ReservaLaboratorioAbierto"("reservaId");

-- CreateIndex
CREATE INDEX "ReservaLaboratorioAbierto_especialidad_idx" ON "ReservaLaboratorioAbierto"("especialidad" ASC);

-- CreateIndex
CREATE INDEX "ReservaLaboratorioAbierto_numeroReserva_idx" ON "ReservaLaboratorioAbierto"("numeroReserva" ASC);

-- CreateIndex
CREATE INDEX "ReservaLaboratorioAbierto_mailConfirmado_idx" ON "ReservaLaboratorioAbierto" USING HASH ("mailConfirmado");

-- CreateIndex
CREATE UNIQUE INDEX "Sede_nombre_key" ON "Sede"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Rol_nombre_key" ON "Rol"("nombre");

-- CreateIndex
CREATE INDEX "Rol_nombre_idx" ON "Rol"("nombre" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Permiso_nombre_key" ON "Permiso"("nombre");

-- CreateIndex
CREATE INDEX "Permiso_nombre_idx" ON "Permiso"("nombre" ASC);

-- CreateIndex
CREATE INDEX "Provincia_nombre_idx" ON "Provincia"("nombre");

-- CreateIndex
CREATE INDEX "Pais_nombreEspanol_idx" ON "Pais"("nombreEspanol" ASC);

-- CreateIndex
CREATE INDEX "Pais_iso3_idx" ON "Pais"("iso3");

-- CreateIndex
CREATE INDEX "Pais_codigoNumerico_idx" ON "Pais"("codigoNumerico");

-- CreateIndex
CREATE INDEX "User_name_idx" ON "User"("name" ASC);

-- CreateIndex
CREATE INDEX "User_apellido_idx" ON "User"("apellido" ASC);

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email" ASC);

-- CreateIndex
CREATE INDEX "usuario_legajo_asc_idx" ON "User"("legajo" ASC);

-- CreateIndex
CREATE INDEX "usuario_legajo_hash_idx" ON "User" USING HASH ("legajo");

-- AddForeignKey
ALTER TABLE "Libro" ADD CONSTRAINT "Libro_laboratorioId_fkey" FOREIGN KEY ("laboratorioId") REFERENCES "Laboratorio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Libro" ADD CONSTRAINT "Libro_armarioId_fkey" FOREIGN KEY ("armarioId") REFERENCES "Armario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Libro" ADD CONSTRAINT "Libro_estanteId_fkey" FOREIGN KEY ("estanteId") REFERENCES "Estante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Libro" ADD CONSTRAINT "Libro_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "LibroAutor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Libro" ADD CONSTRAINT "Libro_idiomaId_fkey" FOREIGN KEY ("idiomaId") REFERENCES "LibroIdioma"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Libro" ADD CONSTRAINT "Libro_editorialId_fkey" FOREIGN KEY ("editorialId") REFERENCES "LibroEditorial"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Libro" ADD CONSTRAINT "Libro_sedeId_fkey" FOREIGN KEY ("sedeId") REFERENCES "Sede"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LibroMateria" ADD CONSTRAINT "LibroMateria_libroId_fkey" FOREIGN KEY ("libroId") REFERENCES "Libro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LibroMateria" ADD CONSTRAINT "LibroMateria_materiaId_fkey" FOREIGN KEY ("materiaId") REFERENCES "Materia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Curso" ADD CONSTRAINT "Curso_profesorUserId_fkey" FOREIGN KEY ("profesorUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Curso" ADD CONSTRAINT "Curso_ayudanteUserId_fkey" FOREIGN KEY ("ayudanteUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Curso" ADD CONSTRAINT "Curso_sedeId_fkey" FOREIGN KEY ("sedeId") REFERENCES "Sede"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Curso" ADD CONSTRAINT "Curso_materiaId_fkey" FOREIGN KEY ("materiaId") REFERENCES "Materia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Curso" ADD CONSTRAINT "Curso_divisionId_fkey" FOREIGN KEY ("divisionId") REFERENCES "Division"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Curso" ADD CONSTRAINT "Curso_turnoId_fkey" FOREIGN KEY ("turnoId") REFERENCES "CursoTurno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Equipo" ADD CONSTRAINT "Equipo_tipoId_fkey" FOREIGN KEY ("tipoId") REFERENCES "EquipoTipo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Equipo" ADD CONSTRAINT "Equipo_marcaId_fkey" FOREIGN KEY ("marcaId") REFERENCES "EquipoMarca"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Equipo" ADD CONSTRAINT "Equipo_sedeId_fkey" FOREIGN KEY ("sedeId") REFERENCES "Sede"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Equipo" ADD CONSTRAINT "Equipo_laboratorioId_fkey" FOREIGN KEY ("laboratorioId") REFERENCES "Laboratorio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Equipo" ADD CONSTRAINT "Equipo_armarioId_fkey" FOREIGN KEY ("armarioId") REFERENCES "Armario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Equipo" ADD CONSTRAINT "Equipo_estanteId_fkey" FOREIGN KEY ("estanteId") REFERENCES "Estante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Equipo" ADD CONSTRAINT "Equipo_estadoId_fkey" FOREIGN KEY ("estadoId") REFERENCES "EquipoEstado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Laboratorio" ADD CONSTRAINT "Laboratorio_sedeId_fkey" FOREIGN KEY ("sedeId") REFERENCES "Sede"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Armario" ADD CONSTRAINT "Armario_laboratorioId_fkey" FOREIGN KEY ("laboratorioId") REFERENCES "Laboratorio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Estante" ADD CONSTRAINT "Estante_estanteId_fkey" FOREIGN KEY ("estanteId") REFERENCES "Armario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Materia" ADD CONSTRAINT "Materia_directorUsuarioId_fkey" FOREIGN KEY ("directorUsuarioId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Materia" ADD CONSTRAINT "Materia_jefeTrabajoPracticoUsuarioId_fkey" FOREIGN KEY ("jefeTrabajoPracticoUsuarioId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MateriaCorrelativa" ADD CONSTRAINT "MateriaCorrelativa_materiaPrerequisitoId_fkey" FOREIGN KEY ("materiaPrerequisitoId") REFERENCES "Materia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MateriaCorrelativa" ADD CONSTRAINT "MateriaCorrelativa_correlativaId_fkey" FOREIGN KEY ("correlativaId") REFERENCES "Materia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_usuarioCreadorId_fkey" FOREIGN KEY ("usuarioCreadorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_usuarioModificadorId_fkey" FOREIGN KEY ("usuarioModificadorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_usuarioTutorId_fkey" FOREIGN KEY ("usuarioTutorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservaEquipo" ADD CONSTRAINT "ReservaEquipo_reservaId_fkey" FOREIGN KEY ("reservaId") REFERENCES "Reserva"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservaEquipo" ADD CONSTRAINT "ReservaEquipo_equipoId_fkey" FOREIGN KEY ("equipoId") REFERENCES "Equipo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservaLibro" ADD CONSTRAINT "ReservaLibro_reservaId_fkey" FOREIGN KEY ("reservaId") REFERENCES "Reserva"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservaLibro" ADD CONSTRAINT "ReservaLibro_libroId_fkey" FOREIGN KEY ("libroId") REFERENCES "Libro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservaLaboratorioCerrado" ADD CONSTRAINT "ReservaLaboratorioCerrado_reservaId_fkey" FOREIGN KEY ("reservaId") REFERENCES "Reserva"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservaLaboratorioCerrado" ADD CONSTRAINT "ReservaLaboratorioCerrado_laboratorioId_fkey" FOREIGN KEY ("laboratorioId") REFERENCES "Laboratorio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservaLaboratorioCerrado" ADD CONSTRAINT "ReservaLaboratorioCerrado_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "Curso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservaLaboratorioCerradoEquipo" ADD CONSTRAINT "ReservaLaboratorioCerradoEquipo_reservaLaboratorioCerradoI_fkey" FOREIGN KEY ("reservaLaboratorioCerradoId") REFERENCES "ReservaLaboratorioCerrado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservaLaboratorioCerradoEquipo" ADD CONSTRAINT "ReservaLaboratorioCerradoEquipo_equipoId_fkey" FOREIGN KEY ("equipoId") REFERENCES "Equipo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservaLaboratorioAbierto" ADD CONSTRAINT "ReservaLaboratorioAbierto_reservaId_fkey" FOREIGN KEY ("reservaId") REFERENCES "Reserva"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservaLaboratorioAbierto" ADD CONSTRAINT "ReservaLaboratorioAbierto_laboratorioId_fkey" FOREIGN KEY ("laboratorioId") REFERENCES "Laboratorio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservaLaboratorioAbiertoEquipo" ADD CONSTRAINT "ReservaLaboratorioAbiertoEquipo_reservaLaboratorioAbiertoI_fkey" FOREIGN KEY ("reservaLaboratorioAbiertoId") REFERENCES "ReservaLaboratorioAbierto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservaLaboratorioAbiertoEquipo" ADD CONSTRAINT "ReservaLaboratorioAbiertoEquipo_equipoId_fkey" FOREIGN KEY ("equipoId") REFERENCES "Equipo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_documentoTipoId_fkey" FOREIGN KEY ("documentoTipoId") REFERENCES "DocumentoTipo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_provinciaIso_fkey" FOREIGN KEY ("provinciaIso") REFERENCES "Provincia"("iso") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_paisIso_fkey" FOREIGN KEY ("paisIso") REFERENCES "Pais"("iso") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioRol" ADD CONSTRAINT "UsuarioRol_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioRol" ADD CONSTRAINT "UsuarioRol_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "Rol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolPermiso" ADD CONSTRAINT "RolPermiso_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "Rol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolPermiso" ADD CONSTRAINT "RolPermiso_permisoId_fkey" FOREIGN KEY ("permisoId") REFERENCES "Permiso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Provincia" ADD CONSTRAINT "Provincia_paisIso_fkey" FOREIGN KEY ("paisIso") REFERENCES "Pais"("iso") ON DELETE RESTRICT ON UPDATE CASCADE;
