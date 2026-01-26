import React, { useState, useEffect, useMemo } from "react";
import {
  Calendar,
  Clock,
  ChevronLeft,
  Star,
  Plus,
  History,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { FuncionarioService } from "../services/Funcionario.service";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";




// Imports de Componentes
import { Agenda_Item } from "../components/Agenda_Item";
import { Gestao_Disponibilidade } from "../components/Gestao_Disponibilidade";
import { Form_Agendamento_Funcionario } from "../components/Form_Agendamento_Funcionario";
import { Lista_Clientes } from "../components/Lista_Clientes";
import { safeArray } from "../utils/dataHelpers";
import { PanoramaDisponibilidade } from "../components/PanoramaDisponibilidade";

export function DashboardFuncionario() {
  const [view, setView] = useState<
    "home" | "agenda" | "historico" | "disponibilidade" | "novo"|"ver"
  >("home");
  const [agenda, setAgenda] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Estado para o modal de remarcação
  const [remarcandoItem, setRemarcandoItem] = useState<any | null>(null);
  const [novaDataHora, setNovaDataHora] = useState("");

  const hojeISO = new Date().toLocaleDateString("sv-SE");
  const hojeDisplay = new Date().toLocaleDateString("pt-PT");
dayjs.extend(utc);
dayjs.extend(timezone);

const FUSO_CABO_VERDE = "Atlantic/Cape_Verde";
  const carregarDados = async () => {
    try {
      setLoading(true);
      const dados = await FuncionarioService.listarMinhaAgenda();
      const agendaArray = safeArray<any>(dados);

     const agendaFormatada = agendaArray
  .map((item: any) => {
    if (!item.data_hora_inicio) return null;

    const dataHoraCVE = dayjs
      .utc(item.data_hora_inicio)
      .tz(FUSO_CABO_VERDE);

    return {
      id: item.id,
      cliente: item.nome_cliente || "Cliente",
      telefone: item.telefone_cliente || "",
      servico: item.profissional_nome
        ? `${item.nome_servico} • ${item.profissional_nome}`
        : item.nome_servico,
      dataISO: dataHoraCVE.format("YYYY-MM-DD"),
      data: dataHoraCVE.format("YYYY-MM-DDTHH:mm:ss"),
      hora: dataHoraCVE.format("HH:mm"),
      timestamp: dataHoraCVE.valueOf(),
      status: String(item.status || "pendente").toLowerCase().trim(),
    };
  })
  .filter(Boolean);


      setAgenda(agendaFormatada);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, [view]);

  // --- 2. LÓGICA DE FILTRAGEM ---
  const agendaDeHoje = useMemo(() => {
    return agenda
      .filter(
        (item) =>
          item.dataISO === hojeISO &&
          (item.status === "confirmado" || item.status === "reagendado"),
      )
      .sort((a, b) => a.timestamp - b.timestamp); // use timestamp para consistência
  }, [agenda, hojeISO]);

  const proximosAgendamentos = useMemo(() => {
    return agenda
      .filter(
        (item) =>
          item.dataISO > hojeISO && // só dias futuros
          (item.status === "confirmado" || item.status === "reagendado"),
      )
      .sort((a, b) => a.timestamp - b.timestamp);
  }, [agenda, hojeISO]);

  const historicoAgendamentos = useMemo(() => {
    // pega o timestamp da meia-noite de hoje
    const hojeMeiaNoite = new Date();
    hojeMeiaNoite.setHours(0, 0, 0, 0); // 00:00:00
    const limite = hojeMeiaNoite.getTime();

    return agenda
      .filter(
        (item) =>
          item.status.toLowerCase() === "concluido" && // só concluídos
          item.timestamp < limite, // apenas passados do dia anterior
      )
      .sort((a, b) => b.timestamp - a.timestamp); // do mais recente para o mais antigo
  }, [agenda]);

  // --- 3. AÇÕES ---
  const handleConcluir = async (id: number) => {
    try {
      setLoading(true);
      const res = await FuncionarioService.concluirServico(id);
      if (res?.mensagem) {
        alert(res.mensagem);
        carregarDados();
      }
    } catch (error: any) {
      alert(error?.response?.data?.erro || "Erro ao concluir o serviço.");
    } finally {
      setLoading(false);
    }
  };
  const handleCancelar = async (id: number) => {
    if (!window.confirm("Deseja realmente cancelar este agendamento?")) return;

    try {
      setLoading(true);
      const res = await FuncionarioService.cancelarAgendamento(id);
      if (res?.mensagem) {
        alert(res.mensagem);
        carregarDados();
      }
    } catch (error: any) {
      alert(error?.response?.data?.erro || "Erro ao cancelar.");
    } finally {
      setLoading(false);
    }
  };

  // Dentro do componente DashboardFuncionario...

  const handleReagendar = async () => {
    if (!novaDataHora) return alert("Selecione a nova data e hora.");

    try {
      // 1. Corrigido para 'reagendarAgendamento' conforme seu Service
      await FuncionarioService.reagendarAgendamento(remarcandoItem.id, {
        nova_data_hora: novaDataHora,
      });

      alert("Reagendado com sucesso! ✅");
      setRemarcandoItem(null);
      setNovaDataHora("");
      carregarDados(); // Recarrega a lista
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.erro || "Erro ao reagendar.");
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 md:p-10">
      {/* HEADER */}
      <section className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gray-100 pb-10 gap-6">
        <div>
          {view !== "home" && (
            <button
              onClick={() => setView("home")}
              className="flex items-center gap-2 text-[#b5820e] font-bold text-xs uppercase mb-4 hover:underline"
            >
              <ChevronLeft size={16} /> Voltar ao Início
            </button>
          )}
          <h1 className="md:text-4xl text-2xl font-serif font-black text-black">
            {view === "historico"
              ? "Histórico de Atendimentos"
              : "Painel da Recepcionista"}
          </h1>
        </div>
        <div className="bg-amber-50 text-[#b5820e] px-6 py-2 rounded-xl shadow-sm border border-amber-100 flex items-center gap-3">
          <Calendar size={14} />
          <span className="text-xs font-bold uppercase">
            {new Date().toLocaleDateString("pt-PT", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
      </section>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
          <p className="text-gray-400 italic">Sincronizando agenda...</p>
        </div>
      ) : (
        <>
          {/* RENDERIZAÇÃO: HOME */}
          {view === "home" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 mb-12">
                <StatCard
                  title="Agendamentos de Hoje"
                  value={agendaDeHoje.length}
                  icon={Clock}
                  onClick={() => setView("agenda")}
                />
                <StatCard
                  title="Agendamentos Futuros"
                  value={proximosAgendamentos.length}
                  icon={Clock}
                  onClick={() => setView("agenda")}
                />
                <StatCard
                  title="Histórico de Agendamentos Passados"
                  value={historicoAgendamentos.length}
                  icon={Clock}
                  onClick={() => setView("historico")}
                />
                <StatCard
                  title=" Agenda dos Funcionarios"
                  value="VER"
                  icon={Plus}
                  onClick={() => setView("ver")}
                />
                <StatCard
                  title="Novo Agendamento"
                  value="Criar"
                  icon={Plus}
                  onClick={() => setView("novo")}
                />

              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
                <div className="md:col-span-2 space-y-6">
                  <h2 className="text-2xl font-black text-black uppercase italic mb-2">
                    Agenda de Hoje
                  </h2>
                  <span className="text-sm text-[#b5820e] font-bold">
                    {hojeDisplay}
                  </span>

                  <div className="space-y-4">
                    {agendaDeHoje.length > 0 ? (
                      agendaDeHoje.map((item) => (
                        <div key={item.id} className="relative group">
                          <Agenda_Item
                            {...item}
                            onCancelar={() => handleCancelar(item.id)}
                            onRemarcar={() => setRemarcandoItem(item)}
                          />
                          {(item.status === "confirmado" ||
                            item.status === "reagendado") && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleConcluir(item.id);
                              }}
                              className="absolute top-4 right-16 flex items-center gap-2 bg-green-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase hover:bg-green-700 transition-all shadow-md z-10"
                            >
                              <CheckCircle2 size={14} /> Concluir
                            </button>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="p-10 border-2 border-dashed rounded-3xl text-center text-gray-400 italic">
                        Nenhum atendimento confirmado para hoje ({hojeDisplay}).
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-8">
                  <CreateAppointmentCard onClick={() => setView("novo")} />
                  <div className="bg-black rounded-[2.5rem] p-10 text-white shadow-2xl">
                    <h3 className="text-xl font-bold text-[#b5820e] mb-4">
                      Configurar Agenda
                    </h3>
                    <button
                      onClick={() => setView("disponibilidade")}
                      className="w-full py-5 bg-[#b5820e] text-black rounded-2xl font-black uppercase text-xs"
                    >
                      Ajustar Disponibilidade
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* OUTRAS VIEWS */}
          {view === "historico" && (
            <div className="space-y-6">
              <div className="space-y-4">
                {historicoAgendamentos.map((item) => (
                  <Agenda_Item key={item.id} {...item} clickable={false} />
                ))}
              </div>
            </div>
          )}

          
          {view === "agenda" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black uppercase">
                Próximos Confirmados
              </h2>
              <div className="space-y-4">
                {proximosAgendamentos.map((item) => (
                  <div key={item.id} className="relative group">
                    <Agenda_Item
                      {...item}
                      onCancelar={() => handleCancelar(item.id)}
                    />
                    <button
                      onClick={() => handleConcluir(item.id)}
                      className="absolute top-4 right-16 bg-green-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase z-10"
                    >
                      Concluir
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* COMPONENTES EXTERNOS */}
      {view === "disponibilidade" && <Gestao_Disponibilidade />}
      {view ==="ver" &&
            <PanoramaDisponibilidade/>
          }

      {view === "novo" && (
        <Form_Agendamento_Funcionario
          onVoltar={() => setView("home")}
          onSubmit={carregarDados}
        />
      )}
      {/* MODAL DE REMARCAÇÃO */}
      {remarcandoItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-black mb-2 uppercase">
              Remarcar Atendimento
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Cliente: <strong>{remarcandoItem.cliente}</strong>
            </p>

            <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">
              Nova Data e Hora
            </label>
            <input
              type="datetime-local"
              className="w-full p-4 bg-gray-100 rounded-xl mb-6 font-bold"
              value={novaDataHora}
              onChange={(e) => setNovaDataHora(e.target.value)}
            />

            <div className="flex gap-3">
              <button
                onClick={() => setRemarcandoItem(null)}
                className="flex-1 py-4 font-bold text-gray-400 uppercase text-xs"
              >
                Voltar
              </button>
              <button
                // 2. Corrigido para 'handleReagendar'
                onClick={handleReagendar}
                className="flex-1 py-4 bg-[#b5820e] text-white rounded-xl font-black uppercase text-xs shadow-lg"
              >
                Confirmar Reagendamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Subcomponentes
function StatCard({ title, value, icon: Icon, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm cursor-pointer hover:-translate-y-1 transition-all"
    >
      <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
        <Icon size={24} className="text-[#b5820e]" />
      </div>
      <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">
        {title}
      </p>
      <p className="text-2xl font-black text-gray-900">{value}</p>
    </div>
  );
}

function CreateAppointmentCard({ onClick }: { onClick: () => void }) {
  return (
    <div className="relative overflow-hidden bg-black rounded-[3rem] p-10 text-white shadow-2xl group transition-all duration-500 hover:scale-[1.01] flex flex-col justify-between min-h-[320px]">
      {/* Elemento Decorativo de Fundo (Blur Dourado) */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#b5820e]/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-[#b5820e]/20 transition-colors duration-700" />

      <div className="relative z-10">
        <div className="w-12 h-12 bg-[#b5820e] rounded-2xl flex items-center justify-center mb-4 rotate-3 group-hover:rotate-0 transition-transform duration-500 shadow-[0_10px_30px_rgba(181,130,14,0.3)]">
          <Plus size={22} className="text-black stroke-[3px]" />
        </div>

        <h3 className="text-2xl font-serif font-bold text-white mb-4 italic leading-tight">
          Cria <br />
          <span className="text-[#b5820e] not-italic uppercase tracking-tighter">
            Novo Agendamento
          </span>
        </h3>

        <p className="text-gray-400 text-sm max-w-[300px] leading-relaxed">
          Agilize o atendimento registrando agendamento.
        </p>
      </div>

      <button
        onClick={onClick}
        className="relative z-10 mt-8 w-full group/btn flex items-center justify-between bg-[#b5820e] hover:bg-white text-black px-6 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all duration-300"
      >
        <span>Criar Agendamento</span>
        <div className="bg-black/10 group-hover/btn:bg-black/5 p-1 rounded-lg transition-colors">
          <Calendar size={18} />
        </div>
      </button>
    </div>
  );
}

