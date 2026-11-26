import { CircleAlert, Palette } from "lucide-react";
import { useId, useRef, useState } from "react";
import { useFormContext, type FieldPathByValue } from "react-hook-form";
import { useAttempted } from "../context/attempt";
import { validateHours, validateNumber } from "../lib/pricing";
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
  /** "hours" accepts 3.5, 3:30 or 3h 30m instead of a plain number. */
  kind?: "hours";
  /** Makes the field required; the text is the error shown when it is empty. */
  required?: string;
  className?: string;
};

export function Field({
  name,
  label,
  unit,
  placeholder,
  hint,
  numeric = true,
  kind,
  required,
  className,
}: FieldProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { register, getFieldState, formState } = useFormContext<QuoteForm>();
  const check = kind === "hours" ? validateHours : validateNumber;
  const rules = numeric
    ? {
        validate: (v: string) =>
          required && v.trim() === "" ? required : check(v),
      }
    : required
      ? { validate: (v: string) => v.trim() !== "" || required }
      : undefined;
  const { ref, onChange, ...field } = register(name, rules);
  // An empty required field is only reported after the user typed in it and cleared it, or tried to export.
  const attempted = useAttempted();
  const [typed, setTyped] = useState(false);
  const raw = getFieldState(name, formState).error?.message;
  const error = raw && (raw !== required || attempted || typed) ? raw : undefined;
  const describedBy = [hint ? `${id}-h` : "", error ? `${id}-e` : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`field${className ? ` ${className}` : ""}`}>
      <label htmlFor={id}>
        <span>
          {label}
          {required && (
            <span className="req" aria-hidden="true">
              {" *"}
            </span>
          )}
        </span>
        {error && (
          <span className="tag" aria-hidden="true">
            <CircleAlert size={14} />
            {error === required ? "Falta" : "No válido"}
          </span>
        )}
      </label>
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
          onChange={(e) => {
            if (e.target.value.trim() !== "") setTyped(true);
            return onChange(e);
          }}
          ref={(el) => {
            ref(el);
            inputRef.current = el;
          }}
          inputMode={numeric && kind !== "hours" ? "decimal" : "text"}
          placeholder={placeholder}
          autoComplete="off"
          aria-invalid={error ? true : undefined}
          aria-required={required ? true : undefined}
          aria-describedby={describedBy || undefined}
        />
        {unit && (
          <span className="unit" aria-hidden="true">
            {unit}
          </span>
        )}
      </div>
      {/* The visible mark lives in the label row so an error never moves the fields below. */}
      {error && (
        <p className="sr-only" id={`${id}-e`}>
          {error}
        </p>
      )}
      {hint && (
        <p className="hint" id={`${id}-h`}>
          {hint}
        </p>
      )}
    </div>
  );
}

type SelectFieldProps = {
  name: StringPath;
  label: string;
  options: readonly (string | { value: string; label: string })[];
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
          {options.map((o) => {
            const { value, label: text } = typeof o === "string" ? { value: o, label: o } : o;
            return (
              <option key={value} value={value}>
                {text}
              </option>
            );
          })}
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
  className,
}: {
  name: BooleanPath;
  label: string;
  className?: string;
}) {
  const { register } = useFormContext<QuoteForm>();
  return (
    <div className={`field check${className ? ` ${className}` : ""}`}>
      <label className="toggle">
        <input type="checkbox" {...register(name)} />
        <Palette size={18} aria-hidden="true" />
        <span>{label}</span>
      </label>
    </div>
  );
}
