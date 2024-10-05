import { FormProvider, useForm } from "react-hook-form";
import { api } from "@/trpc/react";
import { Button, FormInput, ScrollArea, toast } from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { inputEditarSoftware } from "@/shared/filters/laboratorio-filter.schema";
import { LaboratorioDropdownMultipleForm } from "@/app/_components/form/laboratorios-dropdown-multiple";
import { type z } from "zod";

type Props = {
  softwareId?: number;
  onSubmit: () => void;
  onCancel: () => void;
};

type FormEditarSoftware = z.infer<typeof inputEditarSoftware>;

export const SoftwareForm = ({ softwareId, onSubmit, onCancel }: Props) => {
  const esNuevo = softwareId === undefined;

  const {
    data: software,
    isLoading,
    isError,
  } = api.software.getPorId.useQuery({ id: softwareId! }, { enabled: !!softwareId });

  const editarSoftware = api.software.editarSoftware.useMutation(); // Se llama si existe softwareId
  const agregarSoftware = api.software.nuevoSoftware.useMutation(); // Se llama si no existe softwareId

  const softwareBase: FormEditarSoftware = useMemo(() => {
    if (!software) return {} as FormEditarSoftware;
    return {
      id: software.id,
      nombre: software.nombre,
      version: software.version,
      estado: software.estado,
      laboratorios: software.laboratorios.map((laboratorio) => String(laboratorio.laboratorioId)),
    };
  }, [software]);

  const formHook = useForm<FormEditarSoftware>({
    mode: "onChange",
    defaultValues: softwareBase,
    resolver: zodResolver(inputEditarSoftware),
  });

  const { handleSubmit, control } = formHook;

  useEffect(() => formHook.reset(softwareBase), [formHook, softwareBase]);

  console.log(formHook.formState.errors);

  const onFormSubmit = (formData: FormEditarSoftware) => {
    if (esNuevo) {
      agregarSoftware.mutate(formData, {
        onSuccess: () => {
          toast.success("Software agregado con éxito.");
          onSubmit();
        },
        onError: (error) => {
          toast.error(error?.message ?? "Error al agregar el software");
        },
      });
      return;
    }

    editarSoftware.mutate(formData, {
      onSuccess: () => {
        toast.success("Software actualizado con éxito.");
        onSubmit();
      },
      onError: (error) => {
        toast.error(error?.message ?? "Error al actualizar el software");
      },
    });
  };

  const handleCancel = () => {
    formHook.reset();
    onCancel();
  };

  if (!esNuevo && isNaN(softwareId)) {
    return <div>Error al cargar...</div>;
  }

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (isError) {
    return <div>Error al cargar...</div>;
  }

  return (
    <FormProvider {...formHook}>
      <form onSubmit={handleSubmit(onFormSubmit)} className="relative flex w-full flex-col gap-4">
        <ScrollArea className="max-h-[calc(100vh_-_30%)] w-full pr-4">
          <div className="flex w-full flex-col items-center justify-center">
            <div className="flex w-full flex-col space-y-4 px-0 md:px-6">
              <div className="flex w-full flex-col gap-x-4 md:flex-row">
                <div className="mt-4 w-full">
                  <FormInput label={"Nombre"} control={control} name="nombre" type={"text"} className="mt-2" />
                </div>
                <div className="mt-4 w-full">
                  <FormInput label={"Versión"} control={control} name="version" type={"text"} className="mt-2" />
                </div>
                <div className="mt-4 w-full">
                  <FormInput label={"Estado"} control={control} name="estado" type={"text"} className="mt-2" />
                </div>
              </div>

              <div className="flex w-full flex-row gap-x-4">
                <div className="mt-4 w-full">
                  <label>
                    Laboratorios
                    <LaboratorioDropdownMultipleForm name="laboratorios" control={control} />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
        <div className="flex w-full flex-row items-end justify-end space-x-4">
          <Button title="Cancelar" type="button" variant="default" color="secondary" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button title="Guardar" type="submit" variant="default" color="primary">
            Guardar
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};
