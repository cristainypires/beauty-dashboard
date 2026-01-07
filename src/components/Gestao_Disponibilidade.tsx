import React from "react";
import { Ban, Calendar, Check, Plane } from "lucide-react";

export function Gestao_Disponibilidade() {
  return (
    <div className="space-y-10">
      {/* Opções de Escopo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button className="p-8 bg-black text-[#b5820e] rounded-[2rem] text-left shadow-xl border-b-4 border-[#b5820e]">
          <Calendar className="mb-4" />
          <h3 className="font-bold uppercase tracking-widest">Configuração Diária</h3>
          <p className="text-[10px] opacity-60">Horários de entrada e saída</p>
        </button>
        <button className="p-8 bg-gray-50 text-gray-400 rounded-[2rem] text-left hover:border-[#b5820e]/30 border border-transparent transition">
          <Check className="mb-4" />
          <h3 className="font-bold uppercase tracking-widest">Escala Mensal</h3>
          <p className="text-[10px] opacity-60">Folgas e turnos</p>
        </button>
        <button className="p-8 bg-gray-50 text-gray-400 rounded-[2rem] text-left hover:border-[#b5820e]/30 border border-transparent transition">
          <Plane className="mb-4" />
          <h3 className="font-bold uppercase tracking-widest">Plano Anual</h3>
          <p className="text-[10px] opacity-60">Marcação de Férias</p>
        </button>
      </div>

      {/* Bloqueio de Horário */}
      <div className="bg-gray-900 rounded-[3rem] p-10 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10"><Ban size={120}/></div>
        <div className="relative z-10">
          <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">Bloqueio de Emergência</h3>
          <p className="text-gray-400 text-sm mb-8">Bloqueie a sua agenda imediatamente para imprevistos ou descanso.</p>
          
          <div className="flex flex-col md:flex-row gap-4">
             <input type="date" className="flex-1 p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-[#b5820e]" />
             <input type="time" className="flex-1 p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-[#b5820e]" />
             <button className="bg-red-500 text-white px-10 py-4 rounded-2xl font-bold uppercase text-xs tracking-widest hover:bg-red-600 transition">
                Bloquear Agora
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}