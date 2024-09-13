import { FormProvider, useForm } from "react-hook-form";
import { api } from "@/trpc/react";
import { Button, FormInput, toast } from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { SelectUsuarioForm } from "@/app/_components/select-usuario";
import { type z } from "zod";
import { useEffect } from "react";
import { inputPrestarLibro } from "@/shared/filters/reservas-filter.schema";
import { useRouter } from "next/navigation";

type Props = {
  libroId: number;
  onSubmit: () => void;
  onCancel: () => void;
};

type FormHelperType = {
  usuarioSolicitante: { id: string; label: string };
};

type FormPrestarLibroType = z.infer<typeof inputPrestarLibro> & FormHelperType;

export const LibroFormPrestar = ({ libroId, onSubmit, onCancel }: Props) => {
  const prestarLibro = api.reservas.reservaBiblioteca.crearReserva.useMutation();
  const router = useRouter();

  const prestamoBase: FormPrestarLibroType = {
    libroId: libroId,
    usuarioSolicitanteId: "",
    usuarioSolicitante: {
      id: "",
      label: "",
    },
    fechaInicio: "",
    fechaFin: "",
  };

  const formHook = useForm<FormPrestarLibroType>({
    mode: "onChange",
    defaultValues: prestamoBase,
    resolver: zodResolver(inputPrestarLibro),
  });

  const { handleSubmit, control, watch } = formHook;

  const onFormSubmit = (formData: FormPrestarLibroType) => {
    prestarLibro.mutate(formData, {
      onSuccess: () => {
        router.refresh();
        onSubmit();
      },
      onError: (error) => {
        toast.error(error?.message ?? "Error al prestar el libro");
      },
    });
  };

  const handleCancel = () => {
    formHook.reset();
    onCancel();
  };

  const [usuarioSolicitante] = watch(["usuarioSolicitante"]);

  useEffect(() => formHook.setValue("usuarioSolicitanteId", usuarioSolicitante?.id), [formHook, usuarioSolicitante]);

  return (
    <FormProvider {...formHook}>
      <form onSubmit={handleSubmit(onFormSubmit)} className="relative flex w-full flex-col gap-4">
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

            <div className="flex w-full flex-row lg:flex-row lg:justify-between lg:gap-x-4">
              <div className="mt-4 w-full">
                <SelectUsuarioForm
                  name="usuarioSolicitante"
                  realNameId="usuarioSolicitanteId"
                  control={control}
                  className="mt-2"
                  label={"Usuario solicitante"}
                  placeholder={"Selecciona un usuario"}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-row items-end justify-end space-x-4">
          <Button title="Cancelar" type="button" variant="default" color="secondary" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button title="Prestar" type="submit" variant="default" color="primary">
            Prestar
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};
