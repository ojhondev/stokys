"use client";

import { useState, type Ref } from "react";

export function CampoSenha({
  label,
  name,
  minLength,
  autoComplete,
  inputRef,
}: {
  label: string;
  name: string;
  minLength?: number;
  autoComplete?: string;
  inputRef?: Ref<HTMLInputElement>;
}) {
  const [visivel, setVisivel] = useState(false);

  return (
    <label className="flex flex-col gap-2">
      <span className="text-caption font-medium uppercase text-graphite">{label}</span>
      <div className="relative">
        <input
          ref={inputRef}
          type={visivel ? "text" : "password"}
          name={name}
          required
          minLength={minLength}
          autoComplete={autoComplete}
          className="w-full rounded-lg border border-ash bg-pure-white px-4 py-3 pr-16 text-body text-off-black-ink"
        />
        <button
          type="button"
          onClick={() => setVisivel((v) => !v)}
          className="absolute inset-y-0 right-0 flex items-center px-4 text-caption font-medium text-graphite"
        >
          {visivel ? "Ocultar" : "Mostrar"}
        </button>
      </div>
    </label>
  );
}
