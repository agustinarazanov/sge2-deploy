import { ActionButtons } from "./_components/action-buttons/action-buttons";
import LaboratorioAbiertoReservaContainer from "./_components/table/curso-table-container";
import { Suspense } from "react";
import LoadingLaboratorioAbiertoReserva from "./_components/table/loading-reserva-laboratorio-abierto";

export default async function Page() {
  return (
    <>
      <ActionButtons />
      <p className="text-center text-lg antialiased">
        El Laboratorio Abierto (LA) del Departamento de Ingeniería Electrónica de la UTN-FRBA está diseñado para
        facilitar el acceso al instrumental del departamento a estudiantes, egresados, docentes y asociados de esta
        facultad, permitiéndoles realizar pruebas, ensayos y trabajos relacionados con sus estudios.
      </p>
      <p className="text-center text-lg antialiased">
        El LA se encuentra en el departamento de electrónica y ofrece tres opciones de uso:
      </p>
      <Suspense fallback={<LoadingLaboratorioAbiertoReserva />}>
        <LaboratorioAbiertoReservaContainer />
      </Suspense>
    </>
  );
}
