import React, { useState, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { XIcon } from "lucide-react";
import { Input } from "@/components/ui";

interface Item {
  id: string;
  name: string;
}

interface MultiSelectSearchProps {
  items: Item[];
  selectedItems: string[];
  onItemSelect: (itemId: string) => void;
  onItemRemove: (itemId: string) => void;
  placeholder?: string;
}

export const MultiSelectSearch: React.FC<MultiSelectSearchProps> = ({
  items,
  selectedItems,
  onItemSelect,
  onItemRemove,
  placeholder = "Buscar...",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState(items);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFilteredItems(
      items.filter(
        (item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()) && !selectedItems.includes(item.id),
      ),
    );
  }, [searchTerm, items, selectedItems]);

  const handleItemSelect = (itemId: string) => {
    onItemSelect(itemId);
    setSearchTerm("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
        {searchTerm && filteredItems.length > 0 && (
          <ScrollArea className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md shadow-lg">
            <ul className="py-1">
              {filteredItems.map((item) => (
                <li
                  key={item.id}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                  onClick={() => handleItemSelect(item.id)}
                >
                  {item.name}
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {selectedItems.map((itemId) => {
          const item = items.find((i) => i.id === itemId);
          return (
            <Badge key={itemId} variant="default" className="flex items-center gap-1">
              {item?.name}
              <Button
                type="button"
                variant="default"
                size="sm"
                className="h-4 w-4 p-0"
                onClick={() => onItemRemove(itemId)}
              >
                <XIcon className="h-3 w-3" />
              </Button>
            </Badge>
          );
        })}
      </div>
    </div>
  );
};
