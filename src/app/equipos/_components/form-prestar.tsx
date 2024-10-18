import { FormProvider, useForm } from "react-hook-form";
import { api } from "@/trpc/react";
import { Button, FormInput, toast, ScrollArea } from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { SelectUsuarioForm } from "@/app/_components/select-usuario";
import { type z } from "zod";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getDate } from "@/shared/get-date";
import { inputPrestarEquipo } from "@/shared/filters/reservas-equipos-filter.schema";

type Props = {
  equipoId: number;
  onSubmit: () => void;
  onCancel: () => void;
  renovar?: boolean;
};

type FormHelperType = {
  usuarioSolicitante: { id: string; label: string };
};

type FormPrestarEquipoType = z.infer<typeof inputPrestarEquipo> & FormHelperType;

export const EquipoFormPrestarORenovar = ({ equipoId, onSubmit, onCancel, renovar }: Props) => {
  const prestarEquipo = api.reservas.reservaEquipo.crearReserva.useMutation(); // Se usa por efecto si `renovar=false`
  const renovarEquipo = api.reservas.reservaEquipo.renovarEquipo.useMutation(); // Se usa por efecto si `renovar=true`

  const router = useRouter();

  const prestamoBase: FormPrestarEquipoType = {
    equipoId,
    usuarioSolicitanteId: "",
    usuarioSolicitante: {
      id: "",
      label: "",
    },
    fechaInicio: getDate(),
    fechaFin: getDate(7),
  };

  const formHook = useForm<FormPrestarEquipoType>({
    mode: "onChange",
    defaultValues: prestamoBase,
    resolver: zodResolver(
      inputPrestarEquipo.refine(({ usuarioSolicitanteId }) => renovar ?? !!usuarioSolicitanteId, {
        message: "Requerido",
        path: ["usuarioSolicitanteId"],
      }),
    ),
  });

  console.log({ errors: formHook.formState.errors, renovar });

  const { handleSubmit, control, watch, trigger } = formHook;

  const onFormSubmit = async (formData: FormPrestarEquipoType) => {
    if (renovar) {
      await handleRenovarEquipo(formData);
    } else {
      await handlePrestarEquipo(formData);
    }
  };

  const handleRenovarEquipo = async (formData: FormPrestarEquipoType) => {
    renovarEquipo.mutate(formData, {
      onSuccess: () => {
        toast.success("Equipo renovado con éxito.");
        router.refresh();
        onSubmit();
      },
      onError: (error) => {
        toast.error(error?.message ?? "Error al renovar el equipo");
      },
    });
  };

  const handlePrestarEquipo = async (formData: FormPrestarEquipoType) => {
    prestarEquipo.mutate(formData, {
      onSuccess: () => {
        toast.success("Equipo prestado con éxito.");
        router.refresh();
        onSubmit();
      },
      onError: (error) => {
        toast.error(error?.message ?? "Error al prestar el equipo");
      },
    });
  };

  const handleCancel = () => {
    formHook.reset();
    onCancel();
  };

  const [usuarioSolicitante, fechaFin] = watch(["usuarioSolicitante", "fechaFin"]);

  useEffect(() => formHook.setValue("usuarioSolicitanteId", usuarioSolicitante?.id), [formHook, usuarioSolicitante]);
  useEffect(() => {
    void trigger("fechaInicio");
  }, [formHook, fechaFin, trigger]);

  return (
    <FormProvider {...formHook}>
      <form onSubmit={handleSubmit(onFormSubmit)} className="relative flex w-full flex-col gap-4">
        <ScrollArea className="max-h-[calc(100vh_-_20%)] w-full pr-4 md:max-h-[calc(100vh_-_30%)] lg:max-h-[calc(100vh_-_30%)]">
          <div className="flex w-full flex-col items-center justify-center">
            <div className="flex flex-col space-y-4 px-0 md:px-6">
              <div className="flex w-full flex-row lg:flex-row lg:justify-between lg:gap-x-4">
                <div className="mt-4 basis-1/2">
                  <FormInput
                    label={"Desde el día"}
                    control={control}
                    name="fechaInicio"
                    className="mt-2"
                    type={"date"}
                    required
                  />
                </div>
                <div className="mt-4 basis-1/2">
                  <FormInput
                    label={"Hasta el día"}
                    control={control}
                    name="fechaFin"
                    className="mt-2"
                    type={"date"}
                    required
                  />
                </div>
              </div>

              {!renovar && (
                <div className="flex w-full flex-row lg:flex-row lg:justify-between lg:gap-x-4">
                  <div className="mt-4 w-full">
                    <SelectUsuarioForm
                      name="usuarioSolicitante"
                      realNameId="usuarioSolicitanteId"
                      control={control}
                      className="mb-3 mt-2"
                      label={"Usuario solicitante"}
                      placeholder={"Selecciona un usuario"}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex w-full flex-row items-end justify-end space-x-4">
            <Button title="Cancelar" type="button" variant="default" color="secondary" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button title={renovar ? "Renovar" : "Prestar"} type="submit" variant="default" color="primary">
              {renovar ? "Renovar" : "Prestar"}
            </Button>
          </div>
        </ScrollArea>
      </form>
    </FormProvider>
  );
};
