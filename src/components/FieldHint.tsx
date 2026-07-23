import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

interface FieldHintProps {
  text: string;
}

const VIEWPORT_MARGIN = 12;
const POPUP_GAP = 4;
const POPUP_MAX_WIDTH = 260;

function resetPopupPosition(popup: HTMLElement): void {
  popup.style.position = "";
  popup.style.top = "";
  popup.style.left = "";
  popup.style.right = "";
  popup.style.bottom = "";
  popup.style.transform = "";
  popup.style.maxWidth = "";
  popup.style.width = "";
}

function positionPopup(container: HTMLElement, popup: HTMLElement): void {
  const trigger = container.querySelector(".field-hint-trigger");
  if (!(trigger instanceof HTMLElement)) return;

  const viewportWidth = document.documentElement.clientWidth;
  const maxWidth = Math.min(POPUP_MAX_WIDTH, viewportWidth - VIEWPORT_MARGIN * 2);

  popup.style.position = "fixed";
  popup.style.maxWidth = `${maxWidth}px`;
  popup.style.width = "max-content";

  const triggerRect = trigger.getBoundingClientRect();
  const popupWidth = popup.offsetWidth;
  const popupHeight = popup.offsetHeight;

  let left = triggerRect.left + triggerRect.width / 2 - popupWidth / 2;
  left = Math.max(
    VIEWPORT_MARGIN,
    Math.min(left, viewportWidth - VIEWPORT_MARGIN - popupWidth),
  );
  popup.style.left = `${left}px`;
  popup.style.transform = "none";

  let top = triggerRect.bottom + POPUP_GAP;
  if (top + popupHeight > window.innerHeight - VIEWPORT_MARGIN) {
    top = triggerRect.top - POPUP_GAP - popupHeight;
  }
  top = Math.max(VIEWPORT_MARGIN, top);
  popup.style.top = `${top}px`;
}

export function FieldHint({ text }: FieldHintProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const popupRef = useRef<HTMLSpanElement>(null);
  const popupId = useId();

  const updatePosition = useCallback(() => {
    if (!ref.current || !popupRef.current) return;
    if (getComputedStyle(popupRef.current).display === "none") return;
    positionPopup(ref.current, popupRef.current);
  }, []);

  useLayoutEffect(() => {
    if (!open || !popupRef.current) return;
    updatePosition();
    return () => resetPopupPosition(popupRef.current!);
  }, [open, text, updatePosition]);

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

  useEffect(() => {
    if (!open) return;

    const onReflow = () => updatePosition();
    window.addEventListener("resize", onReflow);
    window.addEventListener("scroll", onReflow, true);
    return () => {
      window.removeEventListener("resize", onReflow);
      window.removeEventListener("scroll", onReflow, true);
    };
  }, [open, updatePosition]);

  const schedulePositionUpdate = () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(updatePosition);
    });
  };

  return (
    <span
      className={`field-hint ${open ? "field-hint--open" : ""}`}
      ref={ref}
      onMouseEnter={schedulePositionUpdate}
    >
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
      <span
        id={popupId}
        ref={popupRef}
        className="field-hint-popup"
        role="tooltip"
      >
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
