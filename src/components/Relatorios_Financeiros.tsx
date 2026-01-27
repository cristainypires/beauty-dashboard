import React, { useMemo, useState } from "react";
import { 
  BarChart3, ChevronLeft, Download, ArrowUpRight, 
  TrendingUp, Calendar, Target, Award, CheckCircle2, RefreshCw 
} from "lucide-react";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

interface Servico {
  nome: string;
  preco: number;
}

interface Agendamento {
  dataISO: string;
  status: string;
  servico: string;
  cliente: string;
}

interface Props {
  agendamentos: Agendamento[];
  servicos: Servico[];
  onVoltar: () => void;
}

export function Relatorios_Financeiros({ agendamentos, servicos, onVoltar }: Props) {
  const [isSyncing, setIsSyncing] = useState(false);
  const hoje = dayjs();

  // 1. Otimização: Criar um mapa de preços para busca instantânea O(1)
  const servicePriceMap = useMemo(() => {
    return servicos.reduce((acc, s) => {
      acc[s.nome.toLowerCase()] = Number(s.preco);
      return acc;
    }, {} as Record<string, number>);
  }, [servicos]);

  // 2. Função de cálculo otimizada
  const calcularDados = (inicio: dayjs.Dayjs, fim: dayjs.Dayjs) => {
    const filtrados = agendamentos.filter(item => 
      dayjs(item.dataISO).isBetween(inicio.startOf("day"), fim.endOf("day"), null, "[]") &&
      item.status.toLowerCase() === "concluido"
    );

    const porServico: Record<string, { total: number; qtd: number }> = {};
    let faturamentoTotal = 0;

    filtrados.forEach(item => {
      const preco = servicePriceMap[item.servico.toLowerCase()] || 0;
      faturamentoTotal += preco;
      
      if (!porServico[item.servico]) {
        porServico[item.servico] = { total: 0, qtd: 0 };
      }
      porServico[item.servico].total += preco;
      porServico[item.servico].qtd += 1;
    });

    return { total: faturamentoTotal, porServico, count: filtrados.length };
  };

  const stats = {
    diario: useMemo(() => calcularDados(hoje, hoje), [agendamentos, servicePriceMap]),
    semanal: useMemo(() => calcularDados(hoje.startOf("week"), hoje.endOf("week")), [agendamentos, servicePriceMap]),
    mensal: useMemo(() => calcularDados(hoje.startOf("month"), hoje.endOf("month")), [agendamentos, servicePriceMap]),
    anual: useMemo(() => calcularDados(hoje.startOf("year"), hoje.endOf("year")), [agendamentos, servicePriceMap]),
  };

  const handleExportERP = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2000); // Simulação de Sync
  };

  return (
    <div className="bg-white rounded-[2.5rem]  overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700 border border-gray-100">
      
      {/* HEADER EXECUTIVO */}
      <div className="bg-[#0a0a0a] p-8 sm:p-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-5">
            <button 
              onClick={onVoltar} 
              className="group p-3 bg-white/5 hover:bg-[#b5820e] rounded-2xl transition-all duration-300"
            >
              <ChevronLeft size={24} className="text-[#b5820e] group-hover:text-white" />
            </button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                <p className="text-gray-400 text-[10px] uppercase font-bold tracking-[0.3em]">Live Financial Insight</p>
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-black text-white uppercase tracking-tighter">
                Performance <span className="text-[#b5820e]">Financeira</span>
              </h2>
            </div>
          </div>

          <button 
            onClick={handleExportERP}
            disabled={isSyncing}
            className="group relative overflow-hidden bg-white text-black px-8 py-4 rounded-2xl font-black text-xs uppercase flex items-center gap-3 hover:pr-10 transition-all disabled:opacity-50"
          >
            {isSyncing ? <RefreshCw className="animate-spin" size={18}/> : <Download size={18} />}
            {isSyncing ? "Sincronizando..." : "Exportar Primavera ERP"}
          </button>
        </div>
      </div>

      <div className="p-8 sm:p-10 space-y-10">
        
        {/* GRID DE FATURAMENTO PRINCIPAL */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Hoje", val: stats.diario, icon: <Target className="text-blue-500" />, color: "blue" },
            { label: "Semana", val: stats.semanal, icon: <TrendingUp className="text-[#b5820e]" />, color: "gold" },
            { label: "Mês Atual", val: stats.mensal, icon: <Calendar className="text-purple-500" />, color: "purple" },
            { label: "Ano Fiscal", val: stats.anual, icon: <Award className="text-green-500" />, color: "green" },
          ].map((item, idx) => (
            <div key={idx} className="relative group p-8 bg-gray-50 rounded-[2rem] border border-gray-100 hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-white rounded-xl shadow-sm">{item.icon}</div>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.label}</div>
              </div>
              <div>
                <h3 className="text-3xl font-black text-black mb-1">
                  {item.val.total.toLocaleString()}
                  <span className="text-xs font-medium ml-1 text-gray-400">CVE</span>
                </h3>
                <div className="flex items-center gap-1 text-[10px] font-bold text-gray-500">
                  <CheckCircle2 size={12} className="text-green-500" />
                  {item.val.count} Serviços Concluídos
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ANÁLISE DETALHADA */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* RANKING DE SERVIÇOS MAIS RENTÁVEIS */}
          <div className="lg:col-span-2 bg-gray-900 rounded-[2.5rem] p-8 sm:p-10 text-white shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-serif font-bold uppercase italic tracking-tighter">Ranking de Rentabilidade (Mês)</h3>
              <BarChart3 className="text-[#b5820e]" />
            </div>
            
            <div className="space-y-6">
              {Object.entries(stats.mensal.porServico)
                .sort((a, b) => b[1].total - a[1].total)
                .slice(0, 5)
                .map(([nome, dados], i) => {
                  const percent = (dados.total / stats.mensal.total) * 100;
                  return (
                    <div key={nome} className="group">
                      <div className="flex justify-between text-xs font-bold uppercase mb-2 tracking-widest">
                        <span className="flex gap-3">
                          <span className="text-[#b5820e]">0{i+1}.</span> {nome}
                        </span>
                        <span>{dados.total.toLocaleString()} CVE</span>
                      </div>
                      <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#b5820e] to-yellow-200 transition-all duration-1000 ease-out"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              
              {Object.keys(stats.mensal.porServico).length === 0 && (
                <div className="py-10 text-center text-gray-500 text-sm italic">
                  Nenhum faturamento registrado no período selecionado.
                </div>
              )}
            </div>
          </div>

          {/* CARD DE INCENTIVO/META */}
          <div className="bg-[#b5820e] rounded-[2.5rem] p-10 text-black flex flex-col justify-between relative overflow-hidden group">
             <ArrowUpRight size={120} className="absolute -top-4 -right-4 text-black/10 group-hover:scale-110 transition-transform duration-700" />
             <div>
                <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-2 opacity-70">Status Mensal</h4>
                <p className="text-4xl font-black leading-tight italic">FOCO NA META DE CRESCIMENTO</p>
             </div>
             <div className="mt-10">
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1">Média por Serviço</p>
                <p className="text-3xl font-black">
                   {stats.mensal.count > 0 
                     ? Math.round(stats.mensal.total / stats.mensal.count).toLocaleString() 
                     : 0} 
                   <span className="text-sm font-bold ml-1">CVE</span>
                </p>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}