import { NextResponse } from "next/server";
import { ZodError } from "zod";

type FieldErrors = Record<string, string[] | undefined>;

export type ApiSuccess<T> = {
  ok: true;
  data: T;
};

export type ApiFailure = {
  ok: false;
  error: {
    code: string;
    details?: unknown;
    fieldErrors?: FieldErrors;
    message: string;
  };
};

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export class HttpError extends Error {
  code: string;
  details?: unknown;
  fieldErrors?: FieldErrors;
  status: number;

  constructor(
    status: number,
    code: string,
    message: string,
    details?: unknown,
    fieldErrors?: FieldErrors,
  ) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
    this.fieldErrors = fieldErrors;
  }
}

export function jsonOk<T>(data: T, init?: ResponseInit) {
  return NextResponse.json<ApiSuccess<T>>({ ok: true, data }, init);
}

export function jsonError(error: unknown) {
  if (error instanceof HttpError) {
    return NextResponse.json<ApiFailure>(
      {
        ok: false,
        error: {
          code: error.code,
          details: error.details,
          fieldErrors: error.fieldErrors,
          message: error.message,
        },
      },
      { status: error.status },
    );
  }

  if (error instanceof ZodError) {
    const flattened = error.flatten();

    return NextResponse.json<ApiFailure>(
      {
        ok: false,
        error: {
          code: "validation_error",
          fieldErrors: flattened.fieldErrors,
          message:
            flattened.formErrors[0] ?? "The submitted request data is invalid.",
        },
      },
      { status: 400 },
    );
  }

  console.error(error);

  return NextResponse.json<ApiFailure>(
    {
      ok: false,
      error: {
        code: "internal_error",
        message: "An unexpected server error occurred.",
      },
    },
    { status: 500 },
  );
}
