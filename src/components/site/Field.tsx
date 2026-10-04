import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const base =
  "w-full rounded-md border border-input bg-surface px-3.5 py-2.5 text-[0.95rem] text-foreground placeholder:text-muted-foreground transition-[border-color,box-shadow] duration-200 hover:border-border-strong focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-soft aria-[invalid=true]:border-destructive";

type Common = { label: string; name: string; error?: string | undefined; hint?: string | undefined; optional?: boolean | undefined };

export function Field({ label, name, error, hint, optional, className, ...rest }: Common & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={className}>
      <label htmlFor={name} className="mb-1.5 flex justify-between text-sm font-semibold">
        {label}
        {optional && <span className="font-normal text-muted-foreground">Optional</span>}
      </label>
      <input id={name} name={name} aria-invalid={!!error} aria-describedby={error ? `${name}-err` : undefined} className={base} {...rest} />
      {hint && !error && <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>}
      {error && <p id={`${name}-err`} className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function TextArea({ label, name, error, optional, className, ...rest }: Common & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className={className}>
      <label htmlFor={name} className="mb-1.5 flex justify-between text-sm font-semibold">
        {label}
        {optional && <span className="font-normal text-muted-foreground">Optional</span>}
      </label>
      <textarea id={name} name={name} rows={5} aria-invalid={!!error} aria-describedby={error ? `${name}-err` : undefined} className={cn(base, "resize-y")} {...rest} />
      {error && <p id={`${name}-err`} className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  );
}

export const Honeypot = () => (
  <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
);

export const fieldClass = base;
