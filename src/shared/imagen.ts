export const getRutaImagen = (imagenUrl: string) => {
  if (!imagenUrl) {
    return "/no-image.svg";
  }

  if (imagenUrl.startsWith("http")) {
    return imagenUrl;
  }

  return `/imagenes/${imagenUrl}`;
};
