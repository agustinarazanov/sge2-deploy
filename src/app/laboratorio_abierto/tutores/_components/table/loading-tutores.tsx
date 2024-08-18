import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingTutoresContainer() {
  return (
    <>
      <div className="flex flex-row gap-x-8 px-4">
        <Card className="w-full basis-1/3">
          <div className="flex flex-col space-y-4">
            <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
              <Skeleton className="h-80 w-full" />
            </div>

            <Card className="w-full basis-1/3">
              <Skeleton className="h-10 w-full" />
            </Card>
          </div>
        </Card>
        <Card className="w-full basis-1/3">
          <div className="flex flex-col space-y-4">
            <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
              <Skeleton className="h-80 w-full" />
            </div>

            <Card className="w-full basis-1/3">
              <Skeleton className="h-10 w-full" />
            </Card>
          </div>
        </Card>
        <Card className="w-full basis-1/3">
          <div className="flex flex-col space-y-4">
            <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
              <Skeleton className="h-80 w-full" />
            </div>

            <Card className="w-full basis-1/3">
              <Skeleton className="h-10 w-full" />
            </Card>
          </div>
        </Card>
      </div>
    </>
  );
}
