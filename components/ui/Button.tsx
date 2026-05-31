import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

type BaseProps = {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
};

type ButtonAsButton = BaseProps &
  ComponentPropsWithoutRef<"button"> & { href?: undefined };

type ButtonAsLink = BaseProps &
  ComponentPropsWithoutRef<"a"> & { href: string };

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantStyles: Record<NonNullable<BaseProps["variant"]>, string> = {
  primary: "text-white disabled:opacity-60",
  secondary: "font-semibold",
  ghost: "font-medium",
};

const variantInlineStyles: Record<NonNullable<BaseProps["variant"]>, React.CSSProperties> = {
  primary: { background: "linear-gradient(135deg, #F0147A 0%, #C4006A 100%)" },
  secondary: { background: "#FADADF", color: "#F0147A" },
  ghost: { color: "#F0147A" },
};

const sizeStyles: Record<NonNullable<BaseProps["size"]>, string> = {
  sm: "px-4 py-1.5 text-sm rounded-full",
  md: "px-6 py-2.5 text-sm rounded-full",
  lg: "px-6 py-3.5 text-base rounded-2xl",
};

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  href,
  children,
  ...props
}: ButtonProps) {
  const classes = `inline-flex items-center justify-center font-semibold transition-opacity hover:opacity-90 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;
  const style = variantInlineStyles[variant];

  if (href !== undefined) {
    return (
      <Link href={href} className={classes} style={style} {...(props as ComponentPropsWithoutRef<"a">)}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} style={style} {...(props as ComponentPropsWithoutRef<"button">)}>
      {children}
    </button>
  );
}
