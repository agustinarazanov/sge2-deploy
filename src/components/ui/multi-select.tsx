"use client";

import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { Separator } from "@radix-ui/react-separator";
import { cva, type VariantProps } from "class-variance-authority";
import { CheckIcon, ChevronDown, WandSparkles, XCircle, XIcon } from "lucide-react";

import { Badge } from "./badge";
import { Button } from "./button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./command";
import { cn } from "../utils";

const multiSelectVariants = cva(
  "m-1 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300",
  {
    variants: {
      variant: {
        default: "border-foreground/10 drop-shadow-md text-foreground bg-card hover:bg-card/80",
        secondary: "border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        inverted: "inverted",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

interface MultiSelectFormFieldProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof multiSelectVariants> {
  asChild?: boolean;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  defaultValue?: string[];
  disabled?: boolean;
  placeholder: string;
  className?: string;
  animation?: number;
  onValueChange: (value: string[]) => void;
}

const MultiSelectFormField = React.forwardRef<HTMLButtonElement, MultiSelectFormFieldProps>(
  ({ className, variant, options, defaultValue, onValueChange, placeholder, animation = 0, ...props }, ref) => {
    const [selectedValues, setSelectedValues] = React.useState<string[]>(defaultValue ?? []);
    const selectedValuesSet = React.useRef(new Set(selectedValues));
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
    const [isAnimating, setIsAnimating] = React.useState(animation > 0);

    React.useEffect(() => {
      setSelectedValues(defaultValue ?? []);
      selectedValuesSet.current = new Set(defaultValue);
    }, [defaultValue]);

    const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        setIsPopoverOpen(true);
      } else if (event.key === "Backspace" && !event.currentTarget.value) {
        selectedValues.pop();
        setSelectedValues([...selectedValues]);
        // @ts-expect-error - selectedValuesSet.current.delete is not a function
        selectedValuesSet.current.delete(selectedValues[selectedValues.length - 1]);
        onValueChange([...selectedValues]);
      }
    };
    const toggleOption = (value: string) => {
      if (selectedValuesSet.current.has(value)) {
        selectedValuesSet.current.delete(value);
        setSelectedValues(selectedValues.filter((v) => v !== value));
      } else {
        selectedValuesSet.current.add(value);
        setSelectedValues([...selectedValues, value]);
      }
      onValueChange(Array.from(selectedValuesSet.current));
    };

    return (
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            {...props}
            onClick={() => setIsPopoverOpen(!isPopoverOpen)}
            className="hover:bg-card mt-2 flex h-fit min-h-12 w-full items-center justify-between rounded-md border bg-input p-2"
            color={"secondary"}
          >
            {selectedValues.length > 0 ? (
              <div className="flex w-full items-start justify-between">
                <div className="flex flex-wrap items-center">
                  {selectedValues.map((value) => {
                    const option = options.find((o) => o.value === value);
                    const IconComponent = option?.icon;
                    return (
                      <Badge
                        key={value}
                        className={cn(
                          isAnimating ? "animate-bounce" : "",
                          multiSelectVariants({ variant, className }),
                          "w-fit",
                        )}
                        style={{
                          animationDuration: `${animation}s`,
                        }}
                        onClick={(event) => {
                          event.stopPropagation();
                          toggleOption(value);
                        }}
                      >
                        {IconComponent && <IconComponent className="mr-2 h-4 w-4" />}
                        <span className="text-sm">{option?.label}</span>
                        <XCircle className="ml-2 h-4 w-4 cursor-pointer" />
                      </Badge>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between">
                  <XIcon
                    className="mx-2 h-4 cursor-pointer "
                    onClick={(event) => {
                      setSelectedValues([]);
                      selectedValuesSet.current.clear();
                      onValueChange([]);
                      event.stopPropagation();
                    }}
                  />
                  <Separator orientation="vertical" className="flex h-full min-h-6" />
                  <ChevronDown className="h-4 cursor-pointer transition ease-in-out" />
                </div>
              </div>
            ) : (
              <div className="mx-auto flex w-full items-center justify-between">
                <span className="mx-3 text-sm text-black">{placeholder}</span>
                <ChevronDown className="h-4 cursor-pointer transition ease-in-out " />
              </div>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="z-10 w-full overflow-y-hidden rounded-md border-2 border-stone-400 p-0 drop-shadow-sm lg:w-[500px]"
          align="start"
          onEscapeKeyDown={() => setIsPopoverOpen(false)}
          onInteractOutside={(event) => {
            if (!event.defaultPrevented) {
              setIsPopoverOpen(false);
            }
          }}
        >
          <Command>
            <CommandInput placeholder="Buscar..." onKeyDown={handleInputKeyDown} />
            <CommandList>
              <CommandEmpty>No se encontraron resultados.</CommandEmpty>
              <CommandGroup className="custom-scrollbar mt-1 max-h-60 overflow-auto">
                {options.map((option) => {
                  const isSelected = selectedValuesSet.current.has(option.value);
                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => toggleOption(option.value)}
                      style={{
                        pointerEvents: "auto",
                        opacity: 1,
                      }}
                      className="cursor-pointer"
                    >
                      <div
                        className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                          isSelected ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible",
                        )}
                      >
                        <CheckIcon className="h-4 w-4" />
                      </div>
                      {option.icon && <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />}
                      <span>{option.label}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              <div>
                <CommandSeparator />
                <CommandGroup>
                  <div className="flex items-center justify-between">
                    {selectedValues.length > 0 && (
                      <>
                        <CommandItem
                          onSelect={() => {
                            setSelectedValues([]);
                            selectedValuesSet.current.clear();
                            onValueChange([]);
                          }}
                          style={{
                            pointerEvents: "auto",
                            opacity: 1,
                          }}
                          className="w-48 cursor-pointer justify-center border-2 border-primary"
                        >
                          Limpiar
                        </CommandItem>
                        <Separator orientation="vertical" className="flex h-full min-h-6" />
                      </>
                    )}
                    <CommandSeparator />
                    <CommandItem
                      onSelect={() => setIsPopoverOpen(false)}
                      style={{
                        pointerEvents: "auto",
                        opacity: 1,
                      }}
                      className="w-48 cursor-pointer justify-center border-2 border-primary"
                    >
                      Cerrar
                    </CommandItem>
                  </div>
                </CommandGroup>
              </div>
            </CommandList>
          </Command>
        </PopoverContent>
        {animation > 0 && selectedValues.length > 0 && (
          <WandSparkles
            className={cn(
              "my-2 h-3 w-3 cursor-pointer bg-background text-foreground",
              isAnimating ? "" : "text-muted-foreground",
            )}
            onClick={() => setIsAnimating(!isAnimating)}
          />
        )}
      </Popover>
    );
  },
);

MultiSelectFormField.displayName = "MultiSelectFormField";

export { MultiSelectFormField };
