import React, { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  ChevronLeft,
  History,
  Star,
  CheckCircle,
  List,
  Settings,
  Plus,
} from "lucide-react";
import { ProfissionalService } from "../services/Profissional.service";

// Componentes reaproveitados
import { Agenda_Item } from "../components/Agenda_Item";
import { Gestao_Disponibilidade } from "../components/Gestao_Disponibilidade";

type View = "home" | "agenda" | "historico" | "todos" | "disponibilidade";

export function DashboardProfissional() {
  const [view, setView] = useState<View>("home");
  const [agenda, setAgenda] = useState<any[]>([]);
  const [perfil, setPerfil] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 1. Carregamento de Dados (Sem loops infinitos)
  const carregarDados = async () => {
    try {
      setLoading(true);
      let dados;

      if (view === "historico") {
        dados = await ProfissionalService.verHistorico();
      } else if (view === "todos") {
      } else {
        dados = await ProfissionalService.listarMinhaAgenda();
      }

      const dadosPerfil = await ProfissionalService.obterPerfil();

      setAgenda(Array.isArray(dados) ? dados : []);
      setPerfil(dadosPerfil);
    } catch (err) {
      console.error("Erro ao carregar dados do profissional");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, [view]);

  // 2. Ações
  const handleConcluir = async (id: number) => {
    if (!window.confirm("Concluir atendimento?")) return;
    try {
      await ProfissionalService.concluirServico(id);
      alert("Serviço concluído! ✨");
      carregarDados();
    } catch (err) {
      alert("Erro ao concluir.");
    }
  };

  // Separação de dados para os cards da Home
  const proximos = agenda.filter(
    (a) => a.status === "Confirmado" || a.status === "Pendente"
  );
  const concluidosCount = agenda.filter((a) => a.status === "Concluído").length;

  return (
    <div className="min-h-screen bg-white p-6 md:p-10">
      {/* HEADER LUXO */}
      <section className="mb-8 border-b pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          {view !== "home" && (
            <button
              onClick={() => setView("home")}
              className="flex items-center gap-2 text-[#b5820e] text-xs uppercase font-bold mb-4 hover:underline"
            >
              <ChevronLeft size={16} /> Voltar ao Início
            </button>
          )}
          <h1 className="text-3xl font-black text-black">
            Painel do Profissional
          </h1>
          <h2 className="text-xl font-bold text-gray-700 mt-2">
            Bem-vinda, <span className="text-[#b5820e]">{perfil?.nome}</span>
          </h2>
          <p className="text-gray-400 italic text-sm">
            Serviço Associado: {perfil?.servico_associado}
          </p>
        </div>

        <div className="flex gap-4">
          <div className="bg-amber-50 px-4 py-2 rounded-xl border border-amber-200 flex items-center gap-2">
            <Star className="text-[#b5820e] fill-[#b5820e]" size={20} />
            <span className="font-black text-[#b5820e]">
              {perfil?.avaliacao}
            </span>
          </div>
        </div>
      </section>

      {loading && (
        <p className="animate-pulse text-gray-400">
          Sincronizando com a boutique...
        </p>
      )}

      {/* VIEW: HOME */}
      {view === "home" && !loading && (
        <div className="space-y-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Minha Agenda (Hoje e Futuro)"
              value={proximos.length}
              icon={Clock}
              onClick={() => setView("agenda")}
            />
            <StatCard
              title="Ver agendamentos Concluídos"
              value={concluidosCount}
              icon={CheckCircle}
              onClick={() => setView("historico")}
            />
            
            
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-1 gap-10">
            {/* PRÓXIMO CLIENTE */}
            <div className="space-y-4">
              <h3 className="font-black uppercase text-gray-400 text-sm tracking-widest">
                Próximo da sua Lista
              </h3>
              {proximos.length > 0 ? (
                <Agenda_Item
                  {...proximos[0]}
                  onItemClick={() => handleConcluir(proximos[0].id)}
                  onClienteClick={() => {}}
                />
              ) : (
                <p className="text-gray-400 italic">
                  Nenhum serviço pendente para hoje.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW: AGENDA (Hoje e Futuro) */}
      {view === "agenda" && (
        <div className="space-y-4">
          <h2 className="text-2xl font-black mb-6 uppercase">
            Minha Agenda (Hoje e Futuro)
          </h2>
          {proximos.map((item) => (
            <Agenda_Item
              key={item.id}
              {...item}
              onItemClick={() => handleConcluir(item.id)}
            />
          ))}
        </div>
      )}

      {/* VIEW: HISTÓRICO (Passados) */}
      {view === "historico" && (
        <div className="space-y-4">
          <h2 className="text-2xl font-black mb-6 uppercase">
            Meu Histórico de Serviços
          </h2>
          {agenda.map((item) => (
            <Agenda_Item
              key={item.id}
              {...item}
              status="Concluído"
              clickable={false}
            />
          ))}
        </div>
      )}

      {/* VIEW: TODOS (Sem exceção) */}
      {view === "todos" && (
        <div className="space-y-4">
          <h2 className="text-2xl font-black mb-6 uppercase tracking-tighter text-red-600">
            Todos os Agendamentos do Sistema
          </h2>
          {agenda.map((item) => (
            <Agenda_Item key={item.id} {...item} clickable={false} />
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  onClick,
  color = "text-[#b5820e]",
}: any) {
  return (
    <div
      onClick={onClick}
      className="bg-white border border-[#b5820e] rounded-3xl p-8 cursor-pointer shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
    >
      <Icon size={24} className={`${color} mb-4`} />
      <p className="text-[10px] uppercase text-gray-400 font-black tracking-widest">
        {title}
      </p>
      <p className="text-3xl font-black text-black mt-1">{value}</p>
    </div>
  );
}
