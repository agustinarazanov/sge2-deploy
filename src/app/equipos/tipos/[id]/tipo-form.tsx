import { FormProvider, useForm } from "react-hook-form";
import { api } from "@/trpc/react";
import { Button, FormInput, Input, ScrollArea, toast } from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";
import { useEffect, useMemo, useState } from "react";
import { inputEditarTipo } from "@/shared/filters/equipos-tipos-filter.schema";
import { uploadFile } from "@/shared/upload-file";
import Image from "next/image";
import { getRutaImagen } from "@/shared/imagen";

type Props = {
  id?: string;
  onSubmit: () => void;
  onCancel: () => void;
};

type FormEditarTipoType = z.infer<typeof inputEditarTipo>;

export const TipoForm = ({ id, onSubmit, onCancel }: Props) => {
  const esNuevo = id === undefined;
  const tipoId = parseInt(id ?? "");

  const {
    data: tipo,
    isLoading,
    isError,
  } = api.equipos.tipoPorId.useQuery({ id: tipoId }, { enabled: !!id, refetchOnWindowFocus: false });

  const editarTipo = api.equipos.editarTipo.useMutation();
  const agregarTipo = api.equipos.nuevoTipo.useMutation();

  const [selectedImage, setSelectedImage] = useState<File>();
  const [previewImgUrl, setPreviewimgUrl] = useState("");

  const tipoBase: FormEditarTipoType = useMemo(() => {
    if (!tipo) return {} as FormEditarTipoType;

    const rutaImagen = getRutaImagen(tipo.imagen ?? "");

    setPreviewimgUrl(rutaImagen);

    return {
      id: tipo.id,
      nombre: tipo.nombre,
      imagen: tipo.imagen ?? "",
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
        fileForm.append("old", formData.imagen);
        fileForm.append("file", selectedImage);
        formData.imagen = await uploadFile(fileForm);
      }
    } catch (error) {
      toast.error("Error al guardar la imagen");
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
        <ScrollArea className="max-h-[calc(100vh_-_20%)] w-full pr-4 md:max-h-[calc(100vh_-_30%)] lg:max-h-[calc(100vh_-_30%)]">
          <div className="flex w-full flex-col items-center justify-center">
            <div className="flex flex-col space-y-4 px-0 md:flex-row md:justify-between md:space-x-8 md:px-6">
              <div className="flex w-full flex-col md:w-1/2 md:flex-col lg:justify-between">
                <div className="mt-4 basis-1/2">
                  <FormInput
                    label={"Nombre"}
                    control={control}
                    name="nombre"
                    type={"text"}
                    className="mt-2"
                    placeholder={"Ingrese nombre del tipo"}
                  />
                </div>

                <div className="mt-4 basis-1/2">
                  <Input
                    label={!previewImgUrl ? "Agregar imágen" : "Cambiar imágen"}
                    name="imagen"
                    type={"file"}
                    accept="image/*"
                    className="mt-2"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              <div className="flex w-full flex-col md:w-1/3 md:flex-row lg:justify-between">
                <div className="mt-4">
                  <div style={{ position: "relative", width: "200px", height: "200px" }}>
                    <Image
                      src={previewImgUrl ? previewImgUrl : "/no-image.svg"}
                      alt={`Equipo`}
                      className="rounded-xl"
                      sizes="200px"
                      fill
                      style={{
                        objectFit: "contain",
                      }}
                    />
                  </div>
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
