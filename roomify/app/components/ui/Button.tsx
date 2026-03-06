import type { ButtonHTMLAttributes } from "react";

const VARIANTS = ["primary", "secondary", "outline", "ghost"] as const;
const SIZES = ["sm", "md", "lg"] as const;

export type ButtonVariant = (typeof VARIANTS)[number];
export type ButtonSize = (typeof SIZES)[number];

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = [
    "btn",
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth && "btn--fullWidth",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={rest.type ?? "button"} className={classes} {...rest}>
      {children}
    </button>
  );
}
