import { Suspense } from "react";
import { PantallaActionButtons } from "./_components/actions/pantalla-action-button";
import PantallaTableContainer from "./_components/table/container";
import LoadingPantallaTable from "./_components/loading-pantalla";

export default async function Page() {
  return (
    <>
      <h3 className="text-5xl font-extrabold tracking-tight sm:text-[3rem]">Pantalla</h3>
      <PantallaActionButtons />
      <Suspense fallback={<LoadingPantallaTable />}>
        <PantallaTableContainer />
      </Suspense>
    </>
  );
}
