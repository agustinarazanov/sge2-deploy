import { FormProvider, useForm } from "react-hook-form";
import { api } from "@/trpc/react";
import { Button, FormInput, Input, ScrollArea, toast } from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";
import { useEffect, useState } from "react";
import { inputEditarLaboratorio } from "@/shared/filters/admin-laboratorios-filter.schema";
import { FormSelect } from "@/components/ui/autocomplete";
import { Plus, Minus, ChevronDown, ChevronRight } from "lucide-react";

type Props = {
  id?: string;
  onSubmit: () => void;
  onCancel: () => void;
};

type FormEditarLaboratorioType = z.infer<typeof inputEditarLaboratorio>;

type Armario = {
  id?: number;
  nombre: string;
  estantes: { id?: number; nombre: string }[];
  isExpanded: boolean;
};

export const AdminLaboratorioForm = ({ id, onSubmit, onCancel }: Props) => {
  const esNuevo = id === undefined;
  const laboratorioId = parseInt(id ?? "");

  const [armarios, setArmarios] = useState<Armario[]>([]);

  const {
    data: laboratorio,
    isLoading,
    isError,
  } = api.admin.laboratorios.getLaboratorioPorId.useQuery({ id: laboratorioId }, { enabled: !!id });

  const editarLaboratorio = api.admin.laboratorios.editarLaboratorio.useMutation();
  const agregarLaboratorio = api.admin.laboratorios.nuevoLaboratorio.useMutation();

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

  useEffect(() => {
    if (laboratorio) {
      formHook.reset({
        id: laboratorio.id,
        nombre: laboratorio.nombre,
        esAbierto: laboratorio.esAbierto,
        sedeId: String(laboratorio.sedeId),
      });

      const transformedArmarios = laboratorio.armarios.map((armario) => ({
        id: armario.id,
        nombre: armario.nombre,
        estantes: armario.estantes.map((estante) => ({
          id: estante.id,
          nombre: estante.nombre,
        })),
        isExpanded: true,
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
    const dataToSubmit = {
      ...formData,
      armarios: armarios.map((armario) => ({
        ...armario,
        estantes: armario.estantes.map((estante) => ({
          ...estante,
          armarioId: armario.id,
        })),
      })),
    };

    if (esNuevo) {
      agregarLaboratorio.mutate(dataToSubmit, {
        onSuccess: () => {
          toast.success("Laboratorio agregado con éxito.");
          onSubmit();
        },
        onError: (error) => {
          toast.error(error?.message ?? "Error al agregar el laboratorio");
        },
      });
    } else {
      editarLaboratorio.mutate(dataToSubmit, {
        onSuccess: () => {
          toast.success("Laboratorio actualizado con éxito.");
          onSubmit();
        },
        onError: (error) => {
          toast.error(error?.message ?? "Error al actualizar el laboratorio");
        },
      });
    }
  };

  const handleCancel = () => {
    formHook.reset();
    onCancel();
  };

  const agregarArmario = () => {
    setArmarios([...armarios, { nombre: `Armario ${armarios.length + 1}`, estantes: [], isExpanded: true }]);
  };

  const agregarEstante = (armarioIndex: number) => {
    const nuevosArmarios = [...armarios];
    nuevosArmarios[armarioIndex].estantes.push({
      nombre: `Estante ${nuevosArmarios[armarioIndex].estantes.length + 1}`,
    });
    setArmarios(nuevosArmarios);
  };

  const eliminarArmario = (index: number) => {
    setArmarios(armarios.filter((_, i) => i !== index));
  };

  const eliminarEstante = (armarioIndex: number, estanteIndex: number) => {
    const nuevosArmarios = [...armarios];
    nuevosArmarios[armarioIndex].estantes = nuevosArmarios[armarioIndex].estantes.filter((_, i) => i !== estanteIndex);
    setArmarios(nuevosArmarios);
  };

  const toggleArmarioExpansion = (index: number) => {
    const nuevosArmarios = [...armarios];
    nuevosArmarios[index].isExpanded = !nuevosArmarios[index].isExpanded;
    setArmarios(nuevosArmarios);
  };

  return (
    <FormProvider {...formHook}>
      <form onSubmit={handleSubmit(onFormSubmit)} className="flex h-full flex-col">
        <div className="flex flex-grow flex-col overflow-hidden">
          <div className="space-y-4 px-0 md:px-6">
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
          </div>

          <div className="mt-4 flex flex-grow flex-col overflow-hidden">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Armarios</h3>
              <Button onClick={agregarArmario} variant="outline" size="sm">
                <Plus size={16} className="mr-2" />
                Agregar Armario
              </Button>
            </div>
            <div className="flex-grow overflow-hidden">
              <ScrollArea className="h-[calc(89vh-450px)] max-h-[400px]">
                <div className="space-y-4 pr-4">
                  {armarios.map((armario, armarioIndex) => (
                    <div key={armario.id ?? armarioIndex} className="rounded border p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center">
                          <Button
                            onClick={() => toggleArmarioExpansion(armarioIndex)}
                            variant="ghost"
                            size="sm"
                            className="mr-2"
                          >
                            {armario.isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                          </Button>
                          <Input
                            type="text"
                            className="flex-grow"
                            value={armario.nombre}
                            onChange={(event) => {
                              const newArmarios = [...armarios];
                              newArmarios[armarioIndex].nombre = event.target.value;
                              setArmarios(newArmarios);
                            }}
                          />
                        </div>
                        <Button onClick={() => eliminarArmario(armarioIndex)} variant="destructive" size="icon">
                          <Minus size={16} />
                        </Button>
                      </div>
                      {armario.isExpanded && (
                        <div className="ml-6 mt-2 space-y-2">
                          {armario.estantes.map((estante, estanteIndex) => (
                            <div key={estante.id ?? estanteIndex} className="flex items-center">
                              <Input
                                type="text"
                                className="mr-2 flex-grow"
                                value={estante.nombre}
                                onChange={(event) => {
                                  const newArmarios = [...armarios];
                                  newArmarios[armarioIndex].estantes[estanteIndex].nombre = event.target.value;
                                  setArmarios(newArmarios);
                                }}
                              />
                              <Button
                                onClick={() => eliminarEstante(armarioIndex, estanteIndex)}
                                variant="destructive"
                                size="icon"
                              >
                                <Minus size={16} />
                              </Button>
                            </div>
                          ))}
                          <Button
                            onClick={() => agregarEstante(armarioIndex)}
                            variant="outline"
                            size="sm"
                            className="mt-2"
                          >
                            <Plus size={16} className="mr-2" />
                            Agregar Estante
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-end space-x-4 border-t pt-4">
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
