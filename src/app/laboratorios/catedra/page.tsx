import { ActionButtons } from "../_components/action-buttons/action-buttons";
import LaboratorioReservaTableContainer from "../_components/table/curso-table-container";
import { Suspense } from "react";
import LoadingCursosTable from "../_components/table/loading-curso-table";

export default async function Page() {
  return (
    <>
      <h3 className="text-5xl font-extrabold tracking-tight sm:text-[3rem]">Reserva Laboratorio - Cátedra</h3>
      <ActionButtons />
      <Suspense fallback={<LoadingCursosTable />}>
        <LaboratorioReservaTableContainer filterByUserId={true} filterByCatedraId={true} />
      </Suspense>
    </>
  );
}
