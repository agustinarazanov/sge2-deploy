import { FormProvider, useForm } from "react-hook-form";
import { api } from "@/trpc/react";
import { Button, FormInput, ScrollArea, toast } from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { inputEditBooks } from "@/shared/filters/biblioteca-filter.schema";
import { SelectUsuarioForm } from "@/app/_components/select-usuario";
import { SelectSedeForm } from "@/app/_components/select-ubicacion/select-sede";

type Props = {
  libroId: number;
  onSubmit: () => void;
  onCancel: () => void;
};

type FormEditarLibroType = {
  libroId: number;
  usuarioSolicitanteId: string | undefined;
  fechaInicio: string | undefined;
  fechaFin: string | undefined;
};

export const LibroFormPrestar = ({ libroId, onSubmit, onCancel }: Props) => {
  const prestarLibro = api.biblioteca.eliminarLibro.useMutation({
    onSuccess: () => {
      toast.success(`El libro se prestó con éxito.`);
    },

    onError: (error) => {
      toast.error(error?.message ?? `Error prestando el libro`);
    },
  });

  const prestamoBase: FormEditarLibroType = {
    libroId: libroId,
    usuarioSolicitanteId: undefined,
    fechaInicio: undefined,
    fechaFin: undefined,
  };

  const formHook = useForm<FormEditarLibroType>({
    mode: "onChange",
    defaultValues: prestamoBase,
    resolver: zodResolver(inputEditBooks),
  });

  const { handleSubmit, control } = formHook;

  const onFormSubmit = (formData: FormEditarLibroType) => {
    prestarLibro.mutate(formData, {
      onSuccess: () => {
        toast.success("Libro prestado con éxito.");
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
                {/* TODO: Implementar filtrado en el backend */}
                <SelectUsuarioForm
                  name="usuarioSolicitanteId"
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
