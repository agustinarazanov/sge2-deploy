import { FormProvider, useForm } from "react-hook-form";
import { api } from "@/trpc/react";
import { Button, FormInput, Label, toast } from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";
import { useEffect } from "react";
import { inputEditarEquipos } from "@/shared/equipos-filter.schema";
import { FormSelect } from "@/components/ui/autocomplete";

type Props = {
  id?: string;
  onSubmit: () => void;
  onCancel: () => void;
};

type FormEditarEquipoType = z.infer<typeof inputEditarEquipos>;

export const EquipoForm = ({ id, onSubmit, onCancel }: Props) => {
  const esNuevo = id === undefined;
  const equipoId = parseInt(id ?? "");

  const { data: equipo, isLoading, isError } = api.equipos.equipoPorId.useQuery({ id: equipoId }, { enabled: !!id });

  const editarEquipo = api.equipos.editarEquipo.useMutation();
  const agregarEquipo = api.equipos.nuevoEquipo.useMutation();

  const formHook = useForm<FormEditarEquipoType>({
    mode: "onChange",
    defaultValues: {
      id: equipo?.id ?? undefined,
    },
    resolver: zodResolver(inputEditarEquipos),
  });

  const { handleSubmit, control } = formHook;

  // TODO: Separar componente de formulario y logica de carga y actualización de equipo
  useEffect(() => {
    if (equipo) {
      formHook.reset({
        id: equipo.id,
      });
    }
  }, [formHook, equipo]);

  if (!esNuevo && isNaN(equipoId)) {
    return <div>Error al cargar...</div>;
  }

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (isError) {
    return <div>Error al cargar...</div>;
  }

  const onFormSubmit = (formData: FormEditarEquipoType) => {
    if (esNuevo) {
      agregarEquipo.mutate(formData, {
        onSuccess: () => {
          toast.success("Equipo agregado con éxito.");
          onSubmit();
        },
        onError: (error) => {
          toast.error(error?.message ?? "Error al agregar el equipo");
        },
      });
      return;
    }

    editarEquipo.mutate(formData, {
      onSuccess: () => {
        toast.success("Equipo actualizado con éxito.");
        onSubmit();
      },
      onError: (error) => {
        toast.error(error?.message ?? "Error al actualizar el equipo");
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
            <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
              <div className="mt-4 basis-1/3">
                <FormInput label={"Inventario"} control={control} name="inventario" type={"text"} className="mt-2" />
              </div>

              <div className="mt-4 basis-1/3">
                <FormSelect
                  label={"Modelo"}
                  control={control}
                  name="anio"
                  type={"number"}
                  className="mt-2"
                  items={[
                    { id: 1, label: "Modelo 1" },
                    { id: 2, label: "Modelo 2" },
                  ]}
                />
              </div>

              <div className="mt-4 basis-1/3">
                <FormInput label={"Numero de serie"} control={control} name="autor" type={"text"} className="mt-2" />
              </div>
            </div>

            <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
              <div className="mt-4 basis-1/3">
                <FormInput label={"Palabras clave"} control={control} name="editorial" type={"text"} className="mt-2" />
              </div>

              <div className="mt-4 basis-1/3">
                <FormInput label={"Imagen"} id="idioma" control={control} name="idioma" type={"url"} className="mt-2" />
              </div>

              <div className="mt-4 basis-1/3">
                <FormInput label={"ISBN"} control={control} name="isbn" type={"text"} className="mt-2" />
              </div>
            </div>

            <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
              <div className="mt-4 basis-1/3">
                <FormSelect
                  label={"Tipo"}
                  control={control}
                  name="editorial"
                  type={"text"}
                  className="mt-2"
                  items={[
                    { id: 1, label: "Tipo 1" },
                    { id: 2, label: "Tipo 2" },
                  ]}
                />
              </div>

              <div className="mt-4 basis-1/3">
                <FormSelect
                  label={"Marca"}
                  id="idioma"
                  control={control}
                  name="idioma"
                  type={"url"}
                  className="mt-2"
                  items={[
                    { id: 1, label: "Marca 1" },
                    { id: 2, label: "Marca 2" },
                  ]}
                />
              </div>

              <div className="mt-4 basis-1/3">
                <FormSelect
                  label={"Sede"}
                  control={control}
                  name="isbn"
                  type={"text"}
                  className="mt-2"
                  items={[
                    { id: 1, label: "Medrano" },
                    { id: 2, label: "Lugano" },
                  ]}
                />
              </div>
            </div>

            <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
              <div className="mt-4 basis-1/3">
                <FormSelect
                  label={"Laboratorio"}
                  control={control}
                  name="editorial"
                  type={"text"}
                  className="mt-2"
                  items={[
                    { id: 1, label: "Laboratorio 1" },
                    { id: 2, label: "Laboratorio 2" },
                  ]}
                />
              </div>

              <div className="mt-4 basis-1/3">
                <FormSelect
                  label={"Armario"}
                  id="idioma"
                  control={control}
                  name="idioma"
                  type={"url"}
                  className="mt-2"
                  items={[
                    { id: 1, label: "Armario 1" },
                    { id: 2, label: "Armario 2" },
                  ]}
                />
              </div>

              <div className="mt-4 basis-1/3">
                <FormSelect
                  label={"Estado"}
                  control={control}
                  name="isbn"
                  type={"text"}
                  className="mt-2"
                  items={[
                    { id: 1, label: "Estado 1" },
                    { id: 2, label: "Estado 2" },
                  ]}
                />
              </div>
            </div>

            <div className="flex w-full flex-row lg:flex-row">
              <Label htmlFor={id} className="mb-3 flex w-full flex-col text-sm text-input-label">
                Observaciones
                <textarea name="" id="" className="w-full"></textarea>
              </Label>
            </div>
          </div>
        </div>
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
