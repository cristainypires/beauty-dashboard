// src/components/Auditoria_Logs.tsx
import React, { useState } from "react";
import { ShieldCheck, Search, Filter, Calendar, ChevronLeft, Download } from "lucide-react";

interface LogEntry {
  id: number;
  data: string;
  hora: string;
  ator: "ADMIN" | "SISTEMA" | "CLIENTE" | "FUNCIONÁRIO";
  descricao: string;
  detalhes: string;
}

export function Auditoria_Logs({ onVoltar }: { onVoltar: () => void }) {
  // Simulação de dados (Mock) conforme a tabela de Logs/Notificações
  const [logs] = useState<LogEntry[]>([
    { id: 1, data: "2023-10-25", hora: "14:30", ator: "ADMIN", descricao: "Criou novo serviço", detalhes: "Serviço: Limpeza Facial VIP" },
    { id: 2, data: "2023-10-25", hora: "13:12", ator: "CLIENTE", descricao: "Cancelou agendamento", detalhes: "Agendamento #450 (Regra 72h respeitada)" },
    { id: 3, data: "2023-10-25", hora: "10:05", ator: "SISTEMA", descricao: "Pagamento confirmado", detalhes: "SISP: Referência 99283-A" },
    { id: 4, data: "2023-10-25", hora: "08:00", ator: "SISTEMA", descricao: "Disparo de Lembretes", detalhes: "24 notificações enviadas via WhatsApp" },
    { id: 5, data: "2023-10-24", hora: "18:45", ator: "FUNCIONÁRIO", descricao: "Concluiu serviço", detalhes: "Profissional: Ana • Cliente: Marta" },
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
            <h2 className="text-2xl font-serif font-black text-white uppercase tracking-tighter">Histórico de Auditoria</h2>
            <p className="text-gray-400 text-[10px] uppercase tracking-[0.3em]">Rastreabilidade Total Maddie Beauty</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="bg-[#b5820e] text-black px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 hover:opacity-90 transition">
            <Download size={16} /> Exportar CSV
          </button>
          <ShieldCheck className="text-[#b5820e]" size={32} />
        </div>
      </div>

      {/* BARRA DE FILTROS */}
      <div className="p-6 bg-gray-50 border-b border-gray-100 flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-4 top-3 text-gray-400" size={18} />
          <input type="text" placeholder="Pesquisar evento..." className="w-full p-3 pl-12 bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#b5820e] outline-none text-sm" />
        </div>
        <div className="flex gap-2">
            <select className="p-3 bg-white rounded-xl border border-gray-200 text-sm outline-none">
                <option>Todos os Atores</option>
                <option>Admin</option>
                <option>Sistema</option>
            </select>
            <button className="p-3 bg-white rounded-xl border border-gray-200 text-gray-500 hover:text-[#b5820e] transition">
                <Filter size={18} />
            </button>
        </div>
      </div>

      {/* LISTA DE LOGS ESTILO TERMINAL LUXO */}
      <div className="p-8">
        <div className="space-y-4">
          {logs.map((log) => (
            <div key={log.id} className="group flex items-start gap-6 p-4 rounded-2xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all">
              <div className="flex flex-col items-center min-w-[60px]">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{log.data}</span>
                <span className="text-sm font-mono font-bold text-[#b5820e]">{log.hora}</span>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className={`text-[9px] px-2 py-0.5 rounded font-black tracking-widest ${
                    log.ator === 'SISTEMA' ? 'bg-blue-100 text-blue-600' : 
                    log.ator === 'ADMIN' ? 'bg-black text-[#b5820e]' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {log.ator}
                  </span>
                  <h4 className="font-bold text-black text-sm uppercase tracking-tight">{log.descricao}</h4>
                </div>
                <p className="text-gray-500 text-xs font-mono">{log.detalhes}</p>
              </div>

              <div className="opacity-0 group-hover:opacity-100 transition">
                 <button className="text-[10px] font-bold text-gray-400 hover:text-black uppercase">Ver JSON</button>
              </div>
            </div>
          ))}
        </div>

        {/* PAGINAÇÃO SIMPLES */}
        <div className="mt-12 flex justify-center gap-2">
            <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#b5820e] hover:text-[#b5820e] transition">1</button>
            <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#b5820e] hover:text-[#b5820e] transition">2</button>
            <span className="text-gray-300 flex items-center">...</span>
            <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#b5820e] hover:text-[#b5820e] transition">10</button>
        </div>
      </div>
    </div>
  );
}