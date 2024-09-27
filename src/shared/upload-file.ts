"use server";

import { writeFile } from "fs/promises";
import { revalidatePath } from "next/cache";
import path from "path";

export async function uploadFile(formData: FormData) {
  const file = formData.get("file") as File;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const filePath = path.join(process.cwd(), "public/imagenes", file.name);
  try {
    await writeFile(filePath, buffer);
  } catch (e) {
    throw new Error(`No se pudo guardar la imagen en ${filePath}`);
  }

  revalidatePath("/");

  return `/imagenes/${file.name}`;
}
