import React, { useState } from "react";
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

export function Gerir_Funcionarios({
  onVoltar,
  onNovoFuncionario,
  onEditarFuncionario,
}: {
  onVoltar: () => void;
  onNovoFuncionario: () => void;
  onEditarFuncionario: (func: Funcionario) => void;
}) {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([
    {
      id: 1,
      nome: "Ana Beatriz",
      especialidade: "Estética Facial",
      email: "ana.b@maddie.com",
      telefone: "9912345",
      nascimento: "1990-05-15",
      senha: "senha123",
      status: "Ativo",
    },
    {
      id: 2,
      nome: "Sofia Lemos",
      especialidade: "Massoterapia",
      email: "sofia.l@maddie.com",
      telefone: "9955667",
      nascimento: "1985-08-22",
      senha: "senha456",
      status: "Ativo",
    },
    {
      id: 3,
      nome: "Marta Pires",
      especialidade: "Manicure",
      email: "marta.p@maddie.com",
      telefone: "9988776",
      nascimento: "1992-11-30",
      senha: "senha789",
      status: "Inativo",
    },
  ]);

  const eliminarFuncionario = (id: number, nome: string) => {
    if (window.confirm(`Tem a certeza que deseja remover ${nome} da equipa?`)) {
      setFuncionarios(funcionarios.filter((f) => f.id !== id));
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-10">
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <button
            onClick={onVoltar}
            className="text-[#b5820e] font-bold hover:underline mb-2 text-sm sm:text-base"
          >
            ← Voltar ao Painel
          </button>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-black text-black uppercase tracking-tight">
            Gestão de Equipa
          </h2>
        </div>

        <button
          onClick={onNovoFuncionario}
          className="w-full md:w-auto bg-black text-[#ececec] px-6 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:opacity-90 transition shadow-lg text-xs sm:text-sm"
        >
          <UserPlus size={18} /> Adicionar Profissional
        </button>
      </div>

      {/* GRID DE FUNCIONÁRIOS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 xl:gap-8">
        {funcionarios.map((func) => (
          <div
            key={func.id}
            className="group bg-gray-50 rounded-[2rem] p-6 sm:p-8 border border-transparent hover:border-[#b5820e] transition-all duration-300"
          >
            {/* TOPO */}
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-black flex items-center justify-center text-[#b5820e] text-xl sm:text-2xl font-black shadow-lg">
                {func.nome[0]}
              </div>

              <span
                className={`px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest ${
                  func.status === "Ativo"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {func.status}
              </span>
            </div>

            {/* INFO */}
            <h3 className="text-lg sm:text-xl font-bold text-black mb-1">
              {func.nome}
            </h3>

            <div className="flex items-center gap-2 text-[#b5820e] mb-5">
              <Scissors size={14} />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                {func.especialidade}
              </span>
            </div>

            <div className="space-y-3 mb-6 border-t border-gray-200 pt-5">
              <div className="flex items-center gap-3 text-gray-500 text-xs sm:text-sm break-all">
                <Mail size={15} /> {func.email}
              </div>
              <div className="flex items-center gap-3 text-gray-500 text-xs sm:text-sm">
                <Phone size={15} /> {func.telefone}
              </div>
              <div className="flex items-center gap-3 text-gray-500 text-xs sm:text-sm">
                <Calendar size={15} /> {func.nascimento}
              </div>
              <div className="flex items-center gap-3 text-gray-500 text-xs sm:text-sm">
                <Lock size={15} /> {func.senha}
              </div>
            </div>

            {/* AÇÕES */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onEditarFuncionario(func)}
                className="flex items-center justify-center py-3 rounded-xl bg-white shadow-sm text-gray-400 hover:text-black transition"
                title="Editar Perfil"
              >
                <Settings size={18} />
              </button>

              <button
                onClick={() => eliminarFuncionario(func.id, func.nome)}
                className="flex items-center justify-center py-3 rounded-xl bg-white shadow-sm text-gray-400 hover:text-red-500 transition"
                title="Eliminar"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
