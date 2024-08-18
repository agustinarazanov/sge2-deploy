import { Button } from "@/components/ui";
import { LABORATORIO_ABIERTO_ROUTE } from "@/shared/server-routes";

const subRutas = LABORATORIO_ABIERTO_ROUTE.subRutas ?? [];

export default function CursoLoading() {
  return (
    <>
      <div className="relative flex w-full flex-col items-center justify-between space-y-2 md:flex-row-reverse  md:space-x-1.5 md:space-y-0">
        <div className="relative flex w-full flex-row justify-end md:w-auto md:basis-1/3">
          {subRutas.map((subRuta, index) => (
            <Button key={index} color={"primary"} isLoading>
              {subRuta.label}
            </Button>
          ))}
        </div>

        <div className="w-full md:basis-1/3"></div>
      </div>
    </>
  );
}
