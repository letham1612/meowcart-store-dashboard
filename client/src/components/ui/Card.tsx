
import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({
  children,
  className = "",
}: CardProps) {
  return (
    <section
      className={`
        rounded-2xl
        border border-slate-100
        bg-white
        shadow-sm
        ${className}
      `}
    >
      {children}
    </section>
  );
}
