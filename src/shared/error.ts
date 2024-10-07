import { type TRPCClientErrorLike } from "@trpc/client";

export type ITRPCError = {
  meta: { response: object };
  shape: {
    message: string;
    code: number;
    data: {
      code: string;
      httpStatus: number;
      stack: string;
      path: string;
      zodError: null;
    };
  };
  data: {
    code: string;
    httpStatus: number;
    stack: string;
    path: string;
    zodError: null;
  };
  name: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getMensajeError = (error: Error | TRPCClientErrorLike<any>, defaultError?: string): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  if (typeof error !== "object" || error === null) {
    return defaultError ?? "Error desconocido";
  }

  if (Object.hasOwn(error, "shape")) {
    const shape = error.shape;

    if (Object.hasOwn(shape, "message")) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      return shape?.message ?? defaultError ?? "Error desconocido";
    }
  }

  return defaultError ?? "Error desconocido";
};
