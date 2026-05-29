import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  light = false,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        align === "center" && "text-center",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center gap-4",
          align === "center" && "justify-center",
        )}
      >
        {align === "center" && <span className="gold-line w-12 sm:w-20" />}
        <p
          className={cn(
            "text-[10px] font-semibold uppercase tracking-[0.35em]",
            light ? "text-[var(--gold)]" : "text-[var(--gold-dark)]",
          )}
        >
          {eyebrow}
        </p>
        {align === "center" && <span className="gold-line w-12 sm:w-20" />}
      </div>
      <h2
        className={cn(
          "mt-4 font-serif text-4xl font-light leading-tight sm:text-5xl",
          light ? "text-[var(--cream)]" : "text-[var(--ink)]",
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 max-w-2xl text-base leading-relaxed",
            align === "center" && "mx-auto",
            light ? "text-[var(--cream-muted)]" : "text-[var(--ink-muted)]",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
