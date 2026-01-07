import React from "react";
import { Save, User, Scissors, Calendar, Clock } from "lucide-react";

export function Form_Agendamento_Funcionario({ onVoltar }: { onVoltar: () => void }) {
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-[3rem] p-10 shadow-2xl border border-gray-50">
      <h2 className="text-3xl font-serif font-black text-black mb-8">Nova Marcação</h2>
      
      <div className="space-y-6 text-left">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">Nome da Cliente</label>
          <div className="relative">
            <User className="absolute left-4 top-4 text-gray-300" size={18} />
            <input type="text" placeholder="Pesquisar ou digitar nome..." className="w-full p-4 pl-12 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#b5820e] outline-none" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">Serviço Especializado</label>
          <div className="relative">
            <Scissors className="absolute left-4 top-4 text-[#b5820e]" size={18} />
            <select className="w-full p-4 pl-12 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#b5820e] outline-none appearance-none">
              <option>Drenagem Linfática</option>
              <option>Limpeza de Pele</option>
              <option>Massagem Relaxante</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">Data</label>
              <input type="date" className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#b5820e] outline-none" />
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">Horário</label>
              <input type="time" className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#b5820e] outline-none" />
           </div>
        </div>

        <button onClick={onVoltar} className="w-full py-5 bg-black text-[#b5820e] rounded-2xl font-black uppercase tracking-[0.3em] shadow-xl hover:opacity-90 transition mt-6 flex items-center justify-center gap-3">
          <Save size={20} /> Confirmar na Agenda
        </button>
      </div>
    </div>
  );
}