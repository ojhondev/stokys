"use client";

import { useState } from "react";

export function AnnouncementBar() {
  const [visivel, setVisivel] = useState(true);
  if (!visivel) return null;

  return (
    <div className="relative bg-electric-lime px-6 py-3 text-center sm:px-10 lg:px-16">
      <p className="text-body-sm font-medium text-off-black-ink">
        Planos Zen, Pro e Premium já disponíveis — monte sua loja agora.
      </p>
      <button
        type="button"
        onClick={() => setVisivel(false)}
        aria-label="Fechar aviso"
        className="absolute right-4 top-1/2 -translate-y-1/2 text-body-sm text-off-black-ink/60"
      >
        ✕
      </button>
    </div>
  );
}
