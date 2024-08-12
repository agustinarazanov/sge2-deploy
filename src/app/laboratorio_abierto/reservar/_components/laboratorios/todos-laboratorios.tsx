import { tiposReserva } from "./constants";
import { LaboratorioCard } from "./laboratorio-card";

const tiposLaboratorioAbierto = tiposReserva.filter((lab) => lab.habilitado);

export const TodosLaboratorios = () => {
  return (
    <>
      {tiposLaboratorioAbierto.map((tipoLabAbierto) => {
        return <LaboratorioCard key={tipoLabAbierto.tipo} laboratorio={tipoLabAbierto} />;
      })}
    </>
  );
};
