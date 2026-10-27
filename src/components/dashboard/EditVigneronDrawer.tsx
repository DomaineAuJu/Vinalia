"use client";

import { useEffect, useId, useState } from "react";
import { updateVigneronData } from "@/lib/services/vigneron";
import type { VigneronInput } from "@/lib/validators/vigneron.schema";

const fieldClassName =
  "mt-1.5 w-full rounded-xl border border-[#e4d9c8] bg-white px-3 text-sm text-[#2c322c] outline-none placeholder:text-[#b4b9b1] focus:border-[#3e5c45]";

const inputClassName = `${fieldClassName} h-11`;
const textareaClassName = `${fieldClassName} min-h-[7.5rem] py-2.5`;

type EditVigneronDrawerProps = {
  open: boolean;
  onClose: () => void;
  userId: string;
  initialData: VigneronInput;
  onSaved?: (data: VigneronInput) => void;
};

export function EditVigneronDrawer({
  open,
  onClose,
  userId,
  initialData,
  onSaved,
}: EditVigneronDrawerProps) {
  const titleId = useId();
  const [values, setValues] = useState<VigneronInput>(initialData);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof VigneronInput, string>>
  >({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setValues(initialData);
    setFieldErrors({});
    setFormError(null);
  }, [open, initialData]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isLoading) onClose();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, isLoading, onClose]);

  function updateField<K extends keyof VigneronInput>(
    key: K,
    value: VigneronInput[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => ({ ...current, [key]: undefined }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setFormError(null);

    const result = await updateVigneronData(userId, values);
    if (!result.ok) {
      setFieldErrors(result.fieldErrors);
      setFormError(result.message);
      setIsLoading(false);
      return;
    }

    onSaved?.(result.data);
    setIsLoading(false);
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-start lg:items-stretch">
      <button
        type="button"
        className="absolute inset-0 bg-[#2c322c]/25 lg:bg-[#2c322c]/10"
        aria-label="Fermer le formulaire"
        onClick={() => {
          if (!isLoading) onClose();
        }}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 flex max-h-[72vh] w-full max-w-lg flex-col rounded-t-2xl border border-[#e4d9c8] bg-[#fffdf8] shadow-[0_16px_40px_rgba(44,50,44,0.16)] lg:max-h-none lg:rounded-none lg:border-y-0 lg:border-l-0"
      >
        <div className="flex items-center justify-between border-b border-[#e4d9c8] px-5 py-4">
          <h2
            id={titleId}
            className="font-[family-name:var(--font-display)] text-2xl text-[#2c322c]"
          >
            Modifier mes informations
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-full px-3 py-1 text-sm text-[#8b9288] hover:bg-[#f6f3ec] disabled:opacity-60"
          >
            Fermer
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col overflow-y-auto px-5 py-5"
          noValidate
        >
          <div className="space-y-4">
            <label className="block" htmlFor="vigneron-description">
              <span className="text-xs uppercase tracking-[0.12em] text-[#8b9288]">
                Description
              </span>
              <textarea
                id="vigneron-description"
                name="description"
                maxLength={500}
                value={values.description}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                aria-invalid={Boolean(fieldErrors.description)}
                className={textareaClassName}
              />
              {fieldErrors.description ? (
                <p className="mt-1 text-sm text-red-800" role="alert">
                  {fieldErrors.description}
                </p>
              ) : (
                <p className="mt-1 text-xs text-[#8b9288]">
                  {values.description.length}/500
                </p>
              )}
            </label>

            <label className="block" htmlFor="vigneron-email">
              <span className="text-xs uppercase tracking-[0.12em] text-[#8b9288]">
                E-mail de contact
              </span>
              <input
                id="vigneron-email"
                name="contact_email"
                type="email"
                autoComplete="email"
                value={values.contact_email}
                onChange={(event) =>
                  updateField("contact_email", event.target.value)
                }
                aria-invalid={Boolean(fieldErrors.contact_email)}
                className={inputClassName}
              />
              {fieldErrors.contact_email ? (
                <p className="mt-1 text-sm text-red-800" role="alert">
                  {fieldErrors.contact_email}
                </p>
              ) : null}
            </label>

            <label className="block" htmlFor="vigneron-phone">
              <span className="text-xs uppercase tracking-[0.12em] text-[#8b9288]">
                Téléphone
              </span>
              <input
                id="vigneron-phone"
                name="contact_phone"
                type="tel"
                autoComplete="tel"
                value={values.contact_phone}
                onChange={(event) =>
                  updateField("contact_phone", event.target.value)
                }
                aria-invalid={Boolean(fieldErrors.contact_phone)}
                className={inputClassName}
              />
              {fieldErrors.contact_phone ? (
                <p className="mt-1 text-sm text-red-800" role="alert">
                  {fieldErrors.contact_phone}
                </p>
              ) : null}
            </label>

            <label className="block" htmlFor="vigneron-adresse">
              <span className="text-xs uppercase tracking-[0.12em] text-[#8b9288]">
                Adresse
              </span>
              <input
                id="vigneron-adresse"
                name="adresse"
                type="text"
                autoComplete="street-address"
                value={values.adresse}
                onChange={(event) => updateField("adresse", event.target.value)}
                aria-invalid={Boolean(fieldErrors.adresse)}
                className={inputClassName}
              />
              {fieldErrors.adresse ? (
                <p className="mt-1 text-sm text-red-800" role="alert">
                  {fieldErrors.adresse}
                </p>
              ) : null}
            </label>

            <label className="block" htmlFor="vigneron-horaires">
              <span className="text-xs uppercase tracking-[0.12em] text-[#8b9288]">
                Horaires
              </span>
              <input
                id="vigneron-horaires"
                name="horaires"
                type="text"
                value={values.horaires}
                onChange={(event) =>
                  updateField("horaires", event.target.value)
                }
                aria-invalid={Boolean(fieldErrors.horaires)}
                className={inputClassName}
              />
              {fieldErrors.horaires ? (
                <p className="mt-1 text-sm text-red-800" role="alert">
                  {fieldErrors.horaires}
                </p>
              ) : null}
            </label>
          </div>

          {formError ? (
            <p className="mt-4 text-sm text-red-800" role="alert" aria-live="polite">
              {formError}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isLoading}
            aria-busy={isLoading}
            className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#3e5c45] text-sm font-medium text-white hover:bg-[#2f4a38] disabled:cursor-wait disabled:opacity-80"
          >
            {isLoading ? (
              <>
                <span
                  className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                  aria-hidden
                />
                Enregistrement…
              </>
            ) : (
              "Enregistrer"
            )}
          </button>
        </form>
      </aside>
    </div>
  );
}
