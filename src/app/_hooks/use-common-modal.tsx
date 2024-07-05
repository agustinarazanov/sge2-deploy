import { Fragment, useMemo, useState, type ReactElement, type ReactNode } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useAtomState } from "@zedux/react";

import { cn } from "@/components/utils";
import { atom } from "@zedux/react";
import { Cross } from "lucide-react";

type ModalState = {
  isDirty: boolean;
};

export const modalAtom = atom<ModalState>("modal", {
  isDirty: false,
});

type Size = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "full";

export interface CommonModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  title?: string | null;
  children?: ReactNode;
  size?: Size;
  noPadding?: boolean;
  disabled?: boolean;
}

export const CommonModal = (props: CommonModalProps): ReactElement => {
  const size = useMemo(() => {
    switch (props.size ?? "md") {
      case "xs":
        return "max-w-xs";
      case "sm":
        return "max-w-sm";
      case "lg":
        return "max-w-lg";
      case "xl":
        return "max-w-xl";
      case "full":
        return "max-w-full";
      default:
        return "max-w-md";
    }
  }, [props.size]);

  const closeModal = (): void => {
    if (props.disabled) return;
    props.onClose?.();
  };

  return (
    <Transition appear show={props.isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-modal-overlay/80" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={cn(
                  " w-full transform rounded-md border border-gray-800 bg-nocturne text-left align-middle shadow-2xl transition-all",
                  size,
                )}
              >
                {props.title && (
                  <Dialog.Title as="h3" className="flex items-center justify-between p-6 text-lg font-medium leading-6">
                    {props.title}
                    <span className="flex-1" />
                    {!props.disabled && (
                      <Cross
                        className="h-6 w-6 cursor-pointer transition-colors hover:text-primary"
                        onClick={closeModal}
                      />
                    )}
                  </Dialog.Title>
                )}
                {props.noPadding ? props.children : <div className="p-6">{props.children}</div>}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export interface CommonModalResponse {
  ref: JSX.Element;
  open: () => void;
  close: () => void;
}

export const useCommonModal = (props: CommonModalProps): CommonModalResponse => {
  const [open, setOpen] = useState(props.isOpen ?? false);
  const [modalState, setModalState] = useAtomState(modalAtom);

  const openModal = (): void => {
    setOpen(true);
  };

  const closeModal = (): void => {
    if (!modalState.isDirty) {
      setOpen(false);
      return;
    }

    const userConfirmed = window.confirm("Are you sure you want to close the modal? Your changes will not be saved.");
    if (!userConfirmed) return;
    setOpen(false);
    setModalState((prev) => ({ ...prev, isDirty: false }));
  };

  const ref = <CommonModal {...props} isOpen={open} onClose={closeModal} />;

  return {
    ref,
    open: openModal,
    close: closeModal,
  };
};
