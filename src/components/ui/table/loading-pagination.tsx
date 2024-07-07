import { Button } from "../button";
import { Skeleton } from "../skeleton";

export default function LoadingPagination() {
  return (
    <div className="mt-4 flex items-center justify-between px-2">
      <div className="flex items-center space-x-3 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-[100px]" />
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          <Skeleton className="h-4 w-[100px]" />
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
