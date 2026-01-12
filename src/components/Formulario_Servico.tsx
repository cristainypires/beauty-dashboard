import React, { useState } from "react";

interface FormularioServicoProps {
  onVoltar: () => void;
  onSubmit: (data: {
    nome: string;
    duracao: number;
    preco: number;
    ativo: boolean;
  }) => void;
}

export function Formulario_Servico({
  onVoltar,
  onSubmit,
}: FormularioServicoProps) {
  const [nome, setNome] = useState("");
  const [duracao, setDuracao] = useState<number | "">("");
  const [preco, setPreco] = useState<number | "">("");
  const [ativo, setAtivo] = useState(true);

  const handleSubmit = () => {
    if (!nome || !duracao || !preco) {
      alert("Por favor, preencha todos os campos corretamente!");
      return;
    }

    onSubmit({
      nome,
      duracao: Number(duracao),
      preco: Number(preco),
      ativo,
    });

    setNome("");
    setDuracao("");
    setPreco("");
    setAtivo(true);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-10 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
        <button
          onClick={onVoltar}
          className="text-[#b5820e] font-bold hover:underline text-sm w-fit"
        >
          ← Voltar
        </button>

        <h2 className="text-2xl sm:text-3xl font-serif font-black text-black">
          Cadastrar Novo Serviço
        </h2>
      </div>

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        
        {/* Nome */}
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
            Nome do Serviço
          </label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full p-4 bg-gray-50 rounded-2xl border border-transparent focus:border-[#b5820e] focus:ring-2 focus:ring-[#b5820e] outline-none text-sm"
            placeholder="Ex: Limpeza de Pele"
          />
        </div>

        {/* Duração & Preço */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
              Duração (min)
            </label>
            <input
              type="number"
              value={duracao}
              onChange={(e) =>
                setDuracao(e.target.value === "" ? "" : Number(e.target.value))
              }
              className="w-full p-4 bg-gray-50 rounded-2xl border border-transparent focus:border-[#b5820e] focus:ring-2 focus:ring-[#b5820e] outline-none text-sm"
              placeholder="60"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
              Preço (CVE)
            </label>
            <input
              type="number"
              step="0.01"
              value={preco}
              onChange={(e) =>
                setPreco(e.target.value === "" ? "" : Number(e.target.value))
              }
              className="w-full p-4 bg-gray-50 rounded-2xl border border-transparent focus:border-[#b5820e] focus:ring-2 focus:ring-[#b5820e] outline-none text-sm"
              placeholder="2500.00"
            />
          </div>
        </div>

        {/* Ativo */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={ativo}
            onChange={(e) => setAtivo(e.target.checked)}
            className="w-5 h-5 accent-[#b5820e]"
          />
          <span className="text-sm font-medium text-gray-700">
            Serviço ativo para agendamentos
          </span>
        </div>

        {/* Botão */}
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full py-4 bg-black text-[#b5820e] rounded-2xl font-black uppercase tracking-widest hover:opacity-90 transition shadow-lg text-sm"
        >
          Cadastrar Serviço
        </button>
      </form>
    </div>
  );
}
