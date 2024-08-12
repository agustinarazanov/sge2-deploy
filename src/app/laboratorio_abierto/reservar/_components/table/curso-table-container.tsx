import { TodosLaboratorios } from "../laboratorios/todos-laboratorios";

export default async function LaboratorioAbiertoReservaContainer() {
  return (
    <>
      {/* Row on desktop, col on mobile */}
      <div className="flex flex-row gap-x-8 px-4">
        <TodosLaboratorios />
      </div>
    </>
  );
}
