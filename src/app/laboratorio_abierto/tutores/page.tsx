import { Suspense } from "react";
import LoadingTutoresContainer from "./_components/table/loading-tutores";
import TutoresContainer from "./_components/table/tutores-table-container";
import PageLayout from "@/components/ui/page-template";
import { LABORATORIO_ABIERTO_ROUTE } from "@/shared/server-routes";

export default async function Page() {
  return (
    <PageLayout route={LABORATORIO_ABIERTO_ROUTE}>
      <Suspense fallback={<LoadingTutoresContainer />}>
        <TutoresContainer />
      </Suspense>
    </PageLayout>
  );
}
