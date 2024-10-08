import { FormProvider, useForm } from "react-hook-form";
import { api } from "@/trpc/react";
import { Button, FormInput, ScrollArea, toast } from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { inputEditBooks } from "@/shared/filters/biblioteca-filter.schema";
import { type z } from "zod";
import { useEffect, useMemo } from "react";
import { MateriaDropdownMultipleForm } from "@/app/_components/form/materias-dropdown-multiple";
import { SelectEditorialForm } from "../../_components/select-editorial";
import { SelectIdiomasForm } from "../../_components/select-idiomas";
import { SelectSedeForm } from "@/app/_components/select-ubicacion/select-sede";
import { SelectLaboratorioForm } from "@/app/_components/select-ubicacion/select-laboratorio";
import { SelectArmarioForm } from "@/app/_components/select-ubicacion/select-armario";
import { SelectEstanteForm } from "@/app/_components/select-ubicacion/select-estante";
import { SelectAutoresForm } from "../../_components/select-autor";

type Props = {
  id?: string;
  onSubmit: () => void;
  onCancel: () => void;
};

type FormHelperType = {
  autor: { id: number; label: string };
  editorial: { id: number; label: string };
};

type FormEditarLibroType = z.infer<typeof inputEditBooks> & FormHelperType;

export const LibroForm = ({ id, onSubmit, onCancel }: Props) => {
  const esNuevo = id === undefined;
  const libroId = parseInt(id ?? "");

  const { data: libro, isLoading, isError } = api.biblioteca.libroPorId.useQuery({ libroId }, { enabled: !!id });

  const editarLibro = api.biblioteca.editarLibro.useMutation(); // Se llama si existe libroId
  const agregarlibro = api.biblioteca.nuevoLibro.useMutation(); // Se llama si no existe libroId

  const libroBase: FormEditarLibroType = useMemo(() => {
    if (!libro) return {} as FormEditarLibroType;
    return {
      id: libro.id,
      titulo: libro.titulo,
      isbn: libro.isbn ?? "",
      bibliotecaId: libro.bibliotecaId ?? "",
      inventarioId: libro.inventarioId,
      idiomaId: String(libro.idiomaId),
      laboratorioId: String(libro.laboratorioId),
      armarioId: String(libro.armarioId),
      estanteId: String(libro.estanteId),
      sedeId: String(libro.sedeId),
      autorId: libro.autor.id,
      autor: {
        id: libro.autor.id,
        label: libro.autor.autorNombre,
      },

      editorialId: libro.editorial.id,
      editorial: {
        id: libro.editorial.id,
        label: libro.editorial.editorial,
      },

      anio: libro.anio,
      materias: libro.materias.map((materia) => String(materia.materia.id)),
    };
  }, [libro]);

  const formHook = useForm<FormEditarLibroType>({
    mode: "onChange",
    defaultValues: libroBase,
    resolver: zodResolver(inputEditBooks),
  });

  const { handleSubmit, control, watch } = formHook;

  const [sedeId, laboratorioId, armarioId] = watch(["sedeId", "laboratorioId", "armarioId"]);
  const [autor, editorial] = watch(["autor", "editorial"]);

  useEffect(() => formHook.reset(libroBase), [formHook, libroBase]);

  const onFormSubmit = (formData: FormEditarLibroType) => {
    if (esNuevo) {
      agregarlibro.mutate(formData, {
        onSuccess: () => {
          toast.success("Libro agregado con éxito.");
          onSubmit();
        },
        onError: (error) => {
          toast.error(error?.message ?? "Error al agregar el libro");
        },
      });
      return;
    }

    editarLibro.mutate(formData, {
      onSuccess: () => {
        toast.success("Libro actualizado con éxito.");
        onSubmit();
      },
      onError: (error) => {
        toast.error(error?.message ?? "Error al actualizar el libro");
      },
    });
  };

  const handleCancel = () => {
    formHook.reset();
    onCancel();
  };

  useEffect(() => formHook.setValue("autorId", autor?.id), [formHook, autor]);
  useEffect(() => formHook.setValue("editorialId", editorial?.id), [formHook, editorial]);

  if (!esNuevo && isNaN(libroId)) {
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
        <ScrollArea className="max-h-[calc(100vh_-_20%)] w-full pr-4 md:max-h-[calc(100vh_-_20%)] lg:max-h-[calc(100vh_-_25%)]">
          <div className="flex w-full flex-col items-stretch justify-center sm:items-stretch md:items-stretch lg:items-center">
            <div className="flex flex-col space-y-4 px-0 md:px-6">
              <div className="flex w-full flex-row lg:flex-row lg:justify-between lg:gap-x-4">
                <div className="mt-4 w-full">
                  <FormInput label={"Titulo"} control={control} name="titulo" type={"text"} className="mt-2" />
                </div>
              </div>

              <div className="flex w-full flex-row lg:flex-row lg:justify-between lg:gap-x-4">
                <div className="mt-4 w-full">
                  <SelectAutoresForm
                    name="autor"
                    realNameId="autorId"
                    control={control}
                    className="mt-2"
                    label={"Autor"}
                  />
                </div>
              </div>

              <div className="flex w-full flex-col gap-x-4 lg:flex-row lg:justify-between">
                {!esNuevo && (
                  <div className="mt-4 basis-1/2">
                    <FormInput
                      label={"Inventario ID (solo lectura)"}
                      control={control}
                      name="inventarioId"
                      type={"text"}
                      className="mt-2"
                      readOnly
                    />
                  </div>
                )}
                <div className="mt-4 basis-1/2">
                  <FormInput
                    label={"Biblioteca ID"}
                    control={control}
                    name="bibliotecaId"
                    type={"text"}
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="flex w-full flex-col gap-x-4 lg:flex-row lg:justify-between">
                <div className="mt-4 basis-1/2">
                  <FormInput label={"ISBN"} control={control} name="isbn" type={"text"} className="mt-2" />
                </div>

                <div className="mt-4 basis-1/2">
                  <FormInput
                    label={"Año"}
                    control={control}
                    name="anio"
                    type={"number"}
                    className="mt-2"
                    maxLength={4}
                  />
                </div>
              </div>

              <div className="flex w-full flex-col gap-x-4 lg:flex-row lg:justify-between">
                <div className="mt-4 basis-1/2">
                  <SelectSedeForm
                    name="sedeId"
                    control={control}
                    className="mt-2 text-sm"
                    label={"Sede"}
                    placeholder={"Selecciona una sede"}
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
                    className="mt-2 text-sm"
                    label={"Laboratorio"}
                    sedeId={sedeId ? String(sedeId) : undefined}
                    disabled={!sedeId}
                    placeholder={!sedeId ? "Selecciona una sede" : "Selecciona un laboratorio"}
                    onChange={() => {
                      formHook.setValue("armarioId", undefined);
                      formHook.setValue("estanteId", undefined);
                    }}
                  />
                </div>
              </div>

              <div className="flex w-full flex-col gap-x-4 lg:flex-row lg:justify-between">
                <div className="mt-4 basis-1/2">
                  <SelectArmarioForm
                    name="armarioId"
                    control={control}
                    className="mt-2 text-sm"
                    label={"Armario"}
                    laboratorioId={laboratorioId ? Number(laboratorioId) : undefined}
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
                    className="mt-2 text-sm"
                    label={"Estante"}
                    armarioId={armarioId ? Number(armarioId) : undefined}
                    placeholder={!armarioId ? "Selecciona un armario" : "Selecciona una estante"}
                  />
                </div>
              </div>

              <div className="flex w-full flex-col gap-x-4 lg:flex-row lg:justify-between">
                <div className="mt-4 basis-1/2">
                  <SelectEditorialForm
                    name="editorial"
                    realNameId="editorialId"
                    control={control}
                    className="mt-2"
                    label={"Editorial"}
                  />
                </div>

                <div className="mt-4 basis-1/2">
                  {JSON.stringify({ idioma: formHook.watch("idiomaId"), idioma2: libro?.idiomaId })}
                  <SelectIdiomasForm
                    name="idiomaId"
                    control={control}
                    className="mt-2 text-sm"
                    label={"Idioma"}
                    placeholder={"Selecciona un idioma"}
                  />
                </div>
              </div>

              <div className="flex w-full flex-col gap-x-4 lg:flex-row lg:justify-between">
                <div className="mt-4 w-full">
                  <label>
                    Materias
                    <MateriaDropdownMultipleForm name="materias" control={control} />
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
