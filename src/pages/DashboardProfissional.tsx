// src/pages/DashboardProfissional.tsx
import React, { useEffect, useState, useMemo } from "react";
import { Clock, ChevronLeft, Star, CheckCircle, Scissors, List, Calendar, ListCheck } from "lucide-react";
import { ProfissionalService } from "../services/Profissional.service";
import { Agenda_Item } from "../components/Agenda_Item";
import { safeArray } from "../utils/dataHelpers";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import { PanoramaDisponibilidade } from "../components/PanoramaDisponibilidade";
dayjs.extend(utc);
dayjs.extend(timezone);

const FUSO_CABO_VERDE = "Atlantic/Cape_Verde";

export function DashboardProfissional() {
  const [view, setView] = useState<"home" | "agenda" | "historico" | "ver">(
    "home",
  );
  const [agenda, setAgenda] = useState<any[]>([]);
  const [perfil, setPerfil] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const formatarLocal = (dt: dayjs.Dayjs) => {
    return {
      iso: dt.format("YYYY-MM-DD"),
      display: dt.format("DD/MM/YYYY"),
    };
  };

  const hoje = useMemo(() => formatarLocal(dayjs().tz(FUSO_CABO_VERDE)), []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [dadosAgenda, historicoBruto, dadosPerfil] = await Promise.all([
        ProfissionalService.listarMinhaAgenda(""),
        ProfissionalService.verHistorico(),
        ProfissionalService.obterPerfil(),
      ]);
      console.log("DADOS DO PERFIL QUE CHEGARAM:", dadosPerfil);
      setPerfil(dadosPerfil);

      const todosOsDados = [
        ...safeArray(dadosAgenda),
        ...safeArray(historicoBruto),
      ];

      const agendaArray = todosOsDados
        .map((item: any) => {
          const rawData = item.data_hora_inicio;
          if (!rawData) return null;

          // ✅ Corrige para fuso de Cabo Verde
          const dtCVE = dayjs.utc(rawData).tz(FUSO_CABO_VERDE);

          const infoData = formatarLocal(dtCVE);
          const horaStr = dtCVE.format("HH:mm");

          return {
            ...item,
            id: item.id,
            cliente: item.nome_cliente || "Cliente",
            telefone: item.telefone_cliente || "Sem telefone",
            servico: item.nome_servico || "Serviço não informado",
            hora: horaStr,
            data_hora_inicio: dtCVE.toDate(),
            dataFormatada: infoData.display,
            data: dtCVE.toDate(),
            status: (item.status || "")
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, ""),
            dataIso: infoData.iso,
            timestamp: dtCVE.valueOf(),
          };
        })
        .filter(Boolean);

      setAgenda(agendaArray);
    } catch (error) {
      console.error("Erro ao carregar:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  // --- FILTROS DE EXIBIÇÃO ---
  // Agenda de hoje: apenas os agendamentos confirmados para hoje
  // --- FILTROS DE EXIBIÇÃO CORRIGIDOS ---

  // 1. Agenda de hoje: Mostra o que o profissional tem para FAZER hoje (Confirmados e Pendentes)
  const agendaDeHoje = useMemo(() => {
    return agenda
      .filter(
        (a) =>
          a.dataIso === hoje.iso &&
          (a.status === "confirmado" || a.status === "reagendado"),
      )
      .sort(
        (a, b) =>
          new Date(a.data_hora_inicio).getTime() -
          new Date(b.data_hora_inicio).getTime(),
      );
  }, [agenda, hoje.iso]);

  const agendaCompleta = useMemo(() => {
    return agenda
      .filter(
        (a) =>
          a.dataIso > hoje.iso &&
          ["confirmado", "reagendado"].includes(a.status),
      )
      .sort(
        (a, b) => a.data_hora_inicio.getTime() - b.data_hora_inicio.getTime(),
      );
  }, [agenda, hoje.iso]);

  // 3. Histórico: apenas concluídos no passado
  const historicoConcluidos = useMemo(() => {
    const inicioDeHoje = new Date();
    inicioDeHoje.setHours(0, 0, 0, 0); // 00:00 de hoje

    return agenda
      .filter(
        (a) =>
          a.status === "concluido" &&
          new Date(a.data_hora_inicio) < inicioDeHoje,
      )
      .sort(
        (a, b) =>
          new Date(b.data_hora_inicio).getTime() -
          new Date(a.data_hora_inicio).getTime(),
      );
  }, [agenda]);

  return (
    <div className="min-h-screen bg-white p-6 md:p-10">

      {view !== "home" && (
  <button
    onClick={() => setView("home")}
    className="flex items-center gap-2 text-[#b5820e] text-xs uppercase font-bold mb-4 
               hover:text-[#d29f00] hover:underline transition-colors duration-200"
  >
    <ChevronLeft size={16} className="shadow-sm" /> Voltar ao Início
  </button>
)}

      {view === "home" && (
  <section className="mb-8 border-b pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
    <div className="flex-1">
      <div className="bg-white p-4 md:p-4 ">
        <h1 className="text-3xl md:text-4xl font-extrabold text-black mb-2">
          Painel do Profissional
        </h1>

        <h2 className="text-xl md:text-2xl font-bold text-gray-700 mb-1">
          Olá, <span className="text-[#b5820e]">{perfil?.nome}</span> 
        </h2>

        {perfil?.servico_associado && (
          <p className="text-sm md:text-base text-gray-500 font-medium mb-2 flex items-center gap-1">
             Serviço:{" "}
            <span className="text-[#b5820e]">{perfil.servico_associado}</span>
          </p>
        )}

        <p className="text-gray-600 italic text-sm md:text-base leading-relaxed">
          Este é o seu espaço para <span className="font-semibold">gerir sua agenda</span>, 
          acompanhar seus clientes e manter tudo organizado. <br />
          Estamos prontos para apoiar você em cada atendimento 💼✂️
        </p>
      </div>
    </div>

    <div className="flex-shrink-0 flex items-center gap-3 bg-amber-50 px-6 py-2 rounded-xl shadow-sm border border-amber-100">
      <Calendar size={20} className="text-[#b5820e]" />
      <span className="text-xs font-bold uppercase text-[#b5820e]">
        {new Date().toLocaleDateString("pt-PT", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })}
      </span>
    </div>
  </section>
)}


      {loading ? (
        <p className="text-center py-20 text-gray-400 animate-pulse">
          Carregando sua agenda...
        </p>
      ) : (
        <>
          {view === "home" && (
            <div className="space-y-10">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                <StatCard
                  title="Agendamentos de hoje"
                  value={agendaDeHoje.length}
                  icon={List}
                />{" "}
                <StatCard
                  title="agendamentos futuros"
                  value={agendaCompleta.length}
                  icon={Calendar}
                  onClick={() => setView("agenda")}
                />
                <StatCard
                  title="Agendamentos Concluídos"
                  value={historicoConcluidos.length}
                  icon={Clock}
                  onClick={() => setView("historico")}
                />{" "}
                <StatCard
                  title="Ver minha agenda"
                  value={""}
                  icon={ListCheck}
                  onClick={() => setView("ver")}
                />
              </div>

              <div className="space-y-4">
                <div className="border-l-4 border-[#b5820e] pl-4">
                  <h2 className="text-2xl font-black uppercase text-gray-800">
                    Agenda de Hoje
                  </h2>
                  <span className="text-sm text-[#b5820e] font-bold">
                    {hoje.display}
                  </span>
                </div>
                <div className="mt-6 space-y-4">
                  {agendaDeHoje.length > 0 ? (
                    agendaDeHoje.map((item) => (
                      <Agenda_Item key={item.id} {...item} />
                    ))
                  ) : (
                    <div className="p-10 border-2 border-dashed rounded-3xl text-center text-gray-400 italic">
                      Nenhum agendamento para hoje ({hoje.display}).
                      {agenda.length > 0 &&
                        " Existem agendamentos em outras datas."}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {view === "agenda" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-black mb-6 uppercase">
                Minha Agenda Completa
              </h2>
              {agendaCompleta.length > 0 ? (
                agendaCompleta.map((item) => (
                  <Agenda_Item key={item.id} {...item} />
                ))
              ) : (
                <p className="text-gray-500">Nenhum serviço futuro.</p>
              )}
            </div>
          )}

          {view === "historico" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-black mb-6 uppercase text-green-700">
                Meu Histórico
              </h2>
              {historicoConcluidos.length > 0 ? (
                historicoConcluidos.map((item) => (
                  <Agenda_Item key={item.id} {...item} clickable={false} />
                ))
              ) : (
                <p className="text-gray-500">Nenhum serviço concluído ainda.</p>
              )}
            </div>
          )}

          {view === "ver" && <PanoramaDisponibilidade />}
        </>
      )}
    </div>
  );
}

function StatCard({ title, value, icon: Icon, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className="bg-white border border-[#b5820e] rounded-3xl p-8 cursor-pointer shadow-sm hover:shadow-md transition-all active:scale-95"
    >
      <Icon size={24} className="text-[#b5820e] mb-4" />
      <p className="text-[10px] uppercase text-gray-400 font-black tracking-widest">
        {title}
      </p>
      <p className="text-3xl font-black text-black mt-1">{value}</p>
    </div>
  );
}
