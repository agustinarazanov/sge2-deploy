import { ActionButtons } from "./_components/action-buttons/action-buttons";
import LaboratorioAbiertoReservaContainer from "./_components/table/curso-table-container";
import { Suspense } from "react";
import LoadingLaboratorioAbiertoReserva from "./_components/table/loading-reserva-laboratorio-abierto";

export default async function Page() {
  return (
    <>
      <ActionButtons />
      <Suspense fallback={<LoadingLaboratorioAbiertoReserva />}>
        <LaboratorioAbiertoReservaContainer />
      </Suspense>
    </>
  );
}
