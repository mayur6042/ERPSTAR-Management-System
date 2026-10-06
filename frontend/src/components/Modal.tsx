import { X } from "lucide-react";
import type { FormEvent, ReactNode } from "react";
import type { FieldDefinition } from "../types";

export function Modal({
  title,
  fields,
  saving,
  error,
  initialValues,
  submitLabel,
  onClose,
  onSubmit,
}: {
  title: string;
  fields: FieldDefinition[];
  saving: boolean;
  error?: string;
  initialValues?: Record<string, unknown>;
  submitLabel: string;
  onClose: () => void;
  onSubmit: (values: Record<string, string | number>) => Promise<void>;
}) {
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const values: Record<string, string | number> = {};
    fields.forEach((field) => {
      const value = String(form.get(field.name) ?? "");
      values[field.name] = field.type === "number" ? Number(value) : value;
    });
    await onSubmit(values);
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-heading"><div><span className="eyebrow">NEW RECORD</span><h2 id="modal-title">{title}</h2></div><button className="icon-button" onClick={onClose} aria-label="Close"><X size={18} /></button></div>
        <form onSubmit={submit}>
          {error && <div className="form-error" role="alert">{error}</div>}
          <div className="form-grid">{fields.map((field) => <Field key={field.name} field={field} value={initialValues?.[field.name]} />)}</div>
          <div className="modal-actions"><button type="button" className="button button-secondary" onClick={onClose}>Cancel</button><button className="button button-primary" disabled={saving}>{saving ? "Saving..." : submitLabel}</button></div>
        </form>
      </section>
    </div>
  );
}

function Field({ field, value }: { field: FieldDefinition; value?: unknown }) {
  const initialValue = value == null ? "" : String(value);
  const common = { id: field.name, name: field.name, required: field.required, placeholder: field.label, defaultValue: field.type === "date" ? initialValue.slice(0, 10) : initialValue };
  let control: ReactNode;
  if (field.type === "select") {
    control = <select {...common} defaultValue={initialValue}><option value="" disabled>Select {field.label.toLowerCase()}</option>{field.options?.map((option) => <option key={option}>{option}</option>)}</select>;
  } else {
    control = <input {...common} type={field.type ?? "text"} min={field.type === "number" ? 0 : undefined} step={field.type === "number" ? "0.01" : undefined} />;
  }
  return <label className="form-field" htmlFor={field.name}><span>{field.label}{field.required && <em> *</em>}</span>{control}</label>;
}
