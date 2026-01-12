import { ChevronLeft, Calendar, Scissors } from "lucide-react";

export function Perfil_Cliente({ cliente, onVoltar }: any) {
  return (
    <div className=" rounded-3xl  p-8 ">
      <button onClick={onVoltar} className="text-[#b5820e] mb-6 flex items-center gap-2">
        <ChevronLeft /> Voltar
      </button>

      <h2 className="text-2xl font-black">{cliente.nome} {cliente.apelido}</h2>
      <p className="text-gray-400 text-sm mt-1">Cliente desde {cliente.desde}</p>

      {/* DESCRIÇÃO */}
      <div className="mt-6">
        <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500">Observações</h3>
        <p className="mt-2 text-gray-700 bg-gray-50 p-4 rounded-xl">
          Cliente prefere atendimento à tarde. Sensível a certos produtos.
        </p>
      </div>

      {/* HISTÓRICO */}
      <div className="mt-8">
        <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500 mb-4">
          Histórico de Serviços
        </h3>

        <div className="space-y-3">
          <div className="p-4 bg-gray-50 rounded-xl flex justify-between">
            <div className="flex items-center gap-2">
              <Scissors size={14} className="text-[#b5820e]" />
              <span>Manicure</span>
            </div>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Calendar size={12} /> 12/04/2024
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
