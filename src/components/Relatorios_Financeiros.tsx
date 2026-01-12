// src/components/Relatorios_Financeiros.tsx
import React from "react";
import { BarChart3, TrendingUp, ArrowUpRight, FileText, RefreshCw, ChevronLeft, Download } from "lucide-react";

export function Relatorios_Financeiros({ onVoltar }: { onVoltar: () => void }) {
  return (
   <div className=" rounded-[2.5rem]  overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
  
  {/* HEADER FINANCEIRO LUXO */}
  <div className="bg-black p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
    <div className="flex items-center gap-4 w-full sm:w-auto">
      <button onClick={onVoltar} className="p-2 hover:bg-white/10 rounded-full transition text-[#b5820e]">
        <ChevronLeft size={24} />
      </button>
      <div>
        <h2 className="text-xl sm:text-2xl font-serif font-black text-white uppercase tracking-tighter">Performance Financeira</h2>
        <p className="text-gray-400 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] mt-1">
          Gestão de Lucro & Integração Primavera ERP
        </p>
      </div>
    </div>

    <div className="flex gap-3 w-full sm:w-auto mt-4 sm:mt-0">
      <button className="bg-white/10 text-white w-full sm:w-auto px-4 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-white/20 transition border border-white/10">
        <Download size={16} /> Exportar para Primavera
      </button>
      <BarChart3 className="text-[#b5820e] w-full sm:w-auto" size={32} />
    </div>
  </div>

  <div className="p-6 sm:p-8 space-y-8">

    {/* CARDS DE PERFORMANCE */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
        <p className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Faturamento Bruto</p>
        <div className="flex items-end justify-between flex-wrap gap-2">
          <h3 className="text-2xl sm:text-3xl font-black text-black">152.400 <span className="text-sm font-normal">CVE</span></h3>
          <span className="flex items-center text-green-500 text-xs font-bold bg-green-50 px-2 py-1 rounded-lg">
            +12% <ArrowUpRight size={14} />
          </span>
        </div>
      </div>
      
      <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
        <p className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Vendas via SISP</p>
        <h3 className="text-2xl sm:text-3xl font-black text-black">98.200 <span className="text-sm font-normal">CVE</span></h3>
        <p className="text-[9px] sm:text-[10px] text-[#b5820e] mt-1 font-bold">64% do faturamento total</p>
      </div>

      <div className="p-6 bg-[#b5820e] rounded-3xl shadow-lg shadow-[#b5820e]/20">
        <p className="text-[9px] sm:text-[10px] font-black text-black/40 uppercase tracking-widest mb-1 italic">Lucro Líquido Estimado</p>
        <h3 className="text-2xl sm:text-3xl font-black text-white">84.200 <span className="text-sm font-normal text-white/70">CVE</span></h3>
        <p className="text-[9px] sm:text-[10px] text-black font-bold mt-1 uppercase tracking-tighter">Após comissões e taxas</p>
      </div>
    </div>

    {/* ÁREA DE INTEGRAÇÃO PRIMAVERA */}
    <div className="bg-black rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <RefreshCw size={120} />
      </div>
      <div className="relative z-10 space-y-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <h3 className="text-base sm:text-lg font-bold uppercase tracking-widest">Sincronização Primavera ERP</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-12">
          <div className="space-y-4">
            <p className="text-gray-400 text-[9px] sm:text-sm leading-relaxed">
              Todos os dados de faturação e vendas concluídas são enviados automaticamente para o software Primavera para fins de contabilidade e gestão de stock.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 w-full sm:w-auto">
                <p className="text-[9px] sm:text-[10px] text-gray-500 uppercase font-bold">Última Sincronização</p>
                <p className="text-sm font-mono">Hoje, às 18:45</p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 w-full sm:w-auto">
                <p className="text-[9px] sm:text-[10px] text-gray-500 uppercase font-bold">Estado do Túnel</p>
                <p className="text-sm text-green-400 font-bold">ONLINE</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center gap-3 w-full sm:w-auto">
            <button className="bg-[#b5820e] text-black py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:opacity-90 transition w-full sm:w-auto">
              Sincronizar Agora Manualmente
            </button>
            <button className="bg-white/10 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/20 transition w-full sm:w-auto">
              Ver Logs de Integração
            </button>
          </div>
        </div>
      </div>
    </div>

    {/* LISTA DE VENDAS RECENTES */}
    <div className="space-y-4">
      <h4 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 ml-2">Últimas Transações SISP</h4>
      {[1,2].map(i => (
        <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-md transition gap-4 sm:gap-0">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-3 bg-white rounded-xl shadow-sm text-[#b5820e]">
              <FileText size={18}/>
            </div>
            <div>
              <p className="text-sm font-bold text-black truncate">Pagamento Confirmado #99283-A</p>
              <p className="text-[9px] sm:text-[10px] text-gray-400 font-mono uppercase truncate">REF: SISP-MADDIE-2023-01</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-black text-black text-sm sm:text-base">4.500 CVE</p>
            <p className="text-[9px] sm:text-[10px] text-green-600 font-bold uppercase">Pago via Vinti4</p>
          </div>
        </div>
      ))}
    </div>

  </div>
</div>

  );
}