import { FormProvider, useForm } from "react-hook-form";
import { api } from "@/trpc/react";
import { Button, toast } from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";
import { inputAprobarORechazarSolicitudReserva } from "@/shared/filters/reservas-filter.schema";
import { useRouter } from "next/navigation";

type Props = {
  reservaID: number;
  onSubmit: () => void;
  onCancel: () => void;
};

type FormHelperType = {
  usuarioSolicitante: { id: string; label: string };
};

type FormAprobarSolicitudReservaType = z.infer<typeof inputAprobarORechazarSolicitudReserva> & FormHelperType;

export const LaboratorioAbiertoAprobarORechazar = ({ reservaID, onSubmit, onCancel }: Props) => {
  const aprobarSolicitud = api.reservas.reservaLaboratorioAbierto.aprobarReserva.useMutation();
  const rechazarSolicitud = api.reservas.reservaLaboratorioAbierto.rechazarReserva.useMutation();

  const router = useRouter();

  const reserva: FormAprobarSolicitudReservaType = {
    id: reservaID,
    usuarioAprobadorId: "",
    usuarioSolicitante: { id: "", label: "" },
  };

  const formHook = useForm<FormAprobarSolicitudReservaType>({
    mode: "onChange",
    defaultValues: reserva,
    resolver: zodResolver(inputAprobarORechazarSolicitudReserva),
  });

  console.log({ errors: formHook.formState.errors });

  const { handleSubmit, control } = formHook;

  const onFormSubmit = async (formData: FormAprobarSolicitudReservaType, action: "aprobar" | "rechazar") => {
    if (action === "aprobar") {
      await handleAprobarReserva(formData);
    } else {
      await handleRechazarReserva(formData);
    }
  };

  const handleAprobarReserva = async (formData: FormAprobarSolicitudReservaType) => {
    aprobarSolicitud.mutate(formData, {
      onSuccess: () => {
        toast.success("Reserva aprobada con éxito.");
        router.refresh();
        onSubmit();
      },
      onError: (error) => {
        toast.error(error?.message ?? "Error al aprobar la reserva");
      },
    });
  };

  const handleRechazarReserva = async (formData: FormAprobarSolicitudReservaType) => {
    rechazarSolicitud.mutate(formData, {
      onSuccess: () => {
        toast.success("Reserva rechazada.");
        router.refresh();
        onSubmit();
      },
      onError: (error) => {
        toast.error(error?.message ?? "Error al rechazar la reserva");
      },
    });
  };

  const handleCancel = () => {
    formHook.reset();
    onCancel();
  };

  return (
    <FormProvider {...formHook}>
      <form
        onSubmit={handleSubmit((formData) => onFormSubmit(formData, "aprobar"))}
        className="relative flex w-full flex-col gap-4"
      >
        <div className="flex w-full flex-row items-end justify-end space-x-4">
          <Button title="Cancelar" type="button" variant="default" color="secondary" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button
            title="Rechazar"
            type="button"
            variant="default"
            color="danger"
            onClick={handleSubmit((formData) => onFormSubmit(formData, "aprobar"))}
          >
            Cancelar
          </Button>
          <Button
            title="Aprobar"
            type="submit"
            variant="default"
            color="primary"
            onClick={handleSubmit((formData) => onFormSubmit(formData, "rechazar"))}
          ></Button>
        </div>
      </form>
    </FormProvider>
  );
};
