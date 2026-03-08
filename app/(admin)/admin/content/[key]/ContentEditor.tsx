"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import styles from "../../../admin.module.css";

/* ── Helpers ─────────────────────────────────────────────── */

function humanLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase())
    .trim();
}

function isLongString(val: string): boolean {
  return val.length > 100 || val.includes("\n");
}

function isImageField(key: string): boolean {
  const k = key.toLowerCase();
  return (
    k === "image" ||
    k === "logo" ||
    k === "src" ||
    k === "icon" ||
    k.endsWith("image")
  );
}

function isColorField(key: string): boolean {
  return key.toLowerCase() === "color";
}

function getItemLabel(item: unknown): string | null {
  if (typeof item !== "object" || item === null) return null;
  const obj = item as Record<string, unknown>;
  if (typeof obj.name === "string") return obj.name;
  if (typeof obj.title === "string") return obj.title;
  if (typeof obj.label === "string") return obj.label;
  if (typeof obj.heading === "string") return obj.heading;
  if (typeof obj.slug === "string") return obj.slug;
  if (typeof obj.text === "string") return obj.text;
  return null;
}

function createEmpty(template: unknown): unknown {
  if (typeof template === "string") return "";
  if (typeof template === "number") return 0;
  if (typeof template === "boolean") return false;
  if (Array.isArray(template)) return [];
  if (typeof template === "object" && template !== null) {
    const obj: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(template)) {
      if (typeof v === "string") obj[k] = "";
      else if (typeof v === "number") obj[k] = 0;
      else if (typeof v === "boolean") obj[k] = false;
      else if (Array.isArray(v)) obj[k] = [];
      else obj[k] = createEmpty(v);
    }
    return obj;
  }
  return "";
}

/* ── Field Renderers ─────────────────────────────────────── */

