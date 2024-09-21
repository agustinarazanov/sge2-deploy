-- DropForeignKey
ALTER TABLE "Armario" DROP CONSTRAINT "Armario_laboratorioId_fkey";

-- DropForeignKey
ALTER TABLE "Curso" DROP CONSTRAINT "Curso_divisionId_fkey";

-- DropForeignKey
ALTER TABLE "Curso" DROP CONSTRAINT "Curso_materiaId_fkey";

-- DropForeignKey
ALTER TABLE "Curso" DROP CONSTRAINT "Curso_sedeId_fkey";

-- DropForeignKey
ALTER TABLE "CursoAyudante" DROP CONSTRAINT "CursoAyudante_cursoId_fkey";

-- DropForeignKey
ALTER TABLE "CursoAyudante" DROP CONSTRAINT "CursoAyudante_userId_fkey";

-- DropForeignKey
ALTER TABLE "CursoProfesor" DROP CONSTRAINT "CursoProfesor_cursoId_fkey";

-- DropForeignKey
ALTER TABLE "CursoProfesor" DROP CONSTRAINT "CursoProfesor_userId_fkey";

-- DropForeignKey
ALTER TABLE "Equipo" DROP CONSTRAINT "Equipo_armarioId_fkey";

-- DropForeignKey
ALTER TABLE "Equipo" DROP CONSTRAINT "Equipo_estanteId_fkey";

-- DropForeignKey
ALTER TABLE "Equipo" DROP CONSTRAINT "Equipo_sedeId_fkey";

-- DropForeignKey
ALTER TABLE "Estante" DROP CONSTRAINT "Estante_armarioId_fkey";

-- DropForeignKey
ALTER TABLE "Laboratorio" DROP CONSTRAINT "Laboratorio_sedeId_fkey";

-- DropForeignKey
ALTER TABLE "Libro" DROP CONSTRAINT "Libro_armarioId_fkey";

-- DropForeignKey
ALTER TABLE "Libro" DROP CONSTRAINT "Libro_estanteId_fkey";

-- DropForeignKey
ALTER TABLE "Libro" DROP CONSTRAINT "Libro_sedeId_fkey";

-- DropForeignKey
ALTER TABLE "Provincia" DROP CONSTRAINT "Provincia_paisIso_fkey";

-- DropForeignKey
ALTER TABLE "Reserva" DROP CONSTRAINT "Reserva_usuarioRechazadoId_fkey";

-- DropForeignKey
ALTER TABLE "Reserva" DROP CONSTRAINT "Reserva_usuarioRecibioId_fkey";

-- DropForeignKey
ALTER TABLE "Reserva" DROP CONSTRAINT "Reserva_usuarioRenovoId_fkey";

-- DropForeignKey
ALTER TABLE "Reserva" DROP CONSTRAINT "Reserva_usuarioTutorId_fkey";

-- DropForeignKey
ALTER TABLE "ReservaEquipo" DROP CONSTRAINT "ReservaEquipo_equipoId_fkey";

-- DropForeignKey
ALTER TABLE "ReservaEquipo" DROP CONSTRAINT "ReservaEquipo_reservaId_fkey";

-- DropForeignKey
ALTER TABLE "ReservaLaboratorioAbierto" DROP CONSTRAINT "ReservaLaboratorioAbierto_laboratorioId_fkey";

-- DropForeignKey
ALTER TABLE "ReservaLaboratorioAbierto" DROP CONSTRAINT "ReservaLaboratorioAbierto_reservaId_fkey";

-- DropForeignKey
ALTER TABLE "ReservaLaboratorioAbiertoEquipo" DROP CONSTRAINT "ReservaLaboratorioAbiertoEquipo_equipoId_fkey";

-- DropForeignKey
ALTER TABLE "ReservaLaboratorioAbiertoEquipo" DROP CONSTRAINT "ReservaLaboratorioAbiertoEquipo_reservaLaboratorioAbiertoI_fkey";

