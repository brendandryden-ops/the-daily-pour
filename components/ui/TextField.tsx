import type { ComponentPropsWithoutRef, ReactNode } from "react";

const fieldClasses =
  "h-12 w-full rounded-field border-2 bg-raised px-4 text-body text-ink placeholder:text-ink-muted/70 focus:border-ink";

type FieldShellProps = {
  id: string;
  label: string;
  helper?: ReactNode;
  error?: string;
  children: (describedBy: string | undefined, invalid: boolean) => ReactNode;
};

function FieldShell({ id, label, helper, error, children }: FieldShellProps) {
  const helperId = helper ? `${id}-helper` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [errorId, helperId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-small font-medium text-ink">
        {label}
      </label>
      {children(describedBy, Boolean(error))}
      {error ? (
        <p id={errorId} className="flex items-center gap-1.5 text-small text-hot">
          <AlertIcon />
          {error}
        </p>
      ) : null}
      {helper ? (
        <p id={helperId} className="text-small text-ink-muted">
          {helper}
        </p>
      ) : null}
    </div>
  );
}

function AlertIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5.5M12 16.5h.01" />
    </svg>
  );
}

type TextFieldProps = Omit<ComponentPropsWithoutRef<"input">, "id"> & {
  id: string;
  label: string;
  helper?: ReactNode;
  error?: string;
};

export function TextField({ id, label, helper, error, className = "", ...input }: TextFieldProps) {
  return (
    <FieldShell id={id} label={label} helper={helper} error={error}>
      {(describedBy, invalid) => (
        <input
          id={id}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          className={`${fieldClasses} ${invalid ? "border-hot" : "border-line-strong"} ${className}`}
          {...input}
        />
      )}
    </FieldShell>
  );
}

type SelectFieldProps = Omit<ComponentPropsWithoutRef<"select">, "id"> & {
  id: string;
  label: string;
  helper?: ReactNode;
  error?: string;
};

export function SelectField({
  id,
  label,
  helper,
  error,
  className = "",
  children,
  ...select
}: SelectFieldProps) {
  return (
    <FieldShell id={id} label={label} helper={helper} error={error}>
      {(describedBy, invalid) => (
        <select
          id={id}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          className={`${fieldClasses} ${invalid ? "border-hot" : "border-line-strong"} ${className}`}
          {...select}
        >
          {children}
        </select>
      )}
    </FieldShell>
  );
}
