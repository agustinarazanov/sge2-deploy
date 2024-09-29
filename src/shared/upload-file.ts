"use server";

import { mkdirSync } from "fs";
import { rm, writeFile } from "fs/promises";
import { revalidatePath } from "next/cache";
import path from "path";

export async function uploadFile(formData: FormData) {
  const oldFile = formData.get("old") as string;
  if (oldFile) {
    try {
      await removeFile(oldFile);
    } catch (e) {
      console.error(`No se pudo eliminar la imagen ${oldFile}`);
    }
  }

  const file = formData.get("file") as File;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const dir = path.join("./public/imagenes");
  mkdirSync(dir, { recursive: true });

  const newName = `${Date.now().toString()}-${file.name}`;
  const filePath = path.join(dir, newName);

  try {
    await writeFile(filePath, buffer);
  } catch (e) {
    throw new Error(`No se pudo guardar la imagen en ${filePath}`);
  }

  revalidatePath("/");

  return `${newName}`;
}

export async function removeFile(fileName: string) {
  const filePath = path.join("./public/imagenes", fileName);

  try {
    await rm(filePath);
  } catch (e) {
    throw new Error(`No se pudo eliminar la imagen en ${filePath}`);
  }
}
