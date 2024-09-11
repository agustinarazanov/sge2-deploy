import { FormProvider, useForm, useWatch } from "react-hook-form";
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
      idiomaId: libro.idiomaId,
      laboratorioId: libro.laboratorioId,
      armarioId: libro.armarioId,
      estanteId: libro.estanteId,
      sedeId: libro.sedeId,
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

  const [sedeId, laboratorioId, armarioId, estanteId] = watch(["sedeId", "laboratorioId", "armarioId", "estanteId"]);
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
      <div>{JSON.stringify({ sedeId, laboratorioId, armarioId, estanteId })}</div>
      <form onSubmit={handleSubmit(onFormSubmit)} className="relative flex w-full flex-col gap-4">
        <ScrollArea className="max-h-[calc(100vh_-_30%)] w-full pr-4">
          <div className="flex w-full flex-col items-center justify-center">
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

              <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
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

              <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
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

              <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
                <div className="mt-4 basis-1/2">
                  <SelectSedeForm
                    name="sedeId"
                    control={control}
                    className="mt-2"
                    label={"Sede"}
                    placeholder={"Selecciona una sede"}
                    onChange={() => {
                      // @ts-expect-error - undefined
                      formHook.setValue("laboratorioId", undefined);
                      // @ts-expect-error - undefined
                      formHook.setValue("armarioId", undefined);
                      // @ts-expect-error - undefined
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
                      // @ts-expect-error - undefined
                      formHook.setValue("armarioId", undefined);
                      // @ts-expect-error - undefined
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
                      // @ts-expect-error - undefined
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
                    placeholder={!armarioId ? "Selecciona un armario" : "Selecciona una estante"}
                  />
                </div>
              </div>

              <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
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
                  <SelectIdiomasForm
                    name="idiomaId"
                    control={control}
                    className="mt-2"
                    label={"Idioma"}
                    placeholder={"Selecciona un idioma"}
                  />
                </div>
              </div>

              <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
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
