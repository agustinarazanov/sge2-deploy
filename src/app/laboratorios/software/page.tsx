import { Suspense } from "react";
import LoadingSoftwareTable from "./_components/loading-software";
import SoftwareTableContainer from "./_components/table/container";
import PageLayout from "@/components/ui/page-template";
import { LABORATORIO_ROUTE } from "@/shared/server-routes";
import { SoftwareNuevoEditar } from "./_components/actions/software-nuevo";

export default async function Page() {
  return (
    <PageLayout route={LABORATORIO_ROUTE} buttons={<SoftwareNuevoEditar />}>
      <Suspense fallback={<LoadingSoftwareTable />}>
        <SoftwareTableContainer />
      </Suspense>
    </PageLayout>
  );
}
