"use client";

import { type FormEvent, useState } from "react";
import styles from "./ContactForm.module.css";

const PROJECT_TYPES = [
  { value: "branding", label: "branding" },
  { value: "editorial", label: "editorial" },
  { value: "web", label: "web" },
  { value: "foto", label: "fotografía" },
  { value: "cartel", label: "cartel" },
  { value: "ilustracion", label: "ilustración" },
  { value: "otro", label: "otro" },
];

interface FormData {
  name: string;
  projectType: string;
  contact: string;
  message: string;
}

type FormStatus = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [form, setForm] = useState<FormData>({
    name: "",
    projectType: "",
    contact: "",
    message: "",
  });
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {},
  );

  function validate(): boolean {
    const next: Partial<Record<keyof FormData, string>> = {};

    if (!form.name.trim()) next.name = "Tu nombre es requerido";
    if (!form.projectType) next.projectType = "Selecciona un tipo";
    if (!form.contact.trim()) next.contact = "¿Dónde te encontramos?";
    if (!form.message.trim()) next.message = "Cuéntanos un poco más";

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setStatus("submitting");

    try {
      console.log("Contact form submission:", form);
      await new Promise((resolve) => setTimeout(resolve, 600));
      setStatus("success");
      setForm({ name: "", projectType: "", contact: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  function handleChange(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  if (status === "success") {
    return (
      <div className={styles.success}>
        <div className={styles.successIcon}>✓</div>
        <h3 className={styles.successTitle}>¡Mensaje enviado!</h3>
        <p className={styles.successText}>
          Te respondemos en menos de 24 horas. Revisa tu correo o WhatsApp.
        </p>
        <button
          type="button"
          className={styles.resetButton}
          onClick={() => setStatus("idle")}
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.sentence}>
        {/* Line 1 */}
        <p className={styles.line}>
          <span className={styles.text}>Hola, me llamo</span>
          <span className={styles.fieldWrap}>
            <input
              id="contact-name"
              type="text"
              className={`${styles.inlineInput} ${errors.name ? styles.inputError : ""}`}
              placeholder="tu nombre"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
              aria-label="Nombre"
            />
            {errors.name && <span className={styles.error}>{errors.name}</span>}
          </span>
        </p>

        {/* Line 2 */}
        <p className={styles.line}>
          <span className={styles.text}>y tengo un proyecto de</span>
          <span className={styles.fieldWrap}>
            <select
              id="contact-project"
              className={`${styles.inlineSelect} ${errors.projectType ? styles.inputError : ""}`}
              value={form.projectType}
              onChange={(e) => handleChange("projectType", e.target.value)}
              required
              aria-label="Tipo de proyecto"
            >
              <option value="" disabled>
                elige uno
              </option>
              {PROJECT_TYPES.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.projectType && (
              <span className={styles.error}>{errors.projectType}</span>
            )}
          </span>
        </p>

        {/* Line 3 */}
        <p className={styles.line}>
          <span className={styles.text}>Me encuentras en</span>
          <span className={styles.fieldWrap}>
            <input
              id="contact-email"
              type="text"
              className={`${styles.inlineInput} ${errors.contact ? styles.inputError : ""}`}
              placeholder="correo o teléfono"
              value={form.contact}
              onChange={(e) => handleChange("contact", e.target.value)}
              required
              aria-label="Correo o teléfono"
            />
            {errors.contact && (
              <span className={styles.error}>{errors.contact}</span>
            )}
          </span>
        </p>

        {/* Line 4 */}
        <p className={styles.line}>
          <span className={styles.text}>En pocas palabras, necesito</span>
          <span className={styles.fieldWrap}>
            <textarea
              id="contact-message"
              className={`${styles.inlineTextarea} ${errors.message ? styles.inputError : ""}`}
              placeholder="cuéntanos sobre tu proyecto..."
              rows={2}
              value={form.message}
              onChange={(e) => handleChange("message", e.target.value)}
              required
              aria-label="Mensaje"
            />
            {errors.message && (
              <span className={styles.error}>{errors.message}</span>
            )}
          </span>
        </p>
      </div>

      <div className={styles.actions}>
        <button
          type="submit"
          className={styles.submit}
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Enviando..." : "Enviar"}
          <span className={styles.submitArrow}>→</span>
        </button>

        {status === "error" && (
          <p className={styles.errorGlobal}>
            Hubo un error. Intenta de nuevo o escríbenos por WhatsApp.
          </p>
        )}
      </div>
    </form>
  );
}
