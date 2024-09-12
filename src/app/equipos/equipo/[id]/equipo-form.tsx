import { FormProvider, useForm } from "react-hook-form";
import { api } from "@/trpc/react";
import { Button, FormInput, Label, ScrollArea, toast } from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";
import { useEffect } from "react";
import { inputEditarEquipos } from "@/shared/filters/equipos-filter.schema";
import { FormSelect } from "@/components/ui/autocomplete";
import { SelectSedeForm } from "@/app/_components/select-ubicacion/select-sede";
import { SelectMarcasForm } from "../../_components/select-marca";
import { SelectLaboratorioForm } from "@/app/_components/select-ubicacion/select-laboratorio";
import { SelectArmarioForm } from "@/app/_components/select-ubicacion/select-armario";
import { SelectEstanteForm } from "@/app/_components/select-ubicacion/select-estante";
import { SelectTipoForm } from "../../_components/select-tipo";
import { SelectEstadoForm } from "../../_components/select-estado";

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

  const { handleSubmit, control, watch } = formHook;

  const [sedeId, laboratorioId, armarioId] = watch(["sedeId", "laboratorioId", "armarioId"]);

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
        <ScrollArea className="max-h-[calc(100vh_-_30%)] w-full pr-4">
          <div className="flex w-full flex-col items-center justify-center">
            <div className="flex flex-col space-y-4 px-0 md:px-6">
              <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
                <div className="mt-4 basis-1/3">
                  <FormInput
                    label={"Inventario"}
                    control={control}
                    name="inventarioId"
                    type={"text"}
                    className="mt-2"
                  />
                </div>

                <div className="mt-4 basis-1/3">
                  <SelectMarcasForm
                    name="marcaId"
                    control={control}
                    className="mt-2"
                    label={"Marca"}
                    placeholder={"Seleccioná una marca"}
                  />
                </div>

                <div className="mt-4 basis-1/3">
                  <FormSelect
                    label={"Modelo"}
                    control={control}
                    name="modelo"
                    className="mt-2"
                    items={[
                      { id: 1, label: "Modelo 1" },
                      { id: 2, label: "Modelo 2" },
                    ]}
                  />
                </div>
              </div>

              <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
                <div className="mt-4 basis-1/2">
                  <FormInput
                    label={"Numero de serie"}
                    control={control}
                    name="numeroSerie"
                    type={"text"}
                    className="mt-2"
                  />
                </div>

                <div className="mt-4 basis-1/2">
                  <FormInput
                    label={"Palabras clave"}
                    control={control}
                    name="palabrasClave"
                    type={"text"}
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
                <div className="mt-4 basis-1/2">
                  <SelectTipoForm
                    name="sedeId"
                    control={control}
                    className="mt-2"
                    label={"Tipo"}
                    placeholder={"Seleccioná un tipo"}
                  />
                </div>

                <div className="mt-4 basis-1/2">
                  <SelectEstadoForm
                    name="estadoId"
                    control={control}
                    className="mt-2"
                    label={"Estado"}
                    placeholder={"Seleccioná un estado"}
                  />
                </div>
              </div>

              <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
                <div className="mt-4 basis-1/2">
                  <SelectSedeForm
                    name="sedeId"
                    control={control}
                    className="mt-2"
                    label={"Sede"}
                    placeholder={"Seleccioná una sede"}
                    onChange={() => {
                      // @ts-expect-error - undefined
                      formHook.setValue("laboratorioId", undefined);
                      formHook.setValue("armarioId", undefined);
                      formHook.setValue("estanteId", undefined);
                    }}
                  />
                </div>

                <div className="mt-4 basis-1/2">
                  <SelectLaboratorioForm
                    name="laboratorioId"
                    control={control}
                    className="mt-2"
                    label={"Laboratorio"}
                    sedeId={sedeId}
                    disabled={!sedeId}
                    placeholder={!sedeId ? "Selecciona una sede" : "Selecciona un laboratorio"}
                    onChange={() => {
                      formHook.setValue("armarioId", undefined);
                      formHook.setValue("estanteId", undefined);
                    }}
                  />
                </div>
              </div>

              <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
                <div className="mt-4 basis-1/2">
                  <SelectArmarioForm
                    name="armarioId"
                    control={control}
                    className="mt-2"
                    label={"Armario"}
                    laboratorioId={laboratorioId}
                    placeholder={!laboratorioId ? "Selecciona un laboratorio" : "Selecciona un armario"}
                    onChange={() => {
                      formHook.setValue("estanteId", undefined);
                    }}
                  />
                </div>

                <div className="mt-4 basis-1/2">
                  <SelectEstanteForm
                    name="estanteId"
                    control={control}
                    className="mt-2"
                    label={"Estante"}
                    armarioId={armarioId}
                    placeholder={!armarioId ? "Selecciona un armario" : "Selecciona un estante"}
                  />
                </div>
              </div>

              <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
                <div className="w-full">
                  <FormInput
                    label={"Imagen"}
                    id="idioma"
                    control={control}
                    name="imagen"
                    type={"url"}
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="flex w-full flex-row lg:flex-row">
                <Label htmlFor={id} className="mb-3 flex w-full flex-col text-sm dark:text-input-label">
                  Observaciones
                  <textarea name="" id="" className="w-full dark:bg-background"></textarea>
                </Label>
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
