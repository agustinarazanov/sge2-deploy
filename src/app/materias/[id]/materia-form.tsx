import { FormProvider, useForm } from "react-hook-form";
import { api } from "@/trpc/react";
import { Button, FormInput, ScrollArea, toast } from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { inputEditarMateria, inputAgregarMateria } from "@/shared/filters/materia-filter.schema";
import { type z } from "zod";
import { useCallback, useEffect, useMemo } from "react";
import { MateriaDropdownMultipleForm } from "@/app/_components/form/materias-dropdown-multiple";
import { EstatusCorrelativa } from "@prisma/client";
import { SelectUsuarioForm } from "@/app/_components/select-usuario";

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

  const getCorrelativasPorTipo = useCallback(
    (estatus: EstatusCorrelativa) => {
      if (!materia) return [];

      return materia.correlativa
        .filter((c) => c.estatusCorrelativa === estatus)
        .map((correlativa) => correlativa.materiaPrerequisitoId.toString());
    },
    [materia],
  );

  const materiaBase = useMemo(() => {
    if (!materia) return {} as FormEditarMateriaType;
    return {
      id: materia.id ?? undefined,
      nombre: materia.nombre ?? "",
      codigo: materia.codigo ?? "",
      anio: materia.anio ? String(materia.anio) : undefined,
      duracion: materia.duracion ?? undefined,
      tipo: materia.tipo ?? undefined,
      aprobadasParaCursar: getCorrelativasPorTipo(EstatusCorrelativa.CURSAR_APROBADA),
      aprobadasParaRendir: getCorrelativasPorTipo(EstatusCorrelativa.RENDIR_APROBADA),
      regularizadas: getCorrelativasPorTipo(EstatusCorrelativa.CURSAR_REGULARIZADA),
    };
  }, [getCorrelativasPorTipo, materia]);

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
            <div className="flex w-full flex-col space-y-4 px-0 md:px-6">
              <div className="w-full">
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
              </div>

              <div className="flex flex-row gap-4">
                <div className="basis-1/2">
                  {/* Campo de Código */}
                  <div className="mt-4 w-full">
                    <FormInput
                      label={"Código"}
                      control={control}
                      name="codigo"
                      type={"text"}
                      className="mt-2 bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-300"
                    />
                  </div>
                </div>
                <div className="basis-1/2">
                  {/* Campo de Año */}
                  <div className="mt-4 w-full">
                    <label className="block text-sm font-medium text-gray-700 dark:text-white">Año</label>
                    <select
                      {...formHook.register("anio", {
                        required: "Debes seleccionar un año",
                      })}
                      className="mt-2 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Seleccionar año</option>
                      <option value={"1"}>1</option>
                      <option value={"2"}>2</option>
                      <option value={"3"}>3</option>
                      <option value={"4"}>4</option>
                      <option value={"5"}>5</option>
                      <option value={"6"}>6</option>
                    </select>
                    {formHook.formState.errors.anio && (
                      <span className="text-red-500">
                        {formHook.formState.errors.anio.message ?? "El año es requerido"}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-row gap-4">
                <div className="basis-1/2">
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
                </div>
                <div className="basis-1/2">
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

              <div className="flex flex-row gap-4">
                {/* Director de la materia */}
                <div className="mt-4 basis-1/2">
                  <SelectUsuarioForm
                    label={"Director"}
                    control={control}
                    name="nombre"
                    className="mt-2 bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-300"
                  />
                </div>

                {/* Jefes de Trabajos Prácticos */}
                <div className="mt-4 basis-1/2">
                  <SelectUsuarioForm
                    label={"Jefes de Trabajos Prácticos"}
                    control={control}
                    name="nombre"
                    className="mt-2 bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-300"
                  />
                </div>
              </div>

              <div className="w-full">
                {/* Para Cursar - Tener Regularizadas */}
                <div className="mt-6">
                  <label htmlFor="regularizadas">
                    Para Cursar - Tener Regularizadas:
                    <MateriaDropdownMultipleForm name="regularizadas" control={control} />
                  </label>
                </div>
              </div>

              <div className="w-full">
                {/* Para Cursar - Tener Aprobadas */}
                <div className="mt-6">
                  <label htmlFor="aprobadasParaCursar">
                    Para Cursar - Tener Aprobadas:
                    <MateriaDropdownMultipleForm name="aprobadasParaCursar" control={control} />
                  </label>
                </div>
              </div>

              <div className="w-full">
                {/* Para Rendir - Tener Aprobadas */}
                <div className="mt-6">
                  <label htmlFor="aprobadasParaRendir">
                    Para Rendir - Tener Aprobadas:
                    <MateriaDropdownMultipleForm name="aprobadasParaRendir" control={control} />
                  </label>
                </div>
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
