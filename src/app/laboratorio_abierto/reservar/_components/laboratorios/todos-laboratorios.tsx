import { tiposReserva } from "./constants";
import { LaboratorioCard } from "./laboratorio-card";

const tiposLaboratorioAbierto = tiposReserva.filter((lab) => lab.habilitado);

export const TodosLaboratorios = () => {
  return (
    <div className="flex flex-col justify-center gap-8 md:flex-row">
      {tiposLaboratorioAbierto.map((tipoLabAbierto) => {
        return (
          <LaboratorioCard
            key={tipoLabAbierto.tipo}
            laboratorio={tipoLabAbierto}
            className="w-full basis-1/3 lg:basis-3/12"
          />
        );
      })}
    </div>
  );
};
