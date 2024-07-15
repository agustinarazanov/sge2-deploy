"use client";

import { Input } from "@/components/ui";
import { SearchIcon } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const DEBOUNCE_TIME = 300;

export const BibliotecaFilterText = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [searchText, setSearchText] = useState(searchParams.get("searchText")?.toString() ?? "");

  const handleFormSubmit = useDebouncedCallback(async () => {
    const params = searchParams.toString();
    const newParams = new URLSearchParams(params);

    newParams.set("searchText", searchText);

    router.push(pathname + "?" + newParams.toString());
  }, DEBOUNCE_TIME);

  useEffect(() => {
    void handleFormSubmit();

    return () => handleFormSubmit.cancel();
  }, [handleFormSubmit, searchText]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchText(e.target.value);
  };

  return (
    <form onSubmit={() => handleFormSubmit.flush()} className="w-full">
      <Input
        placeholder={"Buscar por título o por autor"}
        name="searchText"
        unit={<SearchIcon className="relative top-0.5 h-4 w-4 text-sub" />}
        type={"text"}
        value={searchText}
        onChange={handleTextChange}
        onKeyUp={(e) => {
          if (e.key === "Escape") setSearchText("");
        }}
        autoFocus
      />
    </form>
  );
};
