import { TrendingUp, Scissors, ChevronLeft, Award, Target, BarChart2 } from "lucide-react";

interface ServicoPopular {
  nome: string;
  total: number;
  percentagem: number;
}

export function Popularidade_Servicos({ onVoltar }: { onVoltar: () => void }) {
  const dados: ServicoPopular[] = [
    { nome: "Drenagem Linfática", total: 54, percentagem: 42 },
    { nome: "Manicure & Gelinho", total: 38, percentagem: 30 },
    { nome: "Limpeza de Pele VIP", total: 22, percentagem: 18 },
    { nome: "Massagem Relaxante", total: 14, percentagem: 10 },
  ];

  const totalAgendamentos = dados.reduce((acc, curr) => acc + curr.total, 0);

  return (
    <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-50 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER LUXO */}
      <div className="bg-black p-8 flex justify-between items-center relative overflow-hidden">
        {/* Efeito decorativo ao fundo */}
        <div className="absolute top-0 right-0 p-4 opacity-5 text-[#b5820e]">
            <BarChart2 size={120} />
        </div>

        <div className="relative z-10 flex items-center gap-6">
          <button 
            onClick={onVoltar} 
            className="p-3 bg-white/10 rounded-full text-[#b5820e] hover:bg-[#b5820e] hover:text-black transition-all shadow-lg"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h2 className="text-3xl font-serif font-black text-white uppercase tracking-tighter">Ranking de Serviços</h2>
            <p className="text-gray-400 text-[10px] uppercase tracking-[0.3em] mt-1">Análise de Performance Maddie Boutique</p>
          </div>
        </div>

        <div className="relative z-10 hidden md:flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
            <Target className="text-[#b5820e]" size={20} />
            <div className="text-right">
                <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Total Global</p>
                <p className="text-xl font-black text-white">{totalAgendamentos} <span className="text-xs font-normal text-gray-500 uppercase tracking-tighter">Serviços</span></p>
            </div>
        </div>
      </div>

      <div className="p-10">
        <div className="flex items-center gap-2 mb-8">
            <Award className="text-[#b5820e]" size={20} />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Serviços com maior conversão</span>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {dados.map((s, i) => (
            <div key={i} className="group relative">
              <div className="flex justify-between items-end mb-3">
                <div className="flex items-center gap-4">
                  {/* Rank Number */}
                  <span className="text-2xl font-serif italic text-gray-200 group-hover:text-[#b5820e] transition-colors duration-300">
                    0{i + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                        <Scissors size={14} className="text-[#b5820e]" />
                        <h4 className="text-sm font-black text-black uppercase tracking-tight">{s.nome}</h4>
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Demanda Mensal</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-lg font-black text-black">{s.total}</span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase ml-1">Execuções</span>
                </div>
              </div>

              {/* Barra de Progresso Luxuosa */}
              <div className="w-full h-3 bg-gray-50 rounded-full overflow-hidden shadow-inner border border-gray-100">
                <div
                  className="h-full bg-gradient-to-r from-black to-[#b5820e] rounded-full transition-all duration-1000 ease-out relative"
                  style={{ width: `${s.percentagem}%` }}
                >
                    {/* Efeito de brilho na ponta da barra */}
                    <div className="absolute right-0 top-0 h-full w-4 bg-white/20 blur-sm"></div>
                </div>
              </div>

              {/* Percentagem Flutuante */}
              <div className="absolute -right-2 -top-1 opacity-0 group-hover:opacity-100 transition-opacity">
                 <span className="text-[10px] font-black text-[#b5820e] bg-amber-50 px-2 py-1 rounded shadow-sm">{s.percentagem}%</span>
              </div>
            </div>
          ))}
        </div>

        
      </div>
    </div>
  );
}