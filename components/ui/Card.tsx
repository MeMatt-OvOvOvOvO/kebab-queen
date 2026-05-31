import type { ComponentPropsWithoutRef } from "react";

type CardProps = ComponentPropsWithoutRef<"div"> & {
  padding?: "none" | "sm" | "md";
};

const paddingStyles = {
  none: "",
  sm: "p-4",
  md: "p-5",
};

export default function Card({ padding = "none", className = "", children, ...props }: CardProps) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-sm ${paddingStyles[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
