import type { PlanoConteudo } from "@/lib/planos-conteudo";

// Preview abstrata da loja por plano — ilustrativa (não é screenshot real do
// produto), preenchendo o mesmo espaço que a perk.com usa pra print do app real.

const temaPorPlano: Record<PlanoConteudo["slug"], string> = {
  zen: "Tema Spark",
  pro: "Tema Quart",
  customizado: "Tema sob medida",
};

export function PlanoMockup({ plano }: { plano: PlanoConteudo["slug"] }) {
  return (
    <div className="h-full w-full rounded-3xl bg-pure-white p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-ash" />
          <span className="h-2.5 w-2.5 rounded-full bg-ash" />
          <span className="h-2.5 w-2.5 rounded-full bg-ash" />
        </div>
        <span className="text-caption font-medium uppercase text-graphite">
          {temaPorPlano[plano]}
        </span>
      </div>

      <div className="mt-4 rounded-2xl bg-electric-lime p-6">
        <div className="h-2 w-16 rounded-full bg-off-black-ink/20" />
        <div className="mt-3 h-3 w-32 rounded-full bg-off-black-ink/30" />
      </div>

      <div className="mt-3 grid grid-cols-3 gap-3">
        <div className="aspect-square rounded-2xl bg-off-white-canvas" />
        <div className="aspect-square rounded-2xl bg-off-white-canvas" />
        <div className="aspect-square rounded-2xl bg-off-white-canvas" />
      </div>

      <div className="mt-3 flex flex-col gap-2">
        <div className="h-2 w-full rounded-full bg-off-white-canvas" />
        <div className="h-2 w-2/3 rounded-full bg-off-white-canvas" />
      </div>
    </div>
  );
}
