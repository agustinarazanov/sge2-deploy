"use client";

import { Input } from "@/components/ui";
import { debounce } from "lodash";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export const BibliotecaFilterText = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [searchText, setSearchText] = useState(searchParams.get("searchText") ?? "");

  const handleFormSubmit = useCallback(async () => {
    const params = searchParams.toString();
    const newParams = new URLSearchParams(params);

    newParams.set("searchText", searchText);

    router.push(pathname + "?" + newParams.toString());
  }, [searchParams, searchText, router, pathname]);

  const debounceSave = useCallback(debounce(handleFormSubmit, 300), [handleFormSubmit]);

  useEffect(() => {
    debounceSave();
  }, [debounceSave, searchText]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchText(e.target.value);
    debounceSave.cancel();
  };

  return (
    <form onSubmit={handleFormSubmit} className="w-full">
      <Input
        placeholder={"Buscar por título o por autor"}
        name="searchText"
        type={"text"}
        value={searchText}
        onChange={handleTextChange}
        autoFocus
      />
    </form>
  );
};
