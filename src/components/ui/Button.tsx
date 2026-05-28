import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonProps = {
  href?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  children: React.ReactNode;
} & (
  | React.ButtonHTMLAttributes<HTMLButtonElement>
  | React.AnchorHTMLAttributes<HTMLAnchorElement>
);

const variants = {
  primary:
    "bg-[var(--gold)] text-[var(--ink)] hover:bg-[var(--gold-light)] shadow-lg shadow-[var(--gold)]/20",
  secondary:
    "bg-[var(--ink)] text-[var(--cream)] hover:bg-[var(--ink-soft)]",
  outline:
    "border border-[var(--gold)]/50 text-[var(--cream)] hover:bg-[var(--gold)]/10",
  ghost: "text-[var(--cream-muted)] hover:text-[var(--cream)]",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-2.5 text-sm",
  lg: "px-8 py-3.5 text-base",
};

export function Button({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide transition-all duration-200",
    variants[variant],
    sizes[size],
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} type="button" {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
