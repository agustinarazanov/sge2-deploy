import { TodosLaboratorios } from "../laboratorios/todos-laboratorios";

export default async function LaboratorioAbiertoReservaContainer() {
  return (
    <>
      <div>reservas de laboratorios abiertos</div>
      <div>asdasdasd</div>

      {/* Row on desktop, col on mobile */}
      <div className="flex flex-row gap-x-4">
        <TodosLaboratorios />
      </div>
    </>
  );
}
