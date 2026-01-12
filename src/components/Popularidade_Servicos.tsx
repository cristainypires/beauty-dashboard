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
    <div className=" rounded-[2.5rem]  overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* HEADER */}
      <div className=" p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden">
        {/* Decorativo */}
        

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
              Análise de Performance Maddie Boutique
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-10 space-y-8">

        {/* TÍTULO SECUNDÁRIO */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Award className="text-[#b5820e]" size={20} />
          <span className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-gray-400">Serviços com maior conversão</span>
        </div>

        {/* LISTA DE SERVIÇOS */}
        <div className="grid grid-cols-1 gap-6">
          {dados.map((s, i) => (
            <div key={i} className="group relative bg-gray-50 rounded-3xl p-4 sm:p-6 shadow-sm hover:shadow-lg transition-all border border-gray-100">
              
              {/* HEADER DO SERVIÇO */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-4 sm:mb-6 gap-2 sm:gap-0">
                <div className="flex items-center gap-4">
                  <span className="text-3xl sm:text-4xl font-serif italic text-[#b5820e] transition-colors duration-300">
                    0{i + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <Scissors size={16} className="text-[#b5820e]" />
                      <h4 className="text-sm sm:text-base font-black text-black uppercase tracking-tight">{s.nome}</h4>
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-1">Demanda Mensal</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-lg sm:text-xl font-black text-black">{s.total}</span>
                  <span className="text-[10px] sm:text-[11px] text-gray-400 font-bold uppercase ml-1">Execuções</span>
                </div>
              </div>

              {/* BARRA DE PROGRESSO */}
              <div className="w-full h-4 sm:h-5 bg-gray-100 rounded-full overflow-hidden shadow-inner border border-gray-200 relative">
                <div
                  className="h-full bg-gradient-to-r from-black to-[#b5820e] rounded-full transition-all duration-1000 ease-out relative"
                  style={{ width: `${s.percentagem}%` }}
                >
                  <div className="absolute right-0 top-0 h-full w-4 bg-white/20 blur-sm"></div>
                </div>

                {/* Percentagem flutuante */}
                <div className="absolute right-0 -top-6 sm:-top-7 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] sm:text-xs font-black text-[#b5820e] bg-amber-50 px-2 py-1 rounded shadow-sm">
                    {s.percentagem}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
