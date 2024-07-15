import { Loader2 } from "lucide-react";
import { Button } from "../button";

export default function LoadingPagination() {
  return (
    <div className="mt-4 flex items-center justify-between px-2">
      <div className="flex items-center space-x-3 lg:space-x-8">
        <div className="flex items-center justify-center text-sm font-medium">
          <Loader2 className="h-4 animate-spin" />
          <span>Cargando Libros...</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button isLoading variant="icon" color="secondary" size="sm" className="hidden lg:flex" />
          <Button isLoading variant="icon" color="secondary" size="sm" className="hidden lg:flex" />
          <Button isLoading variant="icon" color="secondary" size="sm" className="hidden lg:flex" />
          <Button isLoading variant="icon" color="secondary" size="sm" className="hidden lg:flex" />
        </div>
      </div>
    </div>
  );
}
