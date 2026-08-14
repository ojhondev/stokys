export default function PerfilPage() {
  return (
    <div>
      <span className="text-caption font-medium uppercase text-graphite">Perfil</span>
      <h1 className="mt-1 text-heading font-heading font-bold text-off-black-ink">Sua conta</h1>

      <div className="mt-8 flex flex-col gap-4 rounded-3xl bg-pure-white p-6">
        <label className="flex flex-col gap-2">
          <span className="text-body-sm font-medium text-off-black-ink">Nome</span>
          <input
            type="text"
            defaultValue=""
            className="rounded-lg border border-ash bg-off-white-canvas px-4 py-3 text-body text-off-black-ink"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-body-sm font-medium text-off-black-ink">E-mail</span>
          <input
            type="email"
            defaultValue=""
            className="rounded-lg border border-ash bg-off-white-canvas px-4 py-3 text-body text-off-black-ink"
          />
        </label>
      </div>
    </div>
  );
}
