"use client";

import { useMemo, useState } from "react";
import type { Candidate, CandidateCreateRequest } from "@/types/candidate";

interface CandidateFormProps {
  initialCandidate?: Candidate;
  submitLabel: string;
  onSubmit: (payload: CandidateCreateRequest) => Promise<void>;
  isSubmitting?: boolean;
  successMessage?: string | null;
}

interface FormErrors {
  full_name?: string;
  email?: string;
  phone?: string;
  position?: string;
  experience_years?: string;
}

function getInitialValues(initialCandidate?: Candidate): CandidateCreateRequest {
  return {
    full_name: initialCandidate?.full_name ?? "",
    email: initialCandidate?.email ?? "",
    phone: initialCandidate?.phone ?? "",
    position: initialCandidate?.position ?? "",
    linkedin_url: initialCandidate?.linkedin_url ?? "",
    cv_url: initialCandidate?.cv_url ?? "",
    experience_years: initialCandidate?.experience_years ?? 0,
  };
}

function validate(values: CandidateCreateRequest): FormErrors {
  const errors: FormErrors = {};

  if (!values.full_name.trim()) {
    errors.full_name = "Full name is required.";
  }

  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(values.email)) {
      errors.email = "Please enter a valid email.";
    }
  }

  if (!values.phone.trim()) {
    errors.phone = "Phone is required.";
  }

  if (!values.position.trim()) {
    errors.position = "Position is required.";
  }

  if (!Number.isFinite(values.experience_years) || values.experience_years < 0) {
    errors.experience_years = "Experience years must be zero or greater.";
  }

  return errors;
}

export function CandidateForm({
  initialCandidate,
  submitLabel,
  onSubmit,
  isSubmitting = false,
  successMessage,
}: CandidateFormProps) {
  const [values, setValues] = useState<CandidateCreateRequest>(() => getInitialValues(initialCandidate));
  const [errors, setErrors] = useState<FormErrors>({});

  const title = useMemo(() => (initialCandidate ? "Edit Candidate" : "Create Candidate"), [initialCandidate]);

  const handleChange = <K extends keyof CandidateCreateRequest>(key: K, value: CandidateCreateRequest[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    await onSubmit({
      ...values,
      full_name: values.full_name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      position: values.position.trim(),
      linkedin_url: values.linkedin_url?.trim() || null,
      cv_url: values.cv_url?.trim() || null,
    });

    if (!initialCandidate) {
      setValues(getInitialValues(undefined));
      setErrors({});
    }
  };

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
        {successMessage ? (
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
            {successMessage}
          </span>
        ) : null}
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-zinc-500">Full name</span>
          <input
            value={values.full_name}
            onChange={(event) => handleChange("full_name", event.target.value)}
            className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          />
          {errors.full_name ? <p className="mt-1 text-xs text-rose-600">{errors.full_name}</p> : null}
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-zinc-500">Email</span>
          <input
            type="email"
            value={values.email}
            onChange={(event) => handleChange("email", event.target.value)}
            className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          />
          {errors.email ? <p className="mt-1 text-xs text-rose-600">{errors.email}</p> : null}
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-zinc-500">Phone</span>
          <input
            value={values.phone}
            onChange={(event) => handleChange("phone", event.target.value)}
            className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          />
          {errors.phone ? <p className="mt-1 text-xs text-rose-600">{errors.phone}</p> : null}
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-zinc-500">Position</span>
          <input
            value={values.position}
            onChange={(event) => handleChange("position", event.target.value)}
            className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          />
          {errors.position ? <p className="mt-1 text-xs text-rose-600">{errors.position}</p> : null}
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-zinc-500">LinkedIn URL</span>
          <input
            value={values.linkedin_url ?? ""}
            onChange={(event) => handleChange("linkedin_url", event.target.value)}
            className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-zinc-500">CV URL</span>
          <input
            value={values.cv_url ?? ""}
            onChange={(event) => handleChange("cv_url", event.target.value)}
            className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          />
        </label>

        <label className="block md:col-span-2">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-zinc-500">Experience years</span>
          <input
            type="number"
            min={0}
            step="0.5"
            value={values.experience_years}
            onChange={(event) => handleChange("experience_years", Number(event.target.value))}
            className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          />
          {errors.experience_years ? <p className="mt-1 text-xs text-rose-600">{errors.experience_years}</p> : null}
        </label>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
          >
            {isSubmitting ? "Saving..." : submitLabel}
          </button>
        </div>
      </form>
    </section>
  );
}