function StringField({
  label,
  value,
  onChange,
  fieldKey,
}: {
  label?: string;
  value: string;
  onChange: (val: string) => void;
  fieldKey?: string;
}) {
  const isLong = isLongString(value);
  const isImg = fieldKey ? isImageField(fieldKey) : false;

  return (
    <div className={styles.formField}>
      {label && (
        // biome-ignore lint/a11y/noLabelWithoutControl: visually associated with adjacent input
        <label className={styles.formLabel}>
          {humanLabel(label)}
          {isImg && <span className={styles.formHint}>— image path</span>}
        </label>
      )}
      {isLong ? (
        <textarea
          className={styles.formTextarea}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={Math.min(Math.max(value.split("\n").length + 1, 3), 14)}
        />
      ) : (
        <input
          type="text"
          className={styles.formInput}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {isImg && value && (
        <div className={styles.imagePreview}>
          {/* biome-ignore lint/performance/noImgElement: admin preview thumbnail, no optimization needed */}
          <img
            src={value}
            alt=""
            className={styles.imagePreviewThumb}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <span className={styles.imagePreviewPath}>{value}</span>
        </div>
      )}
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label?: string;
  value: number;
  onChange: (val: number) => void;
}) {
  return (
    <div className={styles.formField}>
      {label && (
        // biome-ignore lint/a11y/noLabelWithoutControl: visually associated with adjacent input
        <label className={styles.formLabel}>{humanLabel(label)}</label>
      )}
      <input
        type="number"
        className={styles.formInput}
        style={{ maxWidth: 160 }}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        step="any"
      />
    </div>
  );
}

function BooleanField({
  label,
  value,
  onChange,
}: {
  label?: string;
  value: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <div
      className={styles.formField}
      style={{ display: "flex", alignItems: "center", gap: 10 }}
    >
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        style={{ width: 18, height: 18, accentColor: "#3b82f6" }}
      />
      {label && (
        // biome-ignore lint/a11y/noLabelWithoutControl: label is visually associated with adjacent checkbox
        <label className={styles.formLabel} style={{ margin: 0 }}>
          {humanLabel(label)}
        </label>
      )}
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label?: string;
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className={styles.formField}>
      {label && (
        // biome-ignore lint/a11y/noLabelWithoutControl: visually associated with adjacent input
        <label className={styles.formLabel}>{humanLabel(label)}</label>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: 40,
            height: 36,
            border: "1px solid #333",
            borderRadius: 6,
            background: "#0a0a0a",
            cursor: "pointer",
          }}
        />
        <input
          type="text"
          className={styles.formInput}
          style={{ maxWidth: 140 }}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}

/* ── Recursive Field ─────────────────────────────────────── */

function Field({
  value,
  onChange,
  label,
  fieldKey,
  depth = 0,
}: {
  value: unknown;
  onChange: (val: unknown) => void;
  label?: string;
  fieldKey?: string;
  depth?: number;
}) {
  // String
  if (typeof value === "string") {
    if (fieldKey && isColorField(fieldKey)) {
      return <ColorField label={label} value={value} onChange={onChange} />;
    }
    return (
      <StringField
        label={label}
        value={value}
        onChange={onChange}
        fieldKey={fieldKey}
      />
    );
  }

  // Number
  if (typeof value === "number") {
    return <NumberField label={label} value={value} onChange={onChange} />;
  }

  // Boolean
  if (typeof value === "boolean") {
    return <BooleanField label={label} value={value} onChange={onChange} />;
  }

  // Array
  if (Array.isArray(value)) {
    const template = value[0];
    return (
      <div style={{ marginBottom: depth === 0 ? 24 : 16 }}>
        {label && (
          // biome-ignore lint/a11y/noLabelWithoutControl: section heading for array items
          <label className={styles.formLabel} style={{ marginBottom: 12 }}>
            {humanLabel(label)}
            <span className={styles.formHint}>
              — {value.length} {value.length === 1 ? "item" : "items"}
            </span>
          </label>
        )}
        {value.map((item, i) => {
          const itemLabel = getItemLabel(item);
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: array items have no stable unique id
            <div key={i} className={styles.arrayItem}>
              <div className={styles.arrayItemHeader}>
                <div>
                  <span className={styles.arrayItemNumber}>#{i + 1}</span>
                  {itemLabel && (
                    <span className={styles.arrayItemTitle}>{itemLabel}</span>
                  )}
                </div>
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => {
                    const next = [...value];
                    next.splice(i, 1);
                    onChange(next);
                  }}
                >
                  Remove
                </button>
              </div>
              <Field
                value={item}
                depth={depth + 1}
                onChange={(newItem) => {
                  const next = [...value];
                  next[i] = newItem;
                  onChange(next);
                }}
              />
            </div>
          );
        })}
        {template !== undefined && (
          <button
            type="button"
            className={styles.addButton}
            onClick={() => onChange([...value, createEmpty(template)])}
          >
            + Add {label ? humanLabel(label).replace(/s$/, "") : "item"}
          </button>
        )}
      </div>
    );
  }

  // Object
  if (typeof value === "object" && value !== null) {
    const entries = Object.entries(value as Record<string, unknown>);
    const isNested = depth > 0;

    const content = entries.map(([key, val]) => (
      <Field
        key={key}
        label={key}
        fieldKey={key}
        value={val}
        depth={depth + 1}
        onChange={(newVal) => {
          onChange({ ...(value as Record<string, unknown>), [key]: newVal });
        }}
      />
    ));

    if (isNested) return <>{content}</>;

    return (
      <div className={styles.formGroup}>
        {label && (
          <h3 className={styles.formGroupTitle}>{humanLabel(label)}</h3>
        )}
        {content}
      </div>
    );
  }

  // Fallback
  return (
    <div className={styles.formField}>
      {label && (
        // biome-ignore lint/a11y/noLabelWithoutControl: visually associated with adjacent input
        <label className={styles.formLabel}>{humanLabel(label)}</label>
      )}
      <input
        type="text"
        className={styles.formInput}
        value={String(value ?? "")}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

/* ── Top-Level Value Renderer ────────────────────────────── */

function ValueEditor({
  value,
  onChange,
}: {
  value: unknown;
  onChange: (val: unknown) => void;
}) {
  // If top-level is a plain string, render a big textarea
  if (typeof value === "string") {
    return (
      <textarea
        className={styles.formTextarea}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={Math.min(Math.max(value.split("\n").length + 2, 6), 20)}
        style={{ minHeight: 160 }}
      />
    );
  }

  // If top-level is an array, render items directly
  if (Array.isArray(value)) {
    return <Field value={value} onChange={onChange} />;
  }

  // If top-level is an object, render each key as a field (no wrapping group)
  if (typeof value === "object" && value !== null) {
    const entries = Object.entries(value as Record<string, unknown>);
    return (
      <>
        {entries.map(([key, val]) => (
          <Field
            key={key}
            label={key}
            fieldKey={key}
            value={val}
            depth={0}
            onChange={(newVal) => {
              onChange({
                ...(value as Record<string, unknown>),
                [key]: newVal,
              });
            }}
          />
        ))}
      </>
    );
  }

  return <Field value={value} onChange={onChange} />;
}

/* ── Main Editor ─────────────────────────────────────────── */

export default function ContentEditor({
  contentKey,
  initialValue,
}: {
  contentKey: string;
  initialValue: unknown;
}) {
  const router = useRouter();
  const [value, setValue] = useState<unknown>(initialValue);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = useCallback(async () => {
    setError(null);
    setSaving(true);
    setSaved(false);

    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: contentKey, value }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Save failed");
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }, [contentKey, value, router]);

  return (
    <div>
      {error && (
        <p className={styles.loginError} style={{ marginBottom: 20 }}>
          {error}
        </p>
      )}

      <ValueEditor value={value} onChange={setValue} />

      <div className={styles.actionsBar}>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className={styles.loginButton}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/content")}
          className={styles.logoutButton}
          style={{ width: "auto" }}
        >
          Back to Content
        </button>
        {saved && <span className={styles.savedMsg}>Changes saved</span>}
      </div>
    </div>
  );
}