-- DropForeignKey
ALTER TABLE "ReservaLaboratorioCerrado" DROP CONSTRAINT "ReservaLaboratorioCerrado_cursoId_fkey";

-- DropForeignKey
ALTER TABLE "ReservaLaboratorioCerrado" DROP CONSTRAINT "ReservaLaboratorioCerrado_laboratorioId_fkey";

-- DropForeignKey
ALTER TABLE "ReservaLaboratorioCerrado" DROP CONSTRAINT "ReservaLaboratorioCerrado_reservaId_fkey";

-- DropForeignKey
ALTER TABLE "ReservaLaboratorioCerradoEquipo" DROP CONSTRAINT "ReservaLaboratorioCerradoEquipo_equipoId_fkey";

-- DropForeignKey
ALTER TABLE "ReservaLibro" DROP CONSTRAINT "ReservaLibro_libroId_fkey";

-- DropForeignKey
ALTER TABLE "ReservaLibro" DROP CONSTRAINT "ReservaLibro_reservaId_fkey";

-- DropForeignKey
ALTER TABLE "SoftwareLaboratorio" DROP CONSTRAINT "SoftwareLaboratorio_laboratorioId_fkey";

-- DropForeignKey
ALTER TABLE "SoftwareLaboratorio" DROP CONSTRAINT "SoftwareLaboratorio_softwareId_fkey";

-- DropForeignKey
ALTER TABLE "Tutor" DROP CONSTRAINT "Tutor_userId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_documentoTipoId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_paisIso_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_provinciaIso_paisIso_fkey";

-- DropForeignKey
ALTER TABLE "UsuarioRol" DROP CONSTRAINT "UsuarioRol_rolId_fkey";

-- DropForeignKey
ALTER TABLE "UsuarioRol" DROP CONSTRAINT "UsuarioRol_userId_fkey";

