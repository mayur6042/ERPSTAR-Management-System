import { Plus, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { DataTable, type Column } from "../components/DataTable";
import { Loading } from "../components/Loading";
import { Modal } from "../components/Modal";
import { ApiError, request } from "../services/api";
import type { FieldDefinition } from "../types";

interface ResourceConfig<T extends { id: string }> {
  endpoint: string;
  title: string;
  description: string;
  singular: string;
  fields: FieldDefinition[];
  columns: Column<T>[];
}

export function ResourcePage<T extends { id: string }>({ config }: { config: ResourceConfig<T> }) {
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [error, setError] = useState("");
  const [modalError, setModalError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setRows(await request<T[]>(`/${config.endpoint}`));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not load records.");
    } finally {
      setLoading(false);
    }
  }, [config.endpoint]);

  useEffect(() => { void load(); }, [load]);

  async function save(values: Record<string, string | number>) {
    setSaving(true);
    setError("");
    setModalError("");
    try {
      await request(`/${config.endpoint}${editing ? `/${editing.id}` : ""}`, {
        method: editing ? "PUT" : "POST",
        body: JSON.stringify(values),
      });
      setEditing(null);
      setShowModal(false);
      await load();
    } catch (caught) {
      setModalError(caught instanceof ApiError ? caught.message : "Could not save this record.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(row: T) {
    if (!window.confirm(`Delete this ${config.singular.toLowerCase()}? This cannot be undone.`)) return;
    setError("");
    try {
      await request(`/${config.endpoint}/${row.id}`, { method: "DELETE" });
      setRows((current) => current.filter((item) => item.id !== row.id));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not delete this record.");
    }
  }

  return (
    <div className="resource-page"><div className="page-intro"><div><span className="eyebrow">OPERATIONS</span><h1>{config.title}</h1><p>{config.description}</p></div><button className="button button-primary" onClick={() => { setEditing(null); setModalError(""); setShowModal(true); }}><Plus size={16} /> Add {config.singular}</button></div>
      {error && <div className="notice notice-error" role="alert">{error}<button onClick={() => setError("")}>Dismiss</button></div>}
      <div className="resource-overview"><div><span className="resource-count">{rows.length}</span><span className="resource-count-label">total {config.title.toLowerCase()}</span></div><button className="button button-secondary button-small" onClick={() => void load()}><RefreshCw size={14} /> Refresh</button></div>
      {loading ? <Loading label={`Loading ${config.title.toLowerCase()}...`} /> : <DataTable rows={rows} columns={config.columns} onEdit={(row) => { setEditing(row); setModalError(""); setShowModal(true); }} onDelete={remove} />}
      {showModal && <Modal title={`${editing ? "Edit" : "Add"} ${config.singular}`} fields={config.fields} saving={saving} error={modalError} initialValues={editing ?? undefined} submitLabel={editing ? "Save changes" : "Create record"} onClose={() => { setShowModal(false); setEditing(null); }} onSubmit={save} />}
    </div>
  );
}
