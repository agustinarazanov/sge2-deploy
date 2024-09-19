import { FormProvider, useForm } from "react-hook-form";
import { api } from "@/trpc/react";
import { Button, FormInput, Input, ScrollArea, toast } from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";
import { useEffect, useMemo, useState } from "react";
import { inputEditarTipo } from "@/shared/filters/equipos-tipos-filter.schema";
import { uploadFile } from "@/shared/upload-file";
import Image from "next/image";

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
      imagen: "",
      fechaCreacion: tipo.fechaCreacion,
      usuarioCreadorId: tipo.usuarioCreadorId,
    };
  }, [tipo]);

  const formHook = useForm<FormEditarTipoType>({
    mode: "onChange",
    defaultValues: tipoBase,
    resolver: zodResolver(inputEditarTipo),
  });

  const { handleSubmit, control } = formHook;

  useEffect(() => formHook.reset(tipoBase), [formHook, tipoBase]);

  const [selectedImage, setSelectedImage] = useState<File>();
  const [previewImgUrl, setPreviewimgUrl] = useState("");

  if (!esNuevo && isNaN(tipoId)) {
    return <div>Error al cargar...</div>;
  }

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (isError) {
    return <div>Error al cargar...</div>;
  }

  const onFormSubmit = async (formData: FormEditarTipoType) => {
    try {
      const fileForm = new FormData();
      if (selectedImage) {
        fileForm.append("file", selectedImage);
        formData.imagen = await uploadFile(fileForm);
      }
    } catch (error) {
      console.log(error);
      return;
    }

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) {
      setSelectedImage(undefined);
      setPreviewimgUrl("");
      return;
    }

    setSelectedImage(e.target.files?.[0]);

    setPreviewimgUrl(URL.createObjectURL(e.target.files?.[0]));
  };

  return (
    <FormProvider {...formHook}>
      <form onSubmit={handleSubmit(onFormSubmit)} className="relative flex w-full flex-col gap-4">
        <ScrollArea className="max-h-[calc(100vh_-_30%)] w-full pr-4">
          <div className="flex w-full flex-col items-center justify-center">
            <div className="flex flex-col space-y-4 px-0 md:px-6">
              <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
                <div className="mt-4 basis-2/4">
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
              <div className="flex w-full flex-col gap-x-4 lg:flex-row lg:justify-between">
                <div className="mt-4 basis-2/4">
                  <Input
                    label={"Agregar imagen"}
                    //control={control}
                    name="imagen"
                    type={"file"}
                    accept="image/*"
                    className="mt-2"
                    onChange={handleFileChange}
                  />
                </div>
                <div className="mt-4 h-32 w-32 basis-1/3">
                  {previewImgUrl && (
                    <Image
                      src={previewImgUrl}
                      className="mt-2 h-auto w-auto"
                      alt="Imagen del tipo"
                      height={100}
                      width={100}
                    />
                  )}
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
