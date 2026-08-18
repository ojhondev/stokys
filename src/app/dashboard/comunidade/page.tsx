import { getSession } from "@/lib/auth";
import { getProjetoDoCliente } from "@/lib/queries/projetos";
import { linkWhatsapp } from "@/lib/whatsapp";

export default async function ComunidadePage() {
  const sessao = await getSession();
  if (!sessao) return null;

  const registro = await getProjetoDoCliente(sessao.userId);
  const ehElite = registro?.plano.nome === "customizado";
  const conviteDiscord = process.env.DISCORD_INVITE_URL;

  return (
    <div>
      <span className="text-caption font-medium uppercase text-graphite">
        Comunidade Sem Estoque
      </span>
      <h1 className="mt-1 text-heading font-heading font-bold text-off-black-ink">
        {ehElite ? "Você já faz parte" : "Benefício do plano Elite"}
      </h1>

      {ehElite ? (
        <div className="mt-6 rounded-3xl bg-pure-white p-6">
          <p className="text-body-sm text-off-black-ink">
            A Comunidade Sem Estoque é o grupo no Discord com quem já está construindo loja com a
            Stokys — troca de ideias, novidades e conteúdo exclusivo.
          </p>
          {conviteDiscord ? (
            <a
              href={conviteDiscord}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block rounded-full bg-electric-lime px-6 py-3 text-body-sm font-bold text-off-black-ink"
            >
              Entrar no Discord
            </a>
          ) : (
            <p className="mt-6 text-body-sm font-medium text-off-black-ink">
              O convite chega em breve — fale com a produção pelo chat se quiser entrar antes.
            </p>
          )}
        </div>
      ) : (
        <div className="mt-6 rounded-3xl bg-pure-white p-6">
          <p className="text-body-sm text-off-black-ink">
            A Comunidade Sem Estoque no Discord é exclusiva de quem está no plano Elite.
          </p>
          <a
            href={linkWhatsapp("Quero saber mais sobre o plano Elite e a Comunidade Sem Estoque.")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block rounded-full bg-electric-lime px-6 py-3 text-body-sm font-bold text-off-black-ink"
          >
            Falar sobre o Elite
          </a>
        </div>
      )}
    </div>
  );
}
