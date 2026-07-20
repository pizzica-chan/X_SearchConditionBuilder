import { useEffect, useId, useRef, useState } from "react";

interface FieldHintProps {
  text: string;
}

export function FieldHint({ text }: FieldHintProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const popupId = useId();

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  return (
    <span className={`field-hint ${open ? "field-hint--open" : ""}`} ref={ref}>
      <button
        type="button"
        className="field-hint-trigger"
        aria-label="この項目の説明"
        aria-expanded={open}
        aria-controls={popupId}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setOpen((value) => !value);
        }}
      >
        ?
      </button>
      <span id={popupId} className="field-hint-popup" role="tooltip">
        {text}
      </span>
    </span>
  );
}

interface FieldLabelProps {
  htmlFor?: string;
  label: string;
  hint?: string;
}

export function FieldLabel({ htmlFor, label, hint }: FieldLabelProps) {
  return (
    <div className="field-label-row">
      <label htmlFor={htmlFor} className="field-label">
        {label}
      </label>
      {hint && <FieldHint text={hint} />}
    </div>
  );
}
