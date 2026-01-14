// src/components/Agendamentos_Lista.tsx
import React, { useState } from "react";
import { Search, Calendar, ChevronLeft } from "lucide-react";
import { Agenda_Item } from "./Agenda_Item";
import { Agendamento } from "../pages/DashboardAdmin"; // importa a interface

  interface AgendamentosListaProps {
  agendamentos: Agendamento[];
  onVoltar: () => void;
  onCancelar: (id: number) => Promise<void>;
  onReagendar: (id: number) => Promise<void>;
}
export function Agendamentos_Lista({
  agendamentos,
  onVoltar,
  onCancelar,
  onReagendar,
}: AgendamentosListaProps) {
  const [dataFiltro, setDataFiltro] = useState("");
  const [pesquisa, setPesquisa] = useState("");

  const agendamentosFiltrados = agendamentos.filter((ag) => {
    const matchData = dataFiltro ? ag.data === dataFiltro : true;
    const matchTexto =
      ag.cliente.toLowerCase().includes(pesquisa.toLowerCase()) ||
      ag.servico.toLowerCase().includes(pesquisa.toLowerCase());

    return matchData && matchTexto;
  });

  return (
    <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-50 overflow-hidden">

      {/* HEADER */}
      <div className="bg-black p-6 sm:p-8 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={onVoltar}
            className="p-2 hover:bg-white/10 rounded-full transition text-[#b5820e]"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase">
              Agenda Geral
            </h2>
            <p className="text-gray-400 text-[10px] uppercase tracking-[0.3em]">
              Visual em cartões
            </p>
          </div>
        </div>
        <Calendar className="text-[#b5820e]" size={30} />
      </div>

      {/* FILTROS */}
      <div className="p-4 sm:p-6 bg-gray-50 border-b border-gray-100 flex flex-wrap gap-4">

        {/* PESQUISA */}
        <div className="flex-1 min-w-[220px] relative">
          <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
          <input
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
            type="text"
            placeholder="Pesquisar cliente ou serviço..."
            className="w-full p-3.5 pl-12 bg-white rounded-2xl border border-gray-200 focus:ring-2 focus:ring-[#b5820e] outline-none text-sm shadow-sm"
          />
        </div>

        {/* DATA */}
        <input
          type="date"
          value={dataFiltro}
          onChange={(e) => setDataFiltro(e.target.value)}
          className="p-3.5 bg-white rounded-2xl border border-gray-200 text-sm font-bold shadow-sm cursor-pointer"
        />
      </div>

      {/* LISTA DE CARDS */}
      <div className="space-y-2">
        {agendamentos.map((item) => (
          <Agenda_Item
            key={item.id}
            id={item.id}
            cliente={item.cliente}
            telefone={item.telefone || ""}
            servico={`${item.servico} • ${item.profissional}`}
            data={item.data}
            hora={item.hora}
            status={item.status}
            clickable={true}
            onItemClick={() => {}}
            onClienteClick={() => {}}
            onCancelar={() => onCancelar(item.id)}
            onRemarcar={() => onReagendar(item.id)}
          />
        ))}
      

        {agendamentosFiltrados.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-8">
            Nenhum agendamento encontrado.
          </p>
        )}
      </div>
    </div>
  );
}
