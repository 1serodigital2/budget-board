import type { ComponentProps, ReactNode, Ref } from "react";
import { Link, type LinkProps } from "react-router-dom";
import { buttonClasses, type ButtonSize as Size, type ButtonVariant as Variant } from "./buttonClasses";
import Icon from "./Icon";
import Spinner from "./Spinner";

interface CommonProps {
  variant?: Variant;
  size?: Size;
  icon?: string;
  iconRight?: string;
  loading?: boolean;
  className?: string;
  children?: ReactNode;
}

const iconSize = (size: Size) => (size === "sm" || size === "icon-sm" ? 18 : 20);

const Content = ({
  icon,
  iconRight,
  loading,
  size = "md",
  children,
}: Pick<CommonProps, "icon" | "iconRight" | "loading" | "size" | "children">) => (
  <>
    {loading ? (
      <Spinner size={iconSize(size) - 2} />
    ) : (
      icon && <Icon name={icon} size={iconSize(size)} />
    )}
    {children}
    {iconRight && <Icon name={iconRight} size={iconSize(size)} />}
  </>
);

type ButtonProps = CommonProps &
  Omit<ComponentProps<"button">, "className" | "children"> & {
    ref?: Ref<HTMLButtonElement>;
  };

const Button = ({
  variant,
  size,
  icon,
  iconRight,
  loading,
  className,
  children,
  disabled,
  type = "button",
  ...rest
}: ButtonProps) => (
  <button
    type={type}
    disabled={disabled || loading}
    aria-busy={loading || undefined}
    className={buttonClasses(variant, size, className)}
    {...rest}
  >
    <Content icon={icon} iconRight={iconRight} loading={loading} size={size}>
      {children}
    </Content>
  </button>
);

type ButtonLinkProps = CommonProps & Omit<LinkProps, "className" | "children">;

export const ButtonLink = ({
  variant,
  size,
  icon,
  iconRight,
  className,
  children,
  ...rest
}: ButtonLinkProps) => (
  <Link className={buttonClasses(variant, size, className)} {...rest}>
    <Content icon={icon} iconRight={iconRight} size={size}>
      {children}
    </Content>
  </Link>
);

export default Button;
