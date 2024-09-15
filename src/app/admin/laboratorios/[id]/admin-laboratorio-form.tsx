import { useForm } from "react-hook-form";
import { api } from "@/trpc/react";
import { Button, FormInput, Input, ScrollArea, toast } from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";
import { useEffect, useState, useRef } from "react";
import { inputEditarLaboratorio } from "@/shared/filters/admin-laboratorios-filter.schema";
import { Plus, Minus, ChevronDown, ChevronRight } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { SelectSedeForm } from "@/app/_components/select-ubicacion/select-sede";

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
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef<number>(0);

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
      esReservable: laboratorio?.esReservable ?? false,
      sedeId: String(laboratorio?.sedeId) ?? "",
      tienePc: laboratorio?.tienePc ?? false,
    },
    resolver: zodResolver(inputEditarLaboratorio),
  });

  const { handleSubmit, control } = formHook;

  useEffect(() => {
    if (laboratorio) {
      formHook.reset({
        id: laboratorio.id,
        nombre: laboratorio.nombre,
        esReservable: laboratorio.esReservable,
        sedeId: String(laboratorio.sedeId),
        tienePc: laboratorio.tienePc,
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

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollPositionRef.current;
    }
  }, [armarios]);

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
    saveScrollPosition();
    setArmarios([...armarios, { nombre: `Armario ${armarios.length + 1}`, estantes: [], isExpanded: true }]);
  };

  const agregarEstante = (armarioIndex: number) => {
    saveScrollPosition();
    const nuevosArmarios = [...armarios];
    if (!nuevosArmarios[armarioIndex]) {
      return;
    }
    nuevosArmarios[armarioIndex].estantes.push({
      nombre: `Estante ${nuevosArmarios[armarioIndex]?.estantes.length + 1}`,
    });
    setArmarios(nuevosArmarios);
  };

  const eliminarArmario = (index: number) => {
    saveScrollPosition();
    setArmarios(armarios.filter((_, i) => i !== index));
  };

  const eliminarEstante = (armarioIndex: number, estanteIndex: number) => {
    saveScrollPosition();
    const nuevosArmarios = [...armarios];
    if (!nuevosArmarios[armarioIndex]) {
      return;
    }

    nuevosArmarios[armarioIndex].estantes = nuevosArmarios[armarioIndex]?.estantes.filter((_, i) => i !== estanteIndex);
    setArmarios(nuevosArmarios);
  };

  const toggleArmarioExpansion = (index: number) => {
    saveScrollPosition();
    const nuevosArmarios = [...armarios];
    if (!nuevosArmarios[index]) {
      return;
    }

    nuevosArmarios[index].isExpanded = !nuevosArmarios[index].isExpanded;
    setArmarios(nuevosArmarios);
  };

  const saveScrollPosition = () => {
    if (scrollAreaRef.current) {
      scrollPositionRef.current = scrollAreaRef.current.scrollTop;
    }
  };

  return (
    <Form {...formHook}>
      <form onSubmit={handleSubmit(onFormSubmit)} className="flex h-full flex-col">
        <ScrollArea className="h-[calc(400vh-450px)] max-h-[400px]" ref={scrollAreaRef}>
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
                  <SelectSedeForm label={"Sede"} control={control} name="sedeId" className="mt-2" />
                </div>
              </div>
              <div className="flex w-full flex-row lg:flex-row lg:justify-between lg:gap-x-4">
                <div className="flex w-full flex-row lg:justify-between lg:gap-x-4">
                  <div className="w-1/2">
                    <FormField
                      control={control}
                      name="esReservable"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Laboratorio abierto</FormLabel>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="w-1/2">
                    <FormField
                      control={control}
                      name="tienePc"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Tiene PC</FormLabel>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-grow flex-col overflow-hidden">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Armarios</h3>
                <Button onClick={agregarArmario} variant="default" size="sm">
                  <Plus size={16} className="mr-2" />
                  Agregar Armario
                </Button>
              </div>
              <div className="flex-grow overflow-hidden">
                <div className="space-y-4 pr-4">
                  {armarios.map((armario, armarioIndex) => (
                    <div key={armario.id ?? armarioIndex} className="rounded border p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center">
                          <Button
                            onClick={() => toggleArmarioExpansion(armarioIndex)}
                            variant="default"
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
                              if (!newArmarios[armarioIndex]) {
                                return;
                              }
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
                                  if (!newArmarios[armarioIndex]) {
                                    return;
                                  }
                                  if (!newArmarios[armarioIndex].estantes[estanteIndex]) {
                                    return;
                                  }
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
                            variant="default"
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
              </div>
            </div>
          </div>
        </ScrollArea>
        <div className="mt-4 flex justify-end space-x-4 border-t pt-4">
          <Button title="Cancelar" type="button" variant="default" color="secondary" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button title="Guardar" type="submit" variant="default" color="primary">
            Guardar
          </Button>
        </div>
      </form>
    </Form>
  );
};
