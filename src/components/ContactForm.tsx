"use client";

import { FormEvent, useState } from "react";
import { contactFormSchema, type ContactFormInput } from "@/lib/validation";

type FieldErrors = Partial<Record<keyof ContactFormInput, string>>;

const initialForm: ContactFormInput = {
  name: "",
  email: "",
  message: "",
};

export function ContactForm() {
  const [form, setForm] = useState<ContactFormInput>(initialForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");

  function validateClient(): boolean {
    const result = contactFormSchema.safeParse(form);
    if (result.success) {
      setErrors({});
      return true;
    }
    const fieldErrors: FieldErrors = {};
    for (const [key, messages] of Object.entries(
      result.error.flatten().fieldErrors
    )) {
      const msg = (messages as string[] | undefined)?.[0];
      if (msg) fieldErrors[key as keyof ContactFormInput] = msg;
    }
    setErrors(fieldErrors);
    return false;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError("");
    if (!validateClient()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          const fieldErrors: FieldErrors = {};
          for (const [key, messages] of Object.entries(data.errors)) {
            const msg = (messages as string[] | undefined)?.[0];
            if (msg) fieldErrors[key as keyof ContactFormInput] = msg;
          }
          setErrors(fieldErrors);
        }
        setServerError(data.message ?? "Submission failed");
        return;
      }

      setSubmitted(true);
      setForm(initialForm);
    } catch {
      setServerError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div
        className="animate-fade-in rounded-2xl border border-brand-200 bg-gradient-to-br from-white to-brand-50 p-10 text-center shadow-card"
        role="status"
        aria-live="polite"
      >
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-3xl">
          ✓
        </div>
        <h2 className="font-display text-2xl font-semibold text-brand-800">
          Form Submitted Successfully
        </h2>
        <p className="mt-2 text-gray-600">
          Thank you for reaching out. Our team will get back to you soon.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="btn-secondary mt-6"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-brand-100 bg-white p-6 shadow-card sm:p-8"
      noValidate
    >
      <div className="space-y-5">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-gray-700">
            Name <span className="text-brand-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            className={`input-field ${errors.name ? "input-error" : ""}`}
            placeholder="Your full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && (
            <p id="name-error" className="mt-1 text-sm text-red-600">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
            Email <span className="text-brand-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className={`input-field ${errors.email ? "input-error" : ""}`}
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p id="email-error" className="mt-1 text-sm text-red-600">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-gray-700">
            Message <span className="text-brand-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            className={`input-field resize-y min-h-[120px] ${errors.message ? "input-error" : ""}`}
            placeholder="How can we help you?"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "message-error" : undefined}
          />
          {errors.message && (
            <p id="message-error" className="mt-1 text-sm text-red-600">
              {errors.message}
            </p>
          )}
          <p className="mt-1 text-right text-xs text-gray-400">
            {form.message.length}/2000
          </p>
        </div>

        {serverError && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
            {serverError}
          </p>
        )}

        <button type="submit" className="btn-primary w-full sm:w-auto" disabled={loading}>
          {loading ? (
            <>
              <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Submitting…
            </>
          ) : (
            "Submit"
          )}
        </button>
      </div>
    </form>
  );
}
