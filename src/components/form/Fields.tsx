import type { ComponentProps, ReactNode } from "react";
import Icon from "../ui/Icon";

export const controlClasses =
  "block w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground shadow-card transition-[border-color,box-shadow] placeholder:text-subtle hover:border-subtle focus:border-ring focus:ring-3 focus:ring-ring/15 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:border-destructive aria-invalid:focus:ring-destructive/15";

interface FieldProps {
  id: string;
  label: ReactNode;
  required?: boolean;
  hint?: ReactNode;
  error?: string;
  children: ReactNode;
  className?: string;
}

export const Field = ({
  id,
  label,
  required,
  hint,
  error,
  children,
  className = "",
}: FieldProps) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    <label htmlFor={id} className="text-[13px] font-medium text-foreground">
      {label}
      {required && <span className="ml-0.5 text-destructive">*</span>}
    </label>
    {children}
    {error ? (
      <p id={`${id}-error`} className="flex items-center gap-1 text-xs font-medium text-destructive">
        <Icon name="error" size={14} />
        {error}
      </p>
    ) : (
      hint && <p className="text-xs text-muted-foreground">{hint}</p>
    )}
  </div>
);

type InputProps = Omit<ComponentProps<"input">, "className"> & {
  className?: string;
  invalid?: boolean;
};

export const Input = ({ className = "", invalid, ...props }: InputProps) => (
  <input
    aria-invalid={invalid || undefined}
    aria-describedby={invalid && props.id ? `${props.id}-error` : undefined}
    className={`${controlClasses} h-10 ${className}`}
    {...props}
  />
);

/** Amount input with a rupee prefix. */
export const MoneyInput = ({ className = "", invalid, ...props }: InputProps) => (
  <div className="relative">
    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground">
      ₹
    </span>
    <input
      type="number"
      inputMode="decimal"
      step="0.01"
      min="0"
      aria-invalid={invalid || undefined}
      className={`${controlClasses} tabular h-10 pl-7 ${className}`}
      {...props}
    />
  </div>
);

type SelectProps = Omit<ComponentProps<"select">, "className"> & {
  className?: string;
  invalid?: boolean;
};

export const Select = ({ className = "", invalid, children, ...props }: SelectProps) => (
  <div className="relative">
    <select
      aria-invalid={invalid || undefined}
      className={`${controlClasses} h-10 appearance-none pr-9 ${className}`}
      {...props}
    >
      {children}
    </select>
    <Icon
      name="expand_more"
      size={18}
      className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground"
    />
  </div>
);

type TextareaProps = Omit<ComponentProps<"textarea">, "className"> & {
  className?: string;
};

export const Textarea = ({ className = "", ...props }: TextareaProps) => (
  <textarea className={`${controlClasses} min-h-20 resize-y py-2.5 ${className}`} {...props} />
);
