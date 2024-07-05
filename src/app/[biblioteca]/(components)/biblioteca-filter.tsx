"use client";

import { Button } from "@/app/_components/button";
import { CircleChevronDown } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@radix-ui/react-popover";
import { FormRadio } from "@/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { type z } from "zod";
import { api, atom, injectStore, useAtomState } from "@zedux/react";
import { type RouterInputs } from "@/trpc/react";
import { inputGetBooks } from "@/shared/biblioteca-filter.schema";

const sortItemStyle = "p-2 rounded-md hover:bg-gray-700";

type SortValue = RouterInputs["biblioteca"]["getAll"]["filter"]["orderBy"];

const opciones: { value: SortValue; label: string }[] = [
  { value: "year_asc", label: "Mas nuevo" },
  { value: "name_asc", label: "A -> Z (Alfabetico)" },
];

export const filterAsicShopSchema = inputGetBooks;

export const BibliotecaButtonOrderBy = () => {
  const [filterData, setFilterData] = useAtomState(bibliotecaFilterAtom);

  const formHook = useForm({
    defaultValues: filterData,
    resolver: zodResolver(filterAsicShopSchema),
  });

  const { control, setValue } = formHook;

  const onSubmit = (value: z.infer<typeof filterAsicShopSchema>) => {
    setFilterData(value);
  };

  const handleSortChange = async (value: SortValue) => {
    setValue("filter.orderBy", value);
    await formHook.handleSubmit(onSubmit)();
  };

  return (
    <FormProvider {...formHook}>
      <Popover>
        <PopoverTrigger asChild>
          <Button color={"secondary"}>
            Ordernar
            <CircleChevronDown className="ml-2" size={16} />
          </Button>
        </PopoverTrigger>

        <PopoverContent align="end" className="mt-2 w-60 bg-nocturne p-2">
          {opciones.map((option) => (
            <FormRadio
              key={option.value}
              name="filter.orderBy"
              value={option.value ?? "year_asc"}
              onValueChange={() => handleSortChange(option.value)}
              clickableSpace
              label={option.label}
              control={control}
              className={sortItemStyle}
            />
          ))}
        </PopoverContent>
      </Popover>
    </FormProvider>
  );
};

export const bibliotecaFilterAtom = atom("biblioteca-filter", () => {
  const store = injectStore<z.infer<typeof filterAsicShopSchema>>({
    orderBy: "newest",
  });

  return api(store);
});
