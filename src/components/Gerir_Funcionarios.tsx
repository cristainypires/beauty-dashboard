import {
  UserPlus,
  Settings,
  Trash2,
  Mail,
  Phone,
  Scissors,
  Calendar,
  ChevronLeft,
} from "lucide-react";

// 1. Interface
export interface Funcionario {
  id: number;
  nome: string;
  especialidade: string;
  email: string;
  telefone: string;
  data_nascimento: string;
  status: "Ativo" | "Inativo";
}

interface GerirFuncionariosProps {
  funcionarios: Funcionario[];
  onVoltar: () => void;
  onNovoFuncionario: () => void;
  onEditarFuncionario: (func: Funcionario) => void;
  onRemover: (id: number) => void;
}

export function Gerir_Funcionarios({
  funcionarios,
  onVoltar,
  onNovoFuncionario,
  onEditarFuncionario,
  onRemover,
}: GerirFuncionariosProps) {
  
  // Função para formatar a data de nascimento de forma limpa
  const formatarData = (dataStr: string) => {
    if (!dataStr) return "Não informada";
    try {
      const data = new Date(dataStr);
      if (isNaN(data.getTime())) return "Não informada";
      return data.toLocaleDateString("pt-PT", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return "Não informada";
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 sm:p-8">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-10">
        <button
          onClick={onVoltar}
          className="flex items-center gap-2 text-[#b5820e] font-bold mb-6 hover:opacity-70 transition-all group"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Voltar ao Painel
        </button>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl sm:text-5xl font-serif font-black uppercase tracking-tighter text-gray-900 leading-none">
              Gestão de Equipa
            </h2>
            <p className="text-gray-400 text-sm sm:text-base mt-3 font-medium uppercase tracking-widest">
              Profissionais Maddie Tavares Beauty Boutique
            </p>
          </div>

          <button
            onClick={onNovoFuncionario}
            className="bg-black text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 hover:bg-gray-900 transition-all shadow-xl active:scale-95"
          >
            <UserPlus size={18} />
            Novo Profissional
          </button>
        </div>
      </div>

      {/* LISTA DE CARDS */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {funcionarios.length === 0 ? (
          <div className="col-span-full text-center py-24 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-bold text-lg uppercase tracking-tighter">
              Nenhum profissional registado.
            </p>
          </div>
        ) : (
          funcionarios.map((func) => (
            <div
              key={func.id}
              className="bg-white rounded-[2.5rem] p-8 border  shadow-sm hover:shadow-2xl hover:border-[#b5820e]/30 transition-all duration-500 group"
            >
              {/* TOP: AVATAR & STATUS */}
              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 rounded-2xl bg-black text-[#b5820e] flex items-center justify-center font-black text-2xl shadow-lg group-hover:scale-110 transition-transform duration-500">
                  {func.nome ? func.nome[0].toUpperCase() : "?"}
                </div>

                <span
                  className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                    func.status === "Ativo"
                      ? "bg-green-50 text-green-600 border-green-100"
                      : "bg-red-50 text-red-600 border-red-100"
                  }`}
                >
                  {func.status}
                </span>
              </div>

              {/* NOME & CARGO */}
              <div className="mb-8">
                <h3 className="text-2xl font-black text-gray-900 leading-tight mb-1">
                  {func.nome}
                </h3>
                <div className="flex items-center gap-2 text-[#b5820e]">
                  <Scissors size={14} />
                  <span className="text-[10px] uppercase font-black tracking-[0.15em]">
                    {func.especialidade || "Especialidade não def."}
                  </span>
                </div>
              </div>

              {/* INFO LIST - Campos corrigidos */}
              <div className="space-y-2.5 mb-10">
                <div className="flex items-center gap-4  p-3 rounded-xl border border-transparent hover:border-gray-100 transition-colors">
                  <Mail size={16} className="text-gray-400" /> 
                  <span className="text-xs font-bold text-gray-600 truncate">{func.email}</span>
                </div>
                
                <div className="flex items-center gap-4  p-3 rounded-xl border border-transparent hover:border-gray-100 transition-colors">
                  <Phone size={16} className="text-gray-400" /> 
                  <span className="text-xs font-bold text-gray-600">{func.telefone}</span>
                </div>
              </div>

              {/* AÇÕES */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-50">
                <button
                  onClick={() => onEditarFuncionario(func)}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl hover:bg-gray-50 text-gray-800 font-black text-[10px] uppercase tracking-widest transition-all"
                >
                  <Settings size={14} /> Configurações
                </button>

                <button
                  onClick={() => onRemover(func.id)}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl hover:bg-red-50 text-red-500 font-black text-[10px] uppercase tracking-widest transition-all"
                >
                  <Trash2 size={14} /> Remover
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}