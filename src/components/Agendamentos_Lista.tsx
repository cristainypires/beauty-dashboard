// src/components/Agendamentos_Lista.tsx
import React, { useState } from "react";
import { Search, Calendar, ChevronLeft } from "lucide-react";
import { Agenda_Item } from "./Agenda_Item";

export function Agendamentos_Lista({ onVoltar }: { onVoltar: () => void }) {
  const [dataFiltro, setDataFiltro] = useState("");
  const [pesquisa, setPesquisa] = useState("");

  const agendamentos = [
    {
      id: 452,
      cliente: "Rosa Mendes",
      telefone: "987654321",
      servico: "Drenagem",
      data: "2023-10-27",
      hora: "08:00",
      status: "Confirmado",
    },
    {
      id: 451,
      cliente: "Bia Costa",
      telefone: "912345678",
      servico: "Limpeza de Pele",
      data: "2023-10-27",
      hora: "09:30",
      status: "Pendente",
    },
    {
      id: 450,
      cliente: "Sílvia Lopes",
      telefone: "934567890",
      servico: "Manicure",
      data: "2023-10-26",
      hora: "11:00",
      status: "Cancelado",
    },
    {
      id: 449,
      cliente: "Marta Tavares",
      telefone: "956789012",
      servico: "Massagem",
      data: "2023-10-26",
      hora: "14:00",
      status: "Remarcado",
    },
  ] as const;

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
      <div className="p-3 sm:p-6 flex flex-col gap-4">
        {agendamentosFiltrados.map((ag) => (
          <Agenda_Item
            key={ag.id}
            id={ag.id}
            cliente={ag.cliente}
            telefone={ag.telefone}
            servico={ag.servico}
            data={ag.data}
            hora={ag.hora}
            status={ag.status}
            clickable
            onItemClick={() => console.log("Abrir", ag.id)}
            onClienteClick={() => console.log("Cliente", ag.cliente)}
            onRemarcar={() => console.log("Remarcar", ag.id)}
            onCancelar={() => console.log("Cancelar", ag.id)}
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
