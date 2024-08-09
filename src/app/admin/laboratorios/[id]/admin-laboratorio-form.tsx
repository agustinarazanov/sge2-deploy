import { FormProvider, useForm } from "react-hook-form";
import { api } from "@/trpc/react";
import { Button, FormInput, Input, ScrollArea, toast } from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";
import { useEffect, useState } from "react";
import { inputEditarLaboratorio } from "@/shared/filters/admin-laboratorios-filter.schema";
import { FormSelect } from "@/components/ui/autocomplete";

type Props = {
  id?: string;
  onSubmit: () => void;
  onCancel: () => void;
};

type FormEditarLaboratorioType = z.infer<typeof inputEditarLaboratorio>;

export const AdminLaboratorioForm = ({ id, onSubmit, onCancel }: Props) => {
  const esNuevo = id === undefined;
  const laboratorioId = parseInt(id ?? "");

  const [armarios, setArmarios] = useState<
    { id: number; nombre: string; estantes: { id: number; nombre: string }[] }[]
  >([]);

  const {
    data: laboratorio,
    isLoading,
    isError,
  } = api.admin.laboratorios.getLaboratorioPorId.useQuery({ id: laboratorioId }, { enabled: !!id });

  const editarLaboratorio = api.admin.laboratorios.editarLaboratorio.useMutation(); // Se llama si existe laboratorioId
  const agregarLaboratorio = api.admin.laboratorios.nuevoLaboratorio.useMutation(); // Se llama si no existe laboratorioId

  const formHook = useForm<FormEditarLaboratorioType>({
    mode: "onChange",
    defaultValues: {
      id: laboratorio?.id ?? undefined,
      nombre: laboratorio?.nombre ?? "",
      esAbierto: laboratorio?.esAbierto ?? false,
      sedeId: String(laboratorio?.sedeId) ?? "",
    },
    resolver: zodResolver(inputEditarLaboratorio),
  });

  const { handleSubmit, control } = formHook;

  // TODO: Separar componente de formulario y logica de carga y actualización de laboratorio
  useEffect(() => {
    if (laboratorio) {
      formHook.reset({
        id: laboratorio.id,
        nombre: laboratorio.nombre,
        esAbierto: laboratorio.esAbierto,
        sedeId: String(laboratorio.sedeId),
      });

      // Transform the `armarios` data to match the expected type
      const transformedArmarios = laboratorio.armarios.map((armario) => ({
        id: armario.id,
        nombre: armario.nombre,
        estantes: armario.estantes.map((estante) => ({
          id: estante.id,
          nombre: estante.nombre,
        })),
      }));

      setArmarios(transformedArmarios);
    }
  }, [formHook, laboratorio]);

  if (!esNuevo && isNaN(laboratorioId)) {
    return <div>Error al cargar...</div>;
  }

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (isError) {
    return <div>Error al cargar...</div>;
  }

  const onFormSubmit = (formData: FormEditarLaboratorioType) => {
    if (esNuevo) {
      agregarLaboratorio.mutate(formData, {
        onSuccess: () => {
          toast.success("Laboratorio agregado con éxito.");
          onSubmit();
        },
        onError: (error) => {
          toast.error(error?.message ?? "Error al agregar el laboratorio");
        },
      });
      return;
    }

    editarLaboratorio.mutate(formData, {
      onSuccess: () => {
        toast.success("Laboratorio actualizado con éxito.");
        onSubmit();
      },
      onError: (error) => {
        toast.error(error?.message ?? "Error al actualizar el laboratorio");
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
          <div className="flex w-full flex-col space-y-4 px-0 md:px-6">
            <div className="flex w-full flex-row lg:flex-row lg:justify-between lg:gap-x-4">
              <div className="mt-4 w-full">
                <FormInput
                  label={"Nombre"}
                  control={control}
                  name="nombre"
                  type={"text"}
                  className="mt-2"
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="flex w-full flex-row lg:flex-row lg:justify-between lg:gap-x-4">
              <div className="mt-4 w-full">
                <FormSelect
                  label={"Sede"}
                  control={control}
                  name="sedeId"
                  className="mt-2"
                  items={[
                    { id: "1", label: "Medrano" },
                    { id: "2", label: "Lugano" },
                  ]}
                />
              </div>
              <div className="mt-4 w-full">
                <FormInput
                  type="checkbox"
                  label={"Laboratorio abierto"}
                  control={control}
                  name="esAbierto"
                  className="mt-2"
                />
              </div>
            </div>

            <ScrollArea className="mt-4 h-80 max-h-80 w-full pr-4">
              <div className="flex w-full flex-row lg:flex-row lg:justify-between lg:gap-x-4">
                <div className="mt-4 w-full">
                  {armarios?.map((armario, indexArmario) => (
                    <div key={armario.id} className="flex w-full flex-col space-y-2">
                      <div className="flex w-full flex-row lg:flex-row lg:justify-between lg:gap-x-4">
                        <div className="mt-4 w-full">
                          <Input
                            label={"Nombre de armario"}
                            type={"text"}
                            className="mt-2"
                            autoComplete="off"
                            value={armario.nombre}
                            onChange={(event) => {
                              const newArmarios = [...armarios];

                              const newArmario = newArmarios[indexArmario];

                              if (newArmario) {
                                newArmario.nombre = event.target.value;
                              }

                              setArmarios(newArmarios);
                            }}
                          />
                        </div>
                        <div className="mt-4 flex w-full flex-col gap-2">
                          {armario.estantes?.map((estante, indexEstante) => (
                            <div key={estante.id} className="flex w-full flex-col space-y-2">
                              <div className="flex w-full flex-row lg:flex-row lg:justify-between lg:gap-x-4">
                                <div className="w-full">
                                  <Input
                                    label={"Nombre de estante"}
                                    type={"text"}
                                    className="mt-2"
                                    autoComplete="off"
                                    value={estante.nombre}
                                    onChange={(event) => {
                                      const newArmarios = [...armarios];

                                      const newArmario = newArmarios[indexArmario];

                                      if (newArmario) {
                                        const newEstante = newArmario.estantes[indexEstante];

                                        if (newEstante) {
                                          newEstante.nombre = event.target.value;
                                        }
                                      }

                                      setArmarios(newArmarios);
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollArea>
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
