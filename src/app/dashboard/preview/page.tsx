import { PlanoMockup } from "@/components/marketing/plano-mockup";

export default function PreviewPage() {
  return (
    <div>
      <span className="text-caption font-medium uppercase text-graphite">Preview</span>
      <h1 className="mt-1 text-heading font-heading font-bold text-off-black-ink">
        Loja em construção
      </h1>
      <p className="mt-2 max-w-[480px] text-body-sm text-graphite">
        Snapshots aparecem aqui conforme a produção sobe novas versões da loja.
      </p>

      <div className="mt-8 h-[420px] rounded-3xl bg-pure-white p-6">
        <PlanoMockup plano="pro" />
      </div>
    </div>
  );
}
