import React, { useState } from "react";
import { UserPlus, Calendar, Settings, Trash2, Mail, Phone, Scissors } from "lucide-react";

interface Funcionario {
  id: number;
  nome: string;
  especialidade: string;
  email: string;
  telefone: string;
  status: "Ativo" | "Inativo";
}

// Adicionámos a prop onEditar
export function Gerir_Funcionarios({ onVoltar, onNovoFuncionario, onEditarFuncionario }: { 
  onVoltar: () => void, 
  onNovoFuncionario: () => void,
  onEditarFuncionario: (func: Funcionario) => void 
}) {
  
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([
    { id: 1, nome: "Ana Beatriz", especialidade: "Estética Facial", email: "ana.b@maddie.com", telefone: "9912345", status: "Ativo" },
    { id: 2, nome: "Sofia Lemos", especialidade: "Massoterapia", email: "sofia.l@maddie.com", telefone: "9955667", status: "Ativo" },
    { id: 3, nome: "Marta Pires", especialidade: "Manicure", email: "marta.p@maddie.com", telefone: "9988776", status: "Inativo" },
  ]);

  // FUNÇÃO PARA REMOVER (Simulada)
  const eliminarFuncionario = (id: number, nome: string) => {
    if (window.confirm(`Tem a certeza que deseja remover ${nome} da equipa?`)) {
      setFuncionarios(funcionarios.filter(f => f.id !== id));
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-50 p-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <button onClick={onVoltar} className="text-[#b5820e] font-bold hover:underline mb-2 block">
            ← Voltar ao Painel
          </button>
          <h2 className="text-3xl font-serif font-black text-black tracking-tighter uppercase">Gestão de Equipa</h2>
        </div>
        
        <button onClick={onNovoFuncionario} className="bg-black text-[#b5820e] px-8 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center gap-3 hover:opacity-90 transition shadow-lg">
          <UserPlus size={20} /> Adicionar Profissional
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {funcionarios.map((func) => (
          <div key={func.id} className="group bg-gray-50 rounded-[2rem] p-8 border border-transparent hover:border-[#b5820e]/30 transition-all duration-300">
            <div className="flex justify-between items-start mb-6">
              <div className="w-16 h-16 rounded-2xl bg-black flex items-center justify-center text-[#b5820e] text-2xl font-black shadow-lg">
                {func.nome[0]}
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                func.status === 'Ativo' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}>
                {func.status}
              </span>
            </div>

            <h3 className="text-xl font-bold text-black mb-1">{func.nome}</h3>
            <div className="flex items-center gap-2 text-[#b5820e] mb-6">
              <Scissors size={14} />
              <span className="text-xs font-bold uppercase tracking-widest">{func.especialidade}</span>
            </div>

            <div className="space-y-3 mb-8 border-t border-gray-200 pt-6">
              <div className="flex items-center gap-3 text-gray-500 text-sm"><Mail size={16}/> {func.email}</div>
              <div className="flex items-center gap-3 text-gray-500 text-sm"><Phone size={16}/> {func.telefone}</div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button title="Agenda" className="flex items-center justify-center p-3 bg-white rounded-xl text-gray-400 hover:text-[#b5820e] transition shadow-sm"><Calendar size={18} /></button>
              
              {/* BOTÃO EDITAR */}
              <button 
                onClick={() => onEditarFuncionario(func)}
                title="Editar Perfil" 
                className="flex items-center justify-center p-3 bg-white rounded-xl text-gray-400 hover:text-black transition shadow-sm"
              >
                <Settings size={18} />
              </button>

              {/* BOTÃO ELIMINAR */}
              <button 
                onClick={() => eliminarFuncionario(func.id, func.nome)}
                title="Eliminar" 
                className="flex items-center justify-center p-3 bg-white rounded-xl text-gray-400 hover:text-red-500 transition shadow-sm"
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