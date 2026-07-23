import { useEffect, useState } from "react";
import { FieldHint, FieldLabel } from "./FieldHint";

function useCompactDateInput(): boolean {
  const [compact, setCompact] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 639px)").matches,
  );

  useEffect(() => {
    const media = window.matchMedia("(max-width: 639px)");
    const onChange = (event: MediaQueryListEvent) => setCompact(event.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return compact;
}

interface FieldProps {
  id: string;
  label: string;
  hint?: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

export function TextField({
  id,
  label,
  hint,
  value,
  placeholder,
  onChange,
}: FieldProps) {
  return (
    <div className="field">
      <FieldLabel htmlFor={id} label={label} hint={hint} />
      <input
        id={id}
        type="text"
        className="field-input"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

interface NumberFieldProps {
  id: string;
  label: string;
  hint?: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

export function NumberField({
  id,
  label,
  hint,
  value,
  placeholder,
  onChange,
}: NumberFieldProps) {
  return (
    <div className="field">
      <FieldLabel htmlFor={id} label={label} hint={hint} />
      <input
        id={id}
        type="number"
        min="0"
        className="field-input"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

interface DateFieldProps {
  id: string;
  label: string;
  hint?: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

export function DateField({
  id,
  label,
  hint,
  value,
  placeholder = "YYYY-MM-DD",
  onChange,
}: DateFieldProps) {
  const compact = useCompactDateInput();

  return (
    <div className="field field--date">
      <FieldLabel htmlFor={id} label={label} hint={hint} />
      {compact ? (
        <input
          id={id}
          type="text"
          inputMode="numeric"
          className="field-input field-input--date-text"
          value={value}
          placeholder={placeholder}
          maxLength={10}
          autoComplete="off"
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <div className="field-date-wrap">
          <input
            id={id}
            type="date"
            className="field-input field-input--date"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      )}
    </div>
  );
}

interface SelectFieldProps {
  id: string;
  label: string;
  hint?: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

export function SelectField({
  id,
  label,
  hint,
  value,
  options,
  onChange,
}: SelectFieldProps) {
  return (
    <div className="field">
      <FieldLabel htmlFor={id} label={label} hint={hint} />
      <select
        id={id}
        className="field-input field-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

interface CheckboxFieldProps {
  id: string;
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function CheckboxField({
  id,
  label,
  hint,
  checked,
  onChange,
}: CheckboxFieldProps) {
  return (
    <div className="field field--checkbox">
      <label htmlFor={id} className="checkbox-field">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span>{label}</span>
        {hint && <FieldHint text={hint} />}
      </label>
    </div>
  );
}

interface TriStateFieldProps {
  id: string;
  label: string;
  hint?: string;
  value: "all" | "only" | "exclude";
  onChange: (value: "all" | "only" | "exclude") => void;
}

export function TriStateField({
  id,
  label,
  hint,
  value,
  onChange,
}: TriStateFieldProps) {
  return (
    <SelectField
      id={id}
      label={label}
      hint={hint}
      value={value}
      options={[
        { value: "all", label: "すべて" },
        { value: "only", label: "のみ" },
        { value: "exclude", label: "除外" },
      ]}
      onChange={(v) => onChange(v as "all" | "only" | "exclude")}
    />
  );
}
