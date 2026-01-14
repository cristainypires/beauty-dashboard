import React from "react";
import { RefreshCw, XCircle, User } from "lucide-react";

export interface AgendaItemProps {
  id: number;
  cliente: string;
  telefone: string;
  servico: string;
  data: string;
  hora: string;
  status: "Confirmado" | "Pendente" | "Cancelado" | "Remarcado" | "Concluído";
  obs?: string;
  clickable?: boolean;
  onClienteClick: () => void;
  onItemClick: () => void;
  onRemarcar: () => void;
  onCancelar: () => void;
}



function statusClass(status: AgendaItemProps["status"]) {
  switch (status) {
    case "Confirmado":
      return "bg-green-100 text-green-700";
    case "Pendente":
      return "bg-yellow-100 text-yellow-700";
    case "Cancelado":
      return "bg-red-100 text-red-700";
    case "Remarcado":
      return "bg-blue-100 text-blue-700";
    case "Concluído":
      return "bg-purple-100 text-purple-700";
    default:
      return "bg-gray-100 text-gray-700";

  }
}

export function Agenda_Item({
  cliente,
  servico,
  data,
  hora,
  telefone,
  status,
  obs,
  clickable = true,
  onItemClick,
  onClienteClick,
  onRemarcar,
  onCancelar,
}: AgendaItemProps) {
  const podeAlterar = status === "Confirmado";

  return (
    <div className="group flex flex-col md:flex-row items-start md:items-center justify-between p-2 sm:p-6 bg-gradient-to-br from-[#eed953]/20 via-white to-[#eed953]/20 rounded-2xl md:rounded-[2rem] border border-transparent hover:border-[#b5820e]/20 transition-all gap-4 shadow-sm w-full">
      {/* BLOCO PRINCIPAL */}
      <div
        onClick={onItemClick}
        className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 w-full"
      >
        {/* DATA / HORA */}
        <div className="flex flex-col-2 gap-5 md:flex-col items-center justify-center text-[#b5820e] flex-shrink-0">
          <span className="text-[12px] sm:text-[12px] font-bold uppercase opacity-70">
            Hora
          </span>
          <span className="text-xl sm:text-2xl font-extrabold">{hora}</span>
          <span className="text-[10px] sm:text-[12px] text-gray-800 mt-1">
            {new Date(data).toLocaleDateString("pt-PT", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>

        {/* CLIENTE */}
        <div
          className={`flex-1 p-3 sm:p-4 rounded-xl transition-all duration-300
            ${clickable ? "cursor-pointer " : "cursor-default"}
          `}
          onClick={clickable ? onClienteClick : undefined}
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <User size={20} className="text-[#b5820e]" />
            <h3
              onClick={(e) => {
                e.stopPropagation(); // 🔥 ISTO IMPEDE O CLIQUE DO CARD
                onClienteClick();
              }}
              className="text-sm sm:text-lg font-bold text-black cursor-pointer hover:underline"
            >
              {cliente}
            </h3>
          </div>

          <p className="text-[10px] sm:text-xs text-gray-500 font-medium mt-1">
            📞 {telefone}
          </p>
          <p className="text-[10px] sm:text-xs text-gray-500 font-semibold uppercase tracking-wide mt-1">
            {servico}
          </p>
          {obs && (
            <p className="text-[10px] text-blue-500 mt-2 italic">{obs}</p>
          )}
        </div>

        {/* STATUS */}
        <span
          className={`text-[10px] uppercase font-bold px-2 sm:px-3 py-1 rounded-full ${statusClass(
            status
          )}`}
        >
          {status}
        </span>
      </div>

      {/* BOTÕES */}
      <div className="flex gap-2 w-full md:w-auto justify-end mt-2 md:mt-0">
        <button
          disabled={!podeAlterar}
          onClick={podeAlterar ? onRemarcar : undefined}
          className={`flex-1 md:flex-none px-3 sm:px-4 py-2 rounded-lg border font-bold text-[10px] uppercase flex items-center justify-center gap-1 sm:gap-2 transition-all
            ${
              podeAlterar
                ? "bg-white text-black hover:text-[#b5820e]"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }
          `}
        >
          <RefreshCw size={12} /> Remarcar
        </button>

        <button
          disabled={!podeAlterar}
          onClick={podeAlterar ? onCancelar : undefined}
          className={`p-2 sm:p-3 rounded-lg border transition-all
            ${
              podeAlterar
                ? "bg-white text-red-400 hover:text-red-600"
                : "bg-gray-100 text-gray-300 cursor-not-allowed"
            }
          `}
        >
          <XCircle size={18} />
        </button>
      </div>
    </div>
  );
}
