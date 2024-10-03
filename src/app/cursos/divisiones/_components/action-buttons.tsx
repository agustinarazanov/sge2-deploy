import React from "react";
import { NuevaDivision } from "./division-new-division";
import { CURSOS_ROUTE } from "@/shared/server-routes";
import Link from "next/link";
import { Button } from "@/components/ui/button";
const rutaCurso = CURSOS_ROUTE;
const misCursosRuta = rutaCurso?.subRutas?.[0];

export const ActionButtons = () => {
  return (
    <div className="relative flex w-full items-center justify-between space-y-3 md:flex-row md:justify-end md:space-x-3 md:space-y-0">
      <div className="flex space-x-2">
        <NuevaDivision />
        <Button color={"ghost"}>
          <Link href={misCursosRuta?.href ?? "/"} passHref>
            Ir a cursos
          </Link>
        </Button>
      </div>
    </div>
  );
};
