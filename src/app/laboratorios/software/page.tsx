import { Suspense } from "react";
import LoadingSoftwareTable from "./_components/loading-software";
import { SoftwareActionButtons } from "./_components/actions/software-action-button";
import SoftwareTableContainer from "./_components/table/container";

export default async function Page() {
  return (
    <>
      <h3 className="text-5xl font-extrabold tracking-tight sm:text-[3rem]">Aplicaciones en Laboratorios</h3>
      <SoftwareActionButtons />
      <Suspense fallback={<LoadingSoftwareTable />}>
        <SoftwareTableContainer />
      </Suspense>
    </>
  );
}
