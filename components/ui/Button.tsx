import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

type BaseProps = {
  variant?: "primary" | "secondary" | "ghost" | "gold";
  size?: "sm" | "md" | "lg";
};

type ButtonAsButton = BaseProps &
  ComponentPropsWithoutRef<"button"> & { href?: undefined };

type ButtonAsLink = BaseProps &
  ComponentPropsWithoutRef<"a"> & { href: string };

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantStyles: Record<NonNullable<BaseProps["variant"]>, string> = {
  primary:   "bg-gradient-to-br from-pink to-pink-dark text-white disabled:opacity-60",
  secondary: "bg-pink-light text-pink font-semibold",
  ghost:     "text-pink font-medium",
  gold:      "bg-gradient-to-br from-gold to-gold-warm text-navy disabled:opacity-60",
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

  if (href !== undefined) {
    return (
      <Link href={href} className={classes} {...(props as ComponentPropsWithoutRef<"a">)}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(props as ComponentPropsWithoutRef<"button">)}>
      {children}
    </button>
  );
}
