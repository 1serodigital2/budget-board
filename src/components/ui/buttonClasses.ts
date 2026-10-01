export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "danger-ghost";
export type ButtonSize = "sm" | "md" | "lg" | "icon" | "icon-sm";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground shadow-sm hover:brightness-110 active:brightness-95",
  secondary:
    "border bg-card text-foreground shadow-card hover:bg-muted active:bg-muted",
  ghost: "text-muted-foreground hover:bg-muted hover:text-foreground",
  danger: "bg-destructive text-white shadow-sm hover:brightness-110",
  "danger-ghost":
    "text-muted-foreground hover:bg-destructive-soft hover:text-destructive",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 gap-1.5 rounded-lg px-3 text-[13px]",
  md: "h-10 gap-2 rounded-lg px-4 text-sm",
  lg: "h-11 gap-2 rounded-xl px-5 text-sm",
  icon: "size-10 rounded-lg",
  "icon-sm": "size-8 rounded-lg",
};

/** Button styling, for links and other elements that should look like buttons. */
export const buttonClasses = (
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className = "",
) =>
  `inline-flex shrink-0 items-center justify-center font-semibold whitespace-nowrap transition-[background-color,color,filter,box-shadow] disabled:pointer-events-none disabled:opacity-55 ${variants[variant]} ${sizes[size]} ${className}`;
