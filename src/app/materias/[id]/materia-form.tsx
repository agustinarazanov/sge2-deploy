import { FormProvider, useForm } from "react-hook-form";
import { api } from "@/trpc/react";
import { Button, FormInput, ScrollArea, toast } from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { inputEditarMateria, inputAgregarMateria } from "@/shared/filters/materia-filter.schema";
import { type z } from "zod";
import { useEffect, useMemo } from "react";

type Props = {
  id?: string;
  onSubmit: () => void;
  onCancel: () => void;
};

type FormEditarMateriaType = z.infer<typeof inputEditarMateria>;

export const MateriaForm = ({ id, onSubmit, onCancel }: Props) => {
  const esNueva = id === undefined;
  const materiaId = parseInt(id ?? "");

  const {
    data: materia,
    isLoading,
    isError,
  } = api.materia.getMateriaById.useQuery({ id: materiaId }, { enabled: !!id });

  const editarMateria = api.materia.editarMateria.useMutation();
  const agregarMateria = api.materia.nuevaMateria.useMutation();

  const materiaBase: FormEditarMateriaType = useMemo(() => {
    if (!materia) return {} as FormEditarMateriaType;
    return {
      id: materia.id,
      nombre: materia.nombre,
      codigo: materia.codigo,
      anio: materia.anio ?? 0,
      duracion: materia.duracion ?? "AMBOS",
      tipo: materia.tipo ?? "ELECTIVA",
    };
  }, [materia]);

  const formHook = useForm<FormEditarMateriaType>({
    mode: "onChange",
    defaultValues: materiaBase,
    resolver: zodResolver(id ? inputEditarMateria : inputAgregarMateria),
  });

  const { handleSubmit, control } = formHook;

  useEffect(() => formHook.reset(materiaBase), [formHook, materiaBase]);

  const onFormSubmit = (formData: FormEditarMateriaType) => {
    if (esNueva) {
      agregarMateria.mutate(formData, {
        onSuccess: () => {
          toast.success("Materia agregada con éxito.");
          onSubmit();
        },
        onError: (error) => {
          toast.error(error?.message ?? "Error al agregar la materia");
        },
      });
      return;
    }

    editarMateria.mutate(formData, {
      onSuccess: () => {
        toast.success("Materia actualizada con éxito.");
        onSubmit();
      },
      onError: (error) => {
        toast.error(error?.message ?? "Error al actualizar la materia");
      },
    });
  };

  const handleCancel = () => {
    formHook.reset();
    onCancel();
  };

  if (!esNueva && isNaN(materiaId)) {
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
        <ScrollArea className="max-h-[calc(100vh_-_20%)] w-full pr-4 md:max-h-[calc(100vh_-_30%)] lg:max-h-[calc(100vh_-_30%)]">
          <div className="flex w-full flex-col items-center justify-center">
            <div className="flex flex-col space-y-4 px-0 md:px-6">
              {/* Campo de Código */}
              <div className="mt-4 w-full">
                <FormInput
                  label={"Código"}
                  control={control}
                  name="codigo"
                  type={"text"}
                  className="mt-2 bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-300"
                />
                {formHook.formState.errors.codigo && (
                  <span className="text-red-500">
                    {formHook.formState.errors.codigo.message ?? "El código es requerido"}
                  </span>
                )}
              </div>

              {/* Campo de Año */}
              <div className="mt-4 w-full">
                <label className="block text-sm font-medium text-gray-700 dark:text-white">Año</label>
                <select
                  {...formHook.register("anio", {
                    required: "Debes seleccionar un año",
                    valueAsNumber: true,
                    validate: (value) =>
                      typeof value === "number" && value >= 1 && value <= 6 ? true : "Selecciona un año válido",
                  })}
                  className="mt-2 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Seleccionar año</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                  <option value={6}>6</option>
                </select>
                {formHook.formState.errors.anio && (
                  <span className="text-red-500">
                    {formHook.formState.errors.anio.message ?? "El año es requerido"}
                  </span>
                )}
              </div>

              {/* Campo de Nombre */}
              <div className="mt-4 w-full">
                <FormInput
                  label={"Nombre"}
                  control={control}
                  name="nombre"
                  type={"text"}
                  className="mt-2 bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-300"
                />
              </div>

              {/* Campo de Duración */}
              <div className="mt-4 w-full">
                <label className="block text-sm font-medium text-gray-700 dark:text-white">Duración</label>
                <select
                  {...formHook.register("duracion", { required: "Debes seleccionar una duración" })}
                  className="mt-2 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="ANUAL">Anual</option>
                  <option value="CUATRIMESTRAL">Cuatrimestral</option>
                  <option value="AMBOS">Ambos</option>
                </select>
                {formHook.formState.errors.duracion && (
                  <span className="text-red-500">
                    {formHook.formState.errors.duracion.message ?? "La duración es requerida"}
                  </span>
                )}
              </div>

              {/* Campo de Tipo */}
              <div className="mt-4 w-full">
                <label className="block text-sm font-medium text-gray-700 dark:text-white">Tipo</label>
                <select
                  {...formHook.register("tipo", { required: "Debes seleccionar un tipo" })}
                  className="mt-2 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="INTEGRADORA">Integradora</option>
                  <option value="OBLIGATORIA">Obligatoria</option>
                  <option value="ELECTIVA">Electiva</option>
                </select>
                {formHook.formState.errors.tipo && (
                  <span className="text-red-500">
                    {formHook.formState.errors.tipo.message ?? "El tipo es requerido"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
        <div className="mb-3 flex w-full flex-row items-end justify-center space-x-4 md:justify-end lg:justify-end">
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
