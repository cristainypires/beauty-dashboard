import { ChevronLeft, Calendar, Scissors } from "lucide-react";

export function Perfil_Cliente({ cliente, onVoltar }: any) {
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
      
      {/* BOTÃO VOLTAR */}
      <button
        onClick={onVoltar}
        className="text-[#b5820e] mb-6 flex items-center gap-2 font-semibold hover:text-amber-600 transition-colors"
      >
        <ChevronLeft /> Voltar
      </button>

      {/* CABEÇALHO DO PERFIL */}
      <div className="mb-6">
        <h2 className="text-3xl font-extrabold text-gray-900">
          {cliente.nome} {cliente.apelido}
        </h2>
        <p className="text-gray-500 text-sm mt-1 italic">
          Cliente desde {cliente.desde}
        </p>
      </div>

      {/* OBSERVAÇÕES */}
      <div className="mb-8">
        <h3 className="font-bold text-sm uppercase tracking-wider text-gray-400 mb-2">
          Observações
        </h3>
        <p className="mt-1 text-gray-700 bg-gray-50 p-4 rounded-2xl shadow-sm border border-gray-100">
          Cliente prefere atendimento à tarde. Sensível a certos produtos.
        </p>
      </div>

      {/* HISTÓRICO DE SERVIÇOS */}
      <div>
        <h3 className="font-bold text-sm uppercase tracking-wider text-gray-400 mb-4">
          Histórico de Serviços
        </h3>

        <div className="space-y-3">
          {/* Exemplo de item */}
          <div className="p-4 bg-gray-50 rounded-2xl flex justify-between items-center shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer">
            <div className="flex items-center gap-3">
              <Scissors size={16} className="text-[#b5820e]" />
              <span className="font-medium text-gray-900">Manicure</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Calendar size={14} /> 12/04/2024
            </div>
          </div>

          {/* Pode mapear outros serviços */}
          {cliente.historico?.map((item: any, index: number) => (
            <div
              key={index}
              className="p-4 bg-gray-50 rounded-2xl flex justify-between items-center shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Scissors size={16} className="text-[#b5820e]" />
                <span className="font-medium text-gray-900">{item.servico}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Calendar size={14} /> {item.data}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
