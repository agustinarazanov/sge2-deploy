"use client";

import { BibliotecaNewLibro } from "./biblioteca-new-book";
import { useRouter } from "next/navigation";

export const ActionButtons = () => {
  const router = useRouter();

  const handleCambioEnBiblioteca = () => router.refresh();

  return (
    <div className="relative flex w-full flex-row items-center justify-end space-x-1.5">
      <BibliotecaNewLibro onSubmit={handleCambioEnBiblioteca} />
    </div>
  );
};
