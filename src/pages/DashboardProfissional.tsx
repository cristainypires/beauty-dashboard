// src/pages/DashboardProfissional.tsx
import React, { useEffect, useState } from "react";
import { Clock, ChevronLeft, Star, CheckCircle, List } from "lucide-react";

import { ProfissionalService } from "../services/Profissional.service";
import { Agenda_Item } from "../components/Agenda_Item";
import { safeArray, ensureAgendaItem } from "../utils/dataHelpers";

type View = "home" | "agenda" | "historico" | "todos";

export function DashboardProfissional() {
  const [view, setView] = useState<View>("home");
  const [agenda, setAgenda] = useState<any[]>([]);
  const [perfil, setPerfil] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 🔹 Carregar dados do backend
  const carregarDados = async () => {
    try {
      setLoading(true);

      // Agenda ou histórico
      let dadosAgenda;
      if (view === "historico") {
        dadosAgenda = await ProfissionalService.verHistorico();
        console.log("[DEBUG] Histórico bruto:", dadosAgenda);
      } else {
        dadosAgenda = await ProfissionalService.listarMinhaAgenda();
      }

      const agendaArray = safeArray(dadosAgenda).map((item: any) => {
        const formatado = ensureAgendaItem(item);

        // Forçar UTC para a data
        const rawData = item.raw?.data_hora_inicio || item.data_hora_inicio;
        const dt = rawData ? new Date(rawData + "Z") : new Date();

        return {
          ...formatado,
          cliente:
            formatado.cliente !== "Cliente"
              ? formatado.cliente
              : item.Cliente?.Usuario?.nome || item.cliente_nome || "Sem nome",
          telefone:
            formatado.telefone ||
            item.Cliente?.Usuario?.numero_telefone ||
            "Sem telefone",
          servico:
            formatado.servico !== "Serviço"
              ? formatado.servico
              : item.Servico?.nome_servico || "Sem serviço",
          status: (
            formatado.status ||
            item.status ||
            item.status_agendamento?.nome ||
            ""
          ).toLowerCase(),
          dataFormatada: dt.toLocaleDateString("pt-CV", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
          horaFormatada: dt.toLocaleTimeString("pt-CV", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          dataHora: dt, // útil para filtros
        };
      });

      setAgenda(agendaArray);

      // Perfil
      let dadosPerfil = await ProfissionalService.obterPerfil();
if (!dadosPerfil || Object.keys(dadosPerfil).length === 0) {
  dadosPerfil = {
    nome: localStorage.getItem("usuario_nome") || "Profissional", // Removido o agendaArray[0]?.cliente
    servico_associado: agendaArray[0]?.servico || "-",
    avaliacao: 4.9,
    estatisticas: { total_agendamentos: agendaArray.length },
  };
}
      setPerfil(dadosPerfil);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      setAgenda([]);
      setPerfil({
        nome: localStorage.getItem("usuario_nome") || "Profissional",
        servico_associado: "-",
        avaliacao: 4.9,
        estatisticas: { total_agendamentos: 0 },
      });
      setErrorMsg("Erro ao sincronizar com o servidor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, [view]);

  // 🔹 Filtrar agendamentos próximos (hoje e futuro)
  // 1. Zere as horas da variável 'hoje' para comparar apenas os dias
const hoje = new Date();
hoje.setHours(0, 0, 0, 0); // zera hora, minuto, segundo e ms

const proximos = agenda
  .filter(a => {
    if (!a.dataHora) return false; // garante que dataHora existe

    // Zera hora do agendamento para comparar só datas
    const dataAg = new Date(a.dataHora);
    dataAg.setHours(0, 0, 0, 0);

    // ✅ Hoje ou futuro
    const isHojeOuFuturo = dataAg.getTime() >= hoje.getTime();

    // ✅ Status válido
    const statusAtivo = ["confirmado", "pendente", "reagendado", "cancelado"].includes(a.status);
    return isHojeOuFuturo && statusAtivo;
  })
  .sort((a, b) => a.dataHora.getTime() - b.dataHora.getTime());



  // 🔹 Contagem de agendamentos concluídos
  const concluidosCount = agenda.filter(
    (a) => a.status === "concluido" || a.status === "concluído",
  ).length;

  // 🔹 Dados do perfil
  const nome = perfil?.nome || "Profissional";
  const servico_associado = perfil?.servico_associado || "-";
  const avaliacao = perfil?.avaliacao || 4.9;
  const totalAgendamentos = perfil?.estatisticas?.total_agendamentos || 0;

  return (
    <div className="min-h-screen bg-white p-6 md:p-10">
      {errorMsg && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
          <div className="flex items-center justify-between">
            <div>
              <strong>Erro ao sincronizar com o servidor:</strong>
              <div className="text-sm mt-1">{errorMsg}</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={carregarDados}
                className="px-3 py-1 bg-red-600 text-white rounded-md text-sm"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
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
            Bem-vinda, <span className="text-[#b5820e]">{nome}</span>
          </h2>
          <p className="text-gray-400 italic text-sm">
            Serviço Associado: {servico_associado}
          </p>
        </div>

        <div className="flex gap-4">
          <div className="bg-amber-50 px-4 py-2 rounded-xl border border-amber-200 flex items-center gap-2">
            <Star className="text-[#b5820e] fill-[#b5820e]" size={20} />
            <span className="font-black text-[#b5820e]">{avaliacao}</span>
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
              title="Agendamentos Concluídos"
              value={concluidosCount}
              icon={CheckCircle}
              onClick={() => setView("historico")}
            />
          </div>

          {/* Próximo Cliente */}
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-10 mt-10">
            <div className="space-y-4">
              <h3 className="font-black uppercase text-gray-400 text-sm tracking-widest">
                Próximo da sua Lista
              </h3>
              {proximos.length > 0 ? (
                <Agenda_Item {...proximos[0]} clickable={true} />
              ) : (
                <p className="text-gray-400 italic">
                  Nenhum serviço pendente para hoje.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW: AGENDA */}
      {view === "agenda" && (
        <div className="space-y-4">
          <h2 className="text-2xl font-black mb-6 uppercase">
            Minha Agenda (Hoje e Futuro)
          </h2>
          {proximos.map((item) => (
            <Agenda_Item key={item.id} {...item} clickable={true} />
          ))}
        </div>
      )}

      {/* VIEW: HISTÓRICO */}
      {view === "historico" && (
        <div className="space-y-4">
          <h2 className="text-2xl font-black mb-6 uppercase">
            Meu Histórico de Serviços
          </h2>
          {agenda
            .filter((a) => a.status === "concluido" || a.status === "concluído")
            .sort((a, b) => b.dataHora.getTime() - a.dataHora.getTime())
            .map((item) => (
              <Agenda_Item key={item.id} {...item} clickable={false} />
            ))}
        </div>
      )}

      {/* VIEW: TODOS */}
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

// 🔹 StatCard component
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
