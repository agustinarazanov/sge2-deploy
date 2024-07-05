"use client";

import { AlertTriangleIcon, CheckCircle2Icon, InfoIcon, XCircleIcon, XIcon, type LucideIcon } from "lucide-react";
import { Toaster as Sonner, toast as toaster, type ExternalToast } from "sonner";

import { cn } from "@/utils/cn";

type ToasterProps = React.ComponentProps<typeof Sonner>;
type ToastType = "success" | "error" | "warning" | "info";

function Toaster(props: ToasterProps) {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-lg group-[.toaster]:py-3",
          title: "group-[.toast]:pl-2",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-transparent group-[.toast]:text-muted-foreground group-[.toast]:transition-opacity group-[.toast]:hover:text-muted-foreground/80 group-[.toast]:px-0",
        },
      }}
      {...props}
    />
  );
}

const getDefaultOptions = (type: ToastType, Icon: LucideIcon): ExternalToast => ({
  icon: (
    <Icon
      className={cn("h-6 w-6", {
        "text-success": type === "success",
        "text-error": type === "error",
        "text-warning": type === "warning",
        "text-info": type === "info",
      })}
    />
  ),
  cancel: {
    label: (<XIcon className="h-5 w-5" />) as never, // FIXME: Need to fix this type
    onClick: () => toaster.dismiss(),
  },
  classNames: {
    toast: cn({
      "group-[.toaster]:border-success group-[.toaster]:bg-success-dark": type === "success",
      "group-[.toaster]:border-error group-[.toaster]:bg-error-dark": type === "error",
      "group-[.toaster]:border-warning group-[.toaster]:bg-warning-dark": type === "warning",
      "group-[.toaster]:border-info group-[.toaster]:bg-info-dark": type === "info",
    }),
  },
});

const toast = {
  success: (message: string, options?: ToasterProps) => {
    toaster.success(message, {
      ...getDefaultOptions("success", CheckCircle2Icon),
      ...options,
    });
  },
  error: (message: string, options?: ToasterProps) => {
    toaster.error(message, {
      ...getDefaultOptions("error", XCircleIcon),
      ...options,
    });
  },
  warning: (message: string, options?: ToasterProps) => {
    toaster.warning(message, {
      ...getDefaultOptions("warning", AlertTriangleIcon),
      ...options,
    });
  },
  info: (message: string, options?: ToasterProps) => {
    toaster.info(message, {
      ...getDefaultOptions("info", InfoIcon),
      ...options,
    });
  },
  dismiss: () => toaster.dismiss(),
};

export { Toaster, toast };
