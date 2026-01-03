// src/components/Agendamentos_Lista.tsx
import React, { useState } from "react";
import { Search, Filter, Calendar, ChevronLeft, MoreHorizontal, CheckCircle, XCircle, Clock } from "lucide-react";

export function Agendamentos_Lista({ onVoltar }: { onVoltar: () => void }) {
  // Simulação de base de dados completa (Mock)
  const [agendamentos] = useState([
    { id: 452, cliente: "Rosa Mendes", servico: "Drenagem", prof: "Ana", data: "2023-10-27", hora: "08:00", status: "Confirmado" },
    { id: 451, cliente: "Bia Costa", servico: "Limpeza de Pele", prof: "Sofia", data: "2023-10-27", hora: "09:30", status: "Pendente" },
    { id: 450, cliente: "Sílvia Lopes", servico: "Manicure", prof: "Ana", data: "2023-10-26", hora: "11:00", status: "Cancelado" },
    { id: 449, cliente: "Marta Tavares", servico: "Massagem", prof: "Sofia", data: "2023-10-26", hora: "14:00", status: "Remarcado" },
  ]);

  return (
    <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-50 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER LUXO */}
      <div className="bg-black p-8 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={onVoltar} className="p-2 hover:bg-white/10 rounded-full transition text-[#b5820e]">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h2 className="text-2xl font-serif font-black text-white uppercase tracking-tighter">Controlo Global de Agenda</h2>
            <p className="text-gray-400 text-[10px] uppercase tracking-[0.3em]">Gestão completa de marcações Maddie</p>
          </div>
        </div>
        <Calendar className="text-[#b5820e]" size={32} />
      </div>

      {/* BARRA DE PESQUISA E FILTROS */}
      <div className="p-6 bg-gray-50 border-b border-gray-100 flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[300px] relative">
          <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Pesquisar por cliente ou serviço..." 
            className="w-full p-3.5 pl-12 bg-white rounded-2xl border border-gray-200 focus:ring-2 focus:ring-[#b5820e] outline-none text-sm shadow-sm"
          />
        </div>
        <div className="flex gap-2">
            <select className="p-3.5 bg-white rounded-2xl border border-gray-200 text-sm font-bold outline-none shadow-sm cursor-pointer">
                <option>Todos os Status</option>
                <option>Confirmados</option>
                <option>Pendentes</option>
                <option>Cancelados</option>
            </select>
            <button className="p-3.5 bg-white rounded-2xl border border-gray-200 text-gray-500 hover:text-[#b5820e] transition shadow-sm">
                <Filter size={20} />
            </button>
        </div>
      </div>

      {/* TABELA DE AGENDAMENTOS */}
      <div className="p-4 overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-3">
          <thead>
            <tr className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
              <th className="px-6 py-2">ID</th>
              <th className="px-6 py-2">Cliente</th>
              <th className="px-6 py-2">Serviço / Profissional</th>
              <th className="px-6 py-2">Data & Hora</th>
              <th className="px-6 py-2">Estado</th>
            </tr>
          </thead>
          <tbody>
            {agendamentos.map((ag) => (
              <tr key={ag.id} className="group hover:scale-[1.01] transition-transform duration-200">
                <td className="px-6 py-5 bg-gray-50 rounded-l-2xl font-mono text-xs text-gray-400 border-y border-l border-transparent group-hover:border-[#b5820e]/20">#{ag.id}</td>
                <td className="px-6 py-5 bg-gray-50 border-y border-transparent group-hover:border-[#b5820e]/20">
                  <p className="font-bold text-black">{ag.cliente}</p>
                </td>
                <td className="px-6 py-5 bg-gray-50 border-y border-transparent group-hover:border-[#b5820e]/20">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700">{ag.servico}</span>
                    <span className="text-[10px] text-[#b5820e] font-bold uppercase">Prof. {ag.prof}</span>
                  </div>
                </td>
                <td className="px-6 py-5 bg-gray-50 border-y border-transparent group-hover:border-[#b5820e]/20">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-800">{ag.data}</span>
                    <span className="text-xs text-gray-400">{ag.hora}h</span>
                  </div>
                </td>
                <td className="px-6 py-5 bg-gray-50 border-y border-transparent group-hover:border-[#b5820e]/20">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                    ag.status === 'Confirmado' ? 'bg-green-100 text-green-600' : 
                    ag.status === 'Pendente' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {ag.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}