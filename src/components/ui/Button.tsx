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
    "bg-gradient-to-r from-[var(--gold-dark)] to-[var(--gold)] text-[var(--ink)] hover:from-[var(--gold)] hover:to-[var(--gold-light)] shadow-lg shadow-[var(--gold)]/25",
  secondary:
    "bg-[var(--ink-elevated)] text-[var(--cream)] border border-white/10 hover:border-[var(--gold)]/40",
  outline:
    "border border-[var(--gold)]/50 text-[var(--cream)] hover:bg-[var(--gold)]/10 hover:border-[var(--gold)]",
  ghost: "text-[var(--cream-muted)] hover:text-[var(--gold)]",
};

const sizes = {
  sm: "px-5 py-2 text-xs uppercase tracking-wider",
  md: "px-6 py-2.5 text-sm",
  lg: "px-9 py-4 text-sm uppercase tracking-wider",
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
    "inline-flex items-center justify-center gap-2 rounded-sm font-semibold transition-all duration-300",
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
    <button
      className={classes}
      type="button"
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
}
