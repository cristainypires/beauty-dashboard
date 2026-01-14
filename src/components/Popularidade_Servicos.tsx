// src/components/Popularidade_Servicos.tsx
import React from "react";
import { TrendingUp, Scissors, ChevronLeft, Award, Tag } from "lucide-react";
import { Agendamento } from "../pages/DashboardAdmin";

interface PopularidadeProps {
  agendamentos: Agendamento[];
  onVoltar: () => void;
}

export function Popularidade_Servicos({ agendamentos, onVoltar }: PopularidadeProps) {
  
  // --- LÓGICA DE CÁLCULO REAL ---
  
  // 1. Contar execuções por serviço
  const contagem: Record<string, number> = {};
  agendamentos.forEach((a) => {
    contagem[a.servico] = (contagem[a.servico] || 0) + 1;
  });

  const totalGeral = agendamentos.length;

  // 2. Transformar em array, calcular % e ordenar do mais popular para o menos
  const dados = Object.entries(contagem)
    .map(([nome, total]) => ({
      nome,
      total,
      percentagem: totalGeral > 0 ? Math.round((total / totalGeral) * 100) : 0,
    }))
    .sort((a, b) => b.total - a.total); // Ordem decrescente

  return (
    <div className="rounded-[2.5rem] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* HEADER */}
      <div className="p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden">
        <div className="flex items-center gap-4 w-full sm:w-auto z-10">
          <button 
            onClick={onVoltar} 
            className="p-3 bg-white/10 rounded-full text-[#b5820e] hover:bg-[#b5820e] hover:text-black transition-all shadow-lg"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-black uppercase tracking-tighter">Ranking de Serviços</h2>
            <p className="text-gray-400 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] mt-1">
              Análise baseada em {totalGeral} agendamentos reais
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-10 space-y-8">
        <div className="flex items-center gap-2 sm:gap-3">
          <Award className="text-[#b5820e]" size={20} />
          <span className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-gray-400">Desempenho de Vendas</span>
        </div>

        {/* LISTA DE SERVIÇOS DINÂMICA */}
        <div className="grid grid-cols-1 gap-6">
          {dados.length === 0 ? (
            <p className="text-center py-20 text-gray-400 italic">Sem dados de agendamentos para analisar.</p>
          ) : (
            dados.map((s, i) => (
              <div key={i} className="group relative bg-gray-50 rounded-3xl p-4 sm:p-6 shadow-sm hover:shadow-lg transition-all border border-gray-100">
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-4 sm:mb-6 gap-2 sm:gap-0">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl sm:text-4xl font-serif italic text-[#b5820e]">
                      0{i + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <Scissors size={16} className="text-[#b5820e]" />
                        <h4 className="text-sm sm:text-base font-black text-black uppercase tracking-tight">{s.nome}</h4>
                      </div>
                      <p className="text-[10px] sm:text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-1">Participação no Mercado</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-lg sm:text-xl font-black text-black">{s.total}</span>
                    <span className="text-[10px] sm:text-[11px] text-gray-400 font-bold uppercase ml-1">Vendas</span>
                  </div>
                </div>

                {/* BARRA DE PROGRESSO DINÂMICA */}
                <div className="w-full h-4 sm:h-5 bg-gray-100 rounded-full overflow-hidden shadow-inner border border-gray-200 relative">
                  <div
                    className="h-full bg-gradient-to-r from-black to-[#b5820e] rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${s.percentagem}%` }}
                  />

                  <div className="absolute right-4 top-0 h-full flex items-center">
                    <span className="text-[10px] font-black text-gray-500">
                      {s.percentagem}%
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}