import { FormProvider, useForm } from "react-hook-form";
import { api } from "@/trpc/react";
import { Button, FormInput, ScrollArea, toast } from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";
import { useEffect, useMemo } from "react";
import { inputEditarTipo } from "@/shared/filters/equipos-tipos-filter.schema";

type Props = {
  id?: string;
  onSubmit: () => void;
  onCancel: () => void;
};

type FormEditarTipoType = z.infer<typeof inputEditarTipo>;

export const TipoForm = ({ id, onSubmit, onCancel }: Props) => {
  const esNuevo = id === undefined;
  const tipoId = parseInt(id ?? "");

  const { data: tipo, isLoading, isError } = api.equipos.tipoPorId.useQuery({ id: tipoId }, { enabled: !!id });

  const editarTipo = api.equipos.editarTipo.useMutation();
  const agregarTipo = api.equipos.nuevoTipo.useMutation();

  const tipoBase: FormEditarTipoType = useMemo(() => {
    if (!tipo) return {} as FormEditarTipoType;
    return {
      id: tipo.id,
      nombre: tipo.nombre,
      fechaCreacion: tipo.fechaCreacion,
      usuarioCreadorId: tipo.usuarioCreadorId,
    };
  }, [tipo]);

  const formHook = useForm<FormEditarTipoType>({
    mode: "onChange",
    defaultValues: tipoBase,
    resolver: zodResolver(inputEditarTipo),
  });

  const { handleSubmit, control, watch } = formHook;

  useEffect(() => formHook.reset(tipoBase), [formHook, tipoBase]);

  if (!esNuevo && isNaN(tipoId)) {
    return <div>Error al cargar...</div>;
  }

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (isError) {
    return <div>Error al cargar...</div>;
  }

  const onFormSubmit = (formData: FormEditarTipoType) => {
    if (esNuevo) {
      agregarTipo.mutate(formData, {
        onSuccess: () => {
          toast.success("Tipo agregado con éxito.");
          onSubmit();
        },
        onError: (error) => {
          toast.error(error?.message ?? "Error al agregar el tipo");
        },
      });
      return;
    }

    editarTipo.mutate(formData, {
      onSuccess: () => {
        toast.success("Tipo actualizado con éxito.");
        onSubmit();
      },
      onError: (error) => {
        toast.error(error?.message ?? "Error al actualizar el tipo");
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
        <ScrollArea className="max-h-[calc(100vh_-_30%)] w-full pr-4">
          <div className="flex w-full flex-col items-center justify-center">
            <div className="flex flex-col space-y-4 px-0 md:px-6">
              <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
                <div className="basis-1/1 mt-4">
                  <FormInput
                    label={"Nombre"}
                    control={control}
                    name="nombre"
                    type={"text"}
                    className="mt-2"
                    placeholder={"Ingrese el nombre del tipo"}
                  />
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
