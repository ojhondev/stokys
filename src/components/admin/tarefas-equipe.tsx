"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { criarTarefa } from "@/lib/actions/tarefas";
import { TarefaToggle } from "@/components/dashboard/tarefa-toggle";

type Tarefa = {
  id: string;
  titulo: string;
  responsavel: "cliente" | "stokys";
  concluida: boolean;
};

export function TarefasEquipe({ projetoId, tarefas }: { projetoId: string; tarefas: Tarefa[] }) {
  const router = useRouter();
  const [titulo, setTitulo] = useState("");
  const [responsavel, setResponsavel] = useState<"cliente" | "stokys">("stokys");
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, iniciarTransicao] = useTransition();

  function criar(e: FormEvent) {
    e.preventDefault();
    setErro(null);
    iniciarTransicao(async () => {
      const resultado = await criarTarefa(projetoId, titulo, responsavel);
      if (resultado.erro) {
        setErro(resultado.erro);
        return;
      }
      setTitulo("");
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-4 rounded-3xl bg-pure-white p-6">
      <p className="text-caption font-medium uppercase text-graphite">Tarefas</p>

      <div className="flex flex-col gap-2">
        {tarefas.length === 0 && <p className="text-body-sm text-graphite">Nenhuma tarefa ainda.</p>}
        {tarefas.map((t) => (
          <div key={t.id} className="flex items-center gap-3 border-b border-ash py-2 last:border-b-0">
            <TarefaToggle tarefaId={t.id} concluida={t.concluida} interativa />
            <span className={`text-body-sm ${t.concluida ? "text-graphite line-through" : "text-off-black-ink"}`}>
              {t.titulo}
            </span>
            <span className="ml-auto text-caption uppercase text-graphite">
              {t.responsavel === "cliente" ? "Cliente" : "Stokys"}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={criar} className="flex flex-col gap-3 border-t border-ash pt-4">
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Título da tarefa"
          className="rounded-lg border border-ash bg-off-white-canvas px-4 py-3 text-body text-off-black-ink"
        />
        <select
          value={responsavel}
          onChange={(e) => setResponsavel(e.target.value as "cliente" | "stokys")}
          className="rounded-lg border border-ash bg-off-white-canvas px-4 py-3 text-body text-off-black-ink"
        >
          <option value="stokys">Pendência da Stokys</option>
          <option value="cliente">Pendência do cliente</option>
        </select>
        {erro && <p className="text-body-sm font-medium text-off-black-ink">{erro}</p>}
        <button
          type="submit"
          disabled={pendente}
          className="w-fit rounded-3xl bg-electric-lime pt-4 pb-4 pl-4 pr-3 text-body font-bold text-off-black-ink disabled:opacity-60"
        >
          {pendente ? "Criando…" : "Criar tarefa"}
        </button>
      </form>
    </div>
  );
}
