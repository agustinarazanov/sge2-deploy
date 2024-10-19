import { Suspense } from "react";
import PantallaTableContainer from "./_components/table/container";
import LoadingPantallaTable from "./_components/loading-pantalla";
import PageLayout from "@/components/ui/page-template";
import { LABORATORIO_ROUTE } from "@/shared/server-routes";
import ReservaDiscrecionalModal from "../_components/reserva-discrecional-form";
import { AgregarAPantallaModal } from "./_components/actions/software-nuevo";

export default async function Page() {
  return (
    <PageLayout
      title={"Pantalla 👷🏻"}
      routes={LABORATORIO_ROUTE.subRutas}
      buttons={
        <>
          <ReservaDiscrecionalModal />
          <AgregarAPantallaModal />
        </>
      }
    >
      <Suspense fallback={<LoadingPantallaTable />}>
        <PantallaTableContainer />
      </Suspense>
    </PageLayout>
  );
}
