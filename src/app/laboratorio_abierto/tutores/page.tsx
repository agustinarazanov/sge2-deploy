import { Suspense } from "react";
import { ActionButtons } from "./_components/action-buttons/action-buttons";
import LoadingTutoresContainer from "./_components/table/loading-tutores";
import TutoresContainer from "./_components/table/tutores-table-container";

export default async function Page() {
  return (
    <>
      <ActionButtons />
      <Suspense fallback={<LoadingTutoresContainer />}>
        <TutoresContainer />
      </Suspense>
    </>
  );
}
