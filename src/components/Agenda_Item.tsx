import React from "react";
import { RefreshCw, XCircle, User, Clock } from "lucide-react";

interface Props {
  cliente: string;
  servico: string;
  hora: string;
  status: string;
  obs?: string;
  onRemarcar: () => void;
  onCancelar: () => void;
}

export function Agenda_Item({ cliente, servico, hora, status, obs, onRemarcar, onCancelar }: Props) {
  return (
    <div className="group flex flex-col md:flex-row items-center justify-between p-6 bg-gray-50 rounded-[2rem] border border-transparent hover:border-[#b5820e]/20 transition-all gap-4">
      <div className="flex items-center gap-6 w-full">
        {/* Bloco de Hora Estilo Luxo */}
        <div className="w-16 h-16 bg-black rounded-2xl flex flex-col items-center justify-center text-[#b5820e] shadow-lg flex-shrink-0">
          <span className="text-[10px] font-black uppercase opacity-60">Hora</span>
          <span className="text-lg font-black">{hora}</span>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <User size={14} className="text-[#b5820e]" />
            <h3 className="text-lg font-bold text-black">{cliente}</h3>
          </div>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{servico}</p>
          {obs && <p className="text-[10px] text-blue-500 mt-1 italic">{obs}</p>}
        </div>

        {/* Status vindo do Sistema */}
        <div className="hidden md:block px-4 py-1.5 rounded-full bg-white border border-gray-100 text-[10px] font-black uppercase text-gray-400">
          {status}
        </div>
      </div>

      <div className="flex gap-2 w-full md:w-auto justify-end">
        <button 
          onClick={onRemarcar}
          className="flex-1 md:flex-none px-4 py-3 bg-white text-black rounded-xl border border-gray-100 hover:bg-black hover:text-[#b5820e] transition-all flex items-center justify-center gap-2 font-bold text-[10px] uppercase"
        >
          <RefreshCw size={14} /> Remarcar
        </button>
        <button 
          onClick={onCancelar}
          className="p-3 text-red-400 hover:text-red-600 transition-colors bg-white rounded-xl border border-gray-100"
        >
          <XCircle size={20} />
        </button>
      </div>
    </div>
  );
}