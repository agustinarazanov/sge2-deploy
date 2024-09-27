import { AgregarAPantallaModal } from "../../pantalla/_components/actions/software-nuevo";
import ReservaDiscrecionalModal from "../reserva-discrecional-form";

export const LaboratorioActionButtonsLeft = () => {
  return (
    <>
      <ReservaDiscrecionalModal />
      <AgregarAPantallaModal />
    </>
  );
};
