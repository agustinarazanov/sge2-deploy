import { LaboratorioActionButtonsLeft } from "@/app/laboratorios/_components/action-buttons/actions-left";
import { SoftwareActionRedirect } from "./software-action-redirect";

export const SoftwareActionButtons = () => {
  return (
    <div className="relative flex w-full flex-col items-center justify-between space-y-3 md:flex-row-reverse md:space-x-1.5 md:space-y-0">
      <div className="relative flex w-full flex-col justify-end space-y-3 sm:basis-1/2 sm:flex-row sm:space-x-2 sm:space-y-0 md:w-auto md:basis-1/2 md:space-y-0">
        <SoftwareActionRedirect />
      </div>

      <div className="flex w-full flex-row space-x-3 md:basis-1/2">
        <LaboratorioActionButtonsLeft />
      </div>
    </div>
  );
};
