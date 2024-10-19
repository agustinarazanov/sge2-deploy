import { type ReadonlyURLSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import { inputGetAllSolicitudesReservaLaboratorioCerrado } from "@/shared/filters/reserva-laboratorio-filter.schema";
import LaboratorioCerradoSolicitudesTableContainer from "../_components/table/reservas-labo-cerrado-table-container";
import LoadingBibliotecaPrestamosTable from "@/app/biblioteca/(listado)/loading-biblioteca-prestamos-table";
import { ActionButtonsPrestamos } from "../_components/action-redirect-prestamos";
import PageLayout from "@/components/ui/page-template";
import { LABORATORIO_ROUTE } from "@/shared/server-routes";
import ReservaDiscrecionalModal from "../_components/reserva-discrecional-form";
import { AgregarAPantallaModal } from "../pantalla/_components/actions/software-nuevo";

type PageProps = {
  searchParams: ReadonlyURLSearchParams;
};

export default async function Page({ searchParams }: PageProps) {
  const filters = inputGetAllSolicitudesReservaLaboratorioCerrado.parse(searchParams);

  const filter_as_key = useMemo(() => JSON.stringify(filters), [filters]);

  return (
    <PageLayout
      title={"Solicitudes de reserva"}
      routes={LABORATORIO_ROUTE.subRutas}
      buttons={
        <>
          <ReservaDiscrecionalModal />
          <AgregarAPantallaModal />
        </>
      }
    >
      <ActionButtonsPrestamos filters={filters} />
      <Suspense key={filter_as_key} fallback={<LoadingBibliotecaPrestamosTable />}>
        <LaboratorioCerradoSolicitudesTableContainer filters={filters} />
      </Suspense>
    </PageLayout>
  );
}
