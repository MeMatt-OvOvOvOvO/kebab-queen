import type { ComponentPropsWithoutRef } from "react";

type BadgeVariant = "pink" | "wege" | "hot" | "gluten" | "gold" | "dark" | "muted";

type BadgeProps = ComponentPropsWithoutRef<"span"> & {
  variant?: BadgeVariant;
};

const styles: Record<BadgeVariant, React.CSSProperties> = {
  pink:   { background: "#F0147A",  color: "#fff" },
  wege:   { background: "#16A34A",  color: "#fff" },
  hot:    { background: "#EA580C",  color: "#fff" },
  gluten: { background: "#7C3AED",  color: "#fff" },
  gold:   { background: "#F5C518",  color: "#7A5C00" },
  dark:   { background: "#1E1B2E",  color: "#fff" },
  muted:  { background: "#F3F4F6",  color: "#6B7280" },
};

export default function Badge({ variant = "muted", className = "", children, ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${className}`}
      style={styles[variant]}
      {...props}
    >
      {children}
    </span>
  );
}
