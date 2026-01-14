import {
  UserPlus,
  Settings,
  Trash2,
  Mail,
  Phone,
  Scissors,
  Calendar,
  Lock,
} from "lucide-react";

interface Funcionario {
  id: number;
  nome: string;
  especialidade: string;
  email: string;
  telefone: string;
  nascimento?: string;
  senha?: string;
  status: "Ativo" | "Inativo";
}

interface Props {
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
}: Props) {
  return (
    <div className="p-4 sm:p-6 md:p-10">
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <button
            onClick={onVoltar}
            className="text-[#b5820e] font-bold hover:underline mb-2"
          >
            ← Voltar ao Painel
          </button>

          <h2 className="text-3xl font-black uppercase">
            Gestão de Equipa
          </h2>
        </div>

        <button
          onClick={onNovoFuncionario}
          className="bg-black text-white px-6 py-4 rounded-2xl font-black uppercase flex items-center gap-3"
        >
          <UserPlus size={18} />
          Adicionar Profissional
        </button>
      </div>

      {/* LISTA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {funcionarios.map((func) => (
          <div
            key={func.id}
            className="bg-gray-50 rounded-2xl p-6 border hover:border-[#b5820e]"
          >
            <div className="flex justify-between mb-4">
              <div className="w-14 h-14 rounded-xl bg-black text-[#b5820e] flex items-center justify-center font-black text-xl">
                {func.nome[0]}
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  func.status === "Ativo"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {func.status}
              </span>
            </div>

            <h3 className="text-xl font-bold">{func.nome}</h3>

            <div className="flex items-center gap-2 text-[#b5820e] mb-4">
              <Scissors size={14} />
              <span className="text-xs uppercase font-bold">
                {func.especialidade}
              </span>
            </div>

            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex gap-2"><Mail size={14} /> {func.email}</div>
              <div className="flex gap-2"><Phone size={14} /> {func.telefone}</div>
              <div className="flex gap-2"><Calendar size={14} /> {func.nascimento}</div>
              <div className="flex gap-2"><Lock size={14} /> {func.senha}</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onEditarFuncionario(func)}
                className="py-3 bg-white rounded-xl shadow hover:text-black"
              >
                <Settings />
              </button>

              <button
                onClick={() => onRemover(func.id)}
                className="py-3 bg-white rounded-xl shadow hover:text-red-500"
              >
                <Trash2 />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
