import { type inputGetBooks } from "@/shared/biblioteca-filter.schema";
import { usePathname, useRouter } from "next/navigation";
import { type z } from "zod";

type BibliotecaFilters = z.infer<typeof inputGetBooks>;

const createQueryString = (filters: BibliotecaFilters) => {
  const params = new URLSearchParams(filters);

  return params.toString();
};

export const useBibliotecaQueryParam = () => {
  const pathname = usePathname();
  const router = useRouter();

  const changeQueryParams = (filters: BibliotecaFilters) => {
    router.push(pathname + "?" + createQueryString(filters));
  };

  return {
    refresh: () => router.refresh(),
    changeQueryParams,
  };
};
