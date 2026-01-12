import React from "react";
import { Save, User, Scissors } from "lucide-react";

export function Form_Agendamento_Funcionario({ onVoltar }: { onVoltar: () => void }) {
  return (
<div className="max-w-4xl w-full mx-auto bg-white rounded-[3rem] p-6 sm:p-10  border border-gray-400">   <h2 className="text-2xl sm:text-3xl font-serif text-center font-black text-black mb-6 sm:mb-8">
        Nova Marcação
      </h2>
      
      <div className="space-y-6 text-left">
        {/* Nome da Cliente */}
        <div className="space-y-2">
          <label className="text-[10px] sm:text-[12px] font-black uppercase text-gray-400 tracking-widest ml-2">
            Nome da Cliente
          </label>
          <div className="relative">
            <User className="absolute left-3 sm:left-4 top-3 sm:top-4 text-gray-300" size={18} />
            <input
              type="text"
              placeholder="Pesquisar ou digitar nome..."
              className="w-full p-3 sm:p-4 pl-10 sm:pl-12 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#b5820e] outline-none"
            />
          </div>
        </div>

        {/* Telefone */}
        <div className="space-y-2">
          <label className="text-[10px] sm:text-[12px] font-black uppercase text-gray-400 tracking-widest ml-2">
            Telefone
          </label>
          <div className="relative">
            <User className="absolute left-3 sm:left-4 top-3 sm:top-4 text-gray-300" size={18} />
            <input
              type="text"
              placeholder="Digite o telefone..."
              className="w-full p-3 sm:p-4 pl-10 sm:pl-12 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#b5820e] outline-none"
            />
          </div>
        </div>

        {/* Serviço */}
        <div className="space-y-2">
          <label className="text-[10px] sm:text-[12px] font-black uppercase text-gray-400 tracking-widest ml-2">
            Serviço Especializado
          </label>
          <div className="relative">
            <Scissors className="absolute left-3 sm:left-4 top-3 sm:top-4 text-[#b5820e]" size={18} />
            <select className="w-full p-3 sm:p-4 pl-10 sm:pl-12 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#b5820e] outline-none appearance-none">
              <option>Drenagem Linfática</option>
              <option>Limpeza de Pele</option>
              <option>Massagem Relaxante</option>
            </select>
          </div>
        </div>

        {/* Data e Horário */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] sm:text-[12px] font-black uppercase text-gray-400 tracking-widest ml-2">
              Data
            </label>
            <input
              type="date"
              className="w-full p-3 sm:p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#b5820e] outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] sm:text-[12px] font-black uppercase text-gray-400 tracking-widest ml-2">
              Horário
            </label>
            <input
              type="time"
              className="w-full p-3 sm:p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#b5820e] outline-none"
            />
          </div>
        </div>

        {/* Botão */}
       <button
  onClick={onVoltar}
  className="w-full py-2 text-xs sm:py-4 bg-black text-[#b5820e] rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl hover:opacity-90 transition flex items-center justify-center gap-2 sm:gap-3"
>
  <Save size={14} className="sm:!w-5 sm:!h-5" /> Confirmar na Agenda
</button>

      </div>
    </div>
  );
}
