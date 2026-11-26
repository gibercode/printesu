import { Palette } from "lucide-react";
import { useId, useRef } from "react";
import { useFormContext, type FieldPathByValue } from "react-hook-form";
import { validateNumber } from "../lib/pricing";
import type { QuoteForm } from "../lib/types";

type StringPath = FieldPathByValue<QuoteForm, string>;
type BooleanPath = FieldPathByValue<QuoteForm, boolean>;

type FieldProps = {
  name: StringPath;
  label: string;
  unit?: string;
  placeholder?: string;
  hint?: string;
  numeric?: boolean;
  className?: string;
};

export function Field({
  name,
  label,
  unit,
  placeholder,
  hint,
  numeric = true,
  className,
}: FieldProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { register, getFieldState, formState } = useFormContext<QuoteForm>();
  const { ref, ...field } = register(
    name,
    numeric ? { validate: validateNumber } : undefined,
  );
  const error = getFieldState(name, formState).error?.message;
  const describedBy = [hint && !error ? `${id}-h` : "", error ? `${id}-e` : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`field${className ? ` ${className}` : ""}`}>
      <label htmlFor={id}>{label}</label>
      <div
        className="cell"
        data-invalid={error ? true : undefined}
        onMouseDown={(e) => {
          if (e.target !== inputRef.current) {
            e.preventDefault();
            inputRef.current?.focus();
          }
        }}
      >
        <input
          id={id}
          {...field}
          ref={(el) => {
            ref(el);
            inputRef.current = el;
          }}
          inputMode={numeric ? "decimal" : "text"}
          placeholder={placeholder}
          autoComplete="off"
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy || undefined}
        />
        {unit && (
          <span className="unit" aria-hidden="true">
            {unit}
          </span>
        )}
      </div>
      {error ? (
        <p className="error" id={`${id}-e`}>
          {error}
        </p>
      ) : (
        hint && (
          <p className="hint" id={`${id}-h`}>
            {hint}
          </p>
        )
      )}
    </div>
  );
}

type SelectFieldProps = {
  name: StringPath;
  label: string;
  options: readonly string[];
  unit?: string;
};

export function SelectField({ name, label, options, unit }: SelectFieldProps) {
  const id = useId();
  const { register } = useFormContext<QuoteForm>();
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="cell">
        <select id={id} {...register(name)}>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        {unit && (
          <span className="unit" aria-hidden="true">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

export function CheckboxField({
  name,
  label,
}: {
  name: BooleanPath;
  label: string;
}) {
  const { register } = useFormContext<QuoteForm>();
  return (
    <div className="field check">
      <label className="toggle">
        <input type="checkbox" {...register(name)} />
        <Palette size={18} aria-hidden="true" />
        <span>{label}</span>
      </label>
    </div>
  );
}
