import React, { useState } from "react";
import { 
  Calendar, Clock, CheckCircle, ChevronLeft, Star, Plus, Search, History 
} from "lucide-react";

// Imports de Componentes
import { Agenda_Item } from "../components/Agenda_Item";
import { Gestao_Disponibilidade } from "../components/Gestao_Disponibilidade";

// =====================
// DASHBOARD FUNCIONÁRIO
// =====================
export function DashboardFuncionario() {
  const [view, setView] = useState<"home" | "agenda" | "historico" | "disponibilidade" | "novo">("home");

  const [agenda] = useState([
    { id: 1, cliente: "Marta Tavares", servico: "Limpeza de Pele", hora: "09:00", status: "Confirmado", obs: "Alergia a lavanda." },
    { id: 2, cliente: "Carla Antunes", servico: "Massagem", hora: "11:00", status: "Confirmado" },
  ]);

  return (
    <div className="min-h-screen bg-white p-6 md:p-10">
      
      {/* HEADER LUXO */}
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gray-100 pb-10 gap-6">
        <div>
          {view !== "home" && (
            <button onClick={() => setView("home")} className="flex items-center gap-2 text-[#b5820e] font-bold text-xs uppercase tracking-widest mb-4 hover:underline">
              <ChevronLeft size={16}/> Voltar ao Início
            </button>
          )}
          <h1 className="text-4xl font-serif font-black tracking-tight text-black uppercase">
            Maddie <span className="text-[#b5820e]">Professional</span>
          </h1>
          <p className="text-gray-400 italic mt-2 text-lg">"Excelência em cada detalhe, beleza em cada toque."</p>
        </div>

        <div className="bg-black text-[#b5820e] px-8 py-4 rounded-2xl shadow-2xl border-b-4 border-[#b5820e] flex items-center gap-4">
          <Calendar size={20} />
          <span className="text-sm font-black uppercase tracking-[0.2em]">
            {new Date().toLocaleDateString("pt-PT", { day: '2-digit', month: 'long', year: 'numeric' })}
          </span>
        </div>
      </header>

      {/* RENDERIZAÇÃO: HOME */}
      {view === "home" && (
        <>
          {/* CARDS DE RESUMO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatCard title="Próximos" value={agenda.length} icon={Clock} color="bg-amber-50" onClick={() => setView("agenda")} />
            <StatCard title="Novo Agendamento" value="Criar" icon={Plus} color="bg-gray-50" onClick={() => setView("novo")} />
            <StatCard title="Histórico" value="Ver" icon={History} color="bg-gray-50" onClick={() => setView("historico")} />
            <StatCard title="Avaliação" value="4.9" icon={Star} color="bg-gray-50" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* LISTA RÁPIDA DE AGENDA */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-black text-black uppercase tracking-tighter italic">Agenda de Hoje</h2>
                <button onClick={() => setView("agenda")} className="text-[#b5820e] font-bold text-xs uppercase tracking-widest hover:underline">Ver Mapa Completo</button>
              </div>

              <div className="space-y-4">
                {agenda.map((item) => (
                  <Agenda_Item 
                    key={item.id}
                    cliente={item.cliente}
                    servico={item.servico}
                    hora={item.hora}
                    status={item.status}
                    obs={item.obs}
                    onRemarcar={() => alert("Função Remarcar")}
                    onCancelar={() => alert("Função Cancelar")}
                  />
                ))}
              </div>
            </div>

            {/* SIDEBAR DE ACÇÕES */}
            <div className="space-y-8">
               <div className="bg-black rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
                  <h3 className="text-xl font-bold text-[#b5820e] mb-4 uppercase tracking-widest">Minha Agenda</h3>
                  <p className="text-gray-400 text-xs mb-8 leading-relaxed">Gerencie sua disponibilidade diária, mensal e anual para o sistema automatizado.</p>
                  <button onClick={() => setView("disponibilidade")} className="w-full py-5 bg-[#b5820e] text-black rounded-2xl font-black uppercase text-xs tracking-widest hover:opacity-90 transition shadow-lg">
                    Configurar Disponibilidade
                  </button>
               </div>
               
               <div className="bg-gray-50 rounded-[2.5rem] p-8 border border-gray-100">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle size={16} className="text-[#b5820e]"/>
                    <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Aviso do Sistema</h4>
                  </div>
                  <p className="text-xs text-gray-500 italic leading-relaxed">
                    "Lembre-se: O encerramento dos serviços é realizado automaticamente pelo sistema 30 minutos após o horário de fim previsto."
                  </p>
               </div>
            </div>
          </div>
        </>
      )}

      {/* RENDERIZAÇÃO: OUTRAS TELAS */}
      {view === "agenda" && (
        <div className="space-y-6">
            <h2 className="text-3xl font-black text-black uppercase tracking-widest mb-10">Mapa Completo de Atendimentos</h2>
            {agenda.map(item => (
                <Agenda_Item key={item.id} {...item} onRemarcar={() => {}} onCancelar={() => {}} />
            ))}
        </div>
      )}

      {view === "disponibilidade" && <Gestao_Disponibilidade />}

      {view === "novo" && (
          <div className="py-20 text-center bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
              <Plus size={48} className="mx-auto text-[#b5820e] mb-4" />
              <h3 className="text-xl font-bold text-black uppercase">Novo Agendamento</h3>
              <p className="text-gray-400 text-sm">Formulário de marcação rápida em desenvolvimento.</p>
          </div>
      )}

    </div>
  );
}

// Subcomponente StatCard
function StatCard({ title, value, icon: Icon, color, onClick }: any) {
  return (
    <div onClick={onClick} className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-gray-50 cursor-pointer hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
      <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:bg-black transition-colors`}>
        <Icon size={24} className="text-black group-hover:text-[#b5820e] transition-colors" />
      </div>
      <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">{title}</p>
      <p className="text-2xl font-black text-black">{value}</p>
    </div>
  );
}