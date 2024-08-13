import { TodosLaboratorios } from "../laboratorios/todos-laboratorios";

export default async function LaboratorioAbiertoReservaContainer() {
  return (
    <>
      <div className="flex flex-row gap-x-8 px-4">
        <TodosLaboratorios />
      </div>
    </>
  );
}