-- AddForeignKey
ALTER TABLE "Libro" ADD CONSTRAINT "Libro_armarioId_fkey" FOREIGN KEY ("armarioId") REFERENCES "Armario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Libro" ADD CONSTRAINT "Libro_estanteId_fkey" FOREIGN KEY ("estanteId") REFERENCES "Estante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Libro" ADD CONSTRAINT "Libro_sedeId_fkey" FOREIGN KEY ("sedeId") REFERENCES "Sede"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Curso" ADD CONSTRAINT "Curso_sedeId_fkey" FOREIGN KEY ("sedeId") REFERENCES "Sede"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Curso" ADD CONSTRAINT "Curso_materiaId_fkey" FOREIGN KEY ("materiaId") REFERENCES "Materia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Curso" ADD CONSTRAINT "Curso_divisionId_fkey" FOREIGN KEY ("divisionId") REFERENCES "Division"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CursoAyudante" ADD CONSTRAINT "CursoAyudante_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "Curso"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CursoAyudante" ADD CONSTRAINT "CursoAyudante_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CursoProfesor" ADD CONSTRAINT "CursoProfesor_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "Curso"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CursoProfesor" ADD CONSTRAINT "CursoProfesor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Equipo" ADD CONSTRAINT "Equipo_sedeId_fkey" FOREIGN KEY ("sedeId") REFERENCES "Sede"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Equipo" ADD CONSTRAINT "Equipo_armarioId_fkey" FOREIGN KEY ("armarioId") REFERENCES "Armario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Equipo" ADD CONSTRAINT "Equipo_estanteId_fkey" FOREIGN KEY ("estanteId") REFERENCES "Estante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Laboratorio" ADD CONSTRAINT "Laboratorio_sedeId_fkey" FOREIGN KEY ("sedeId") REFERENCES "Sede"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Armario" ADD CONSTRAINT "Armario_laboratorioId_fkey" FOREIGN KEY ("laboratorioId") REFERENCES "Laboratorio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Estante" ADD CONSTRAINT "Estante_armarioId_fkey" FOREIGN KEY ("armarioId") REFERENCES "Armario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoftwareLaboratorio" ADD CONSTRAINT "SoftwareLaboratorio_softwareId_fkey" FOREIGN KEY ("softwareId") REFERENCES "Software"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoftwareLaboratorio" ADD CONSTRAINT "SoftwareLaboratorio_laboratorioId_fkey" FOREIGN KEY ("laboratorioId") REFERENCES "Laboratorio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_usuarioRechazadoId_fkey" FOREIGN KEY ("usuarioRechazadoId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_usuarioRenovoId_fkey" FOREIGN KEY ("usuarioRenovoId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_usuarioRecibioId_fkey" FOREIGN KEY ("usuarioRecibioId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_usuarioTutorId_fkey" FOREIGN KEY ("usuarioTutorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservaEquipo" ADD CONSTRAINT "ReservaEquipo_reservaId_fkey" FOREIGN KEY ("reservaId") REFERENCES "Reserva"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservaEquipo" ADD CONSTRAINT "ReservaEquipo_equipoId_fkey" FOREIGN KEY ("equipoId") REFERENCES "Equipo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservaLibro" ADD CONSTRAINT "ReservaLibro_reservaId_fkey" FOREIGN KEY ("reservaId") REFERENCES "Reserva"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservaLibro" ADD CONSTRAINT "ReservaLibro_libroId_fkey" FOREIGN KEY ("libroId") REFERENCES "Libro"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservaLaboratorioCerrado" ADD CONSTRAINT "ReservaLaboratorioCerrado_reservaId_fkey" FOREIGN KEY ("reservaId") REFERENCES "Reserva"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservaLaboratorioCerrado" ADD CONSTRAINT "ReservaLaboratorioCerrado_laboratorioId_fkey" FOREIGN KEY ("laboratorioId") REFERENCES "Laboratorio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservaLaboratorioCerrado" ADD CONSTRAINT "ReservaLaboratorioCerrado_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "Curso"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservaLaboratorioCerradoEquipo" ADD CONSTRAINT "ReservaLaboratorioCerradoEquipo_equipoId_fkey" FOREIGN KEY ("equipoId") REFERENCES "Equipo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservaLaboratorioAbierto" ADD CONSTRAINT "ReservaLaboratorioAbierto_reservaId_fkey" FOREIGN KEY ("reservaId") REFERENCES "Reserva"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservaLaboratorioAbierto" ADD CONSTRAINT "ReservaLaboratorioAbierto_laboratorioId_fkey" FOREIGN KEY ("laboratorioId") REFERENCES "Laboratorio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservaLaboratorioAbiertoEquipo" ADD CONSTRAINT "ReservaLaboratorioAbiertoEquipo_reservaLaboratorioAbiertoI_fkey" FOREIGN KEY ("reservaLaboratorioAbiertoId") REFERENCES "ReservaLaboratorioAbierto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservaLaboratorioAbiertoEquipo" ADD CONSTRAINT "ReservaLaboratorioAbiertoEquipo_equipoId_fkey" FOREIGN KEY ("equipoId") REFERENCES "Equipo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_documentoTipoId_fkey" FOREIGN KEY ("documentoTipoId") REFERENCES "DocumentoTipo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_provinciaIso_paisIso_fkey" FOREIGN KEY ("provinciaIso", "paisIso") REFERENCES "Provincia"("iso", "paisIso") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_paisIso_fkey" FOREIGN KEY ("paisIso") REFERENCES "Pais"("iso") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tutor" ADD CONSTRAINT "Tutor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioRol" ADD CONSTRAINT "UsuarioRol_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioRol" ADD CONSTRAINT "UsuarioRol_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "Rol"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Provincia" ADD CONSTRAINT "Provincia_paisIso_fkey" FOREIGN KEY ("paisIso") REFERENCES "Pais"("iso") ON DELETE CASCADE ON UPDATE CASCADE;
