// src/pages/DashboardAdmin.tsx
import React, { useState, useEffect, useMemo } from "react";

import {
  listarAgendamentos,
  cancelarAgendamento,
  reagendarAgendamento,
  listarClientes,
  ativarCliente,
  desativarCliente,
  listarFuncionarios,
  atualizarFuncionario,
  removerFuncionario,
  criarFuncionario,
  listarServicos,
  criarServico,
  atualizarServico,
  PromocaoService,
  removerServico,
} from "../services/Admin.service";

import { AuditoriaService, LogEntry } from "../services/Auditoria.service";

import {
  DollarSign,
  Users,
  Calendar,
  TrendingUp,
  Scissors,
  Plus,
  ShieldCheck,
  FileText,
  BarChart3,
  Settings,
  ChevronLeft,
  List,
  ArrowUpRight,
  Pencil,
  Trash2,
} from "lucide-react";

// Importação dos teus componentes
import { Formulario_Servico } from "../components/Formulario_Servico";
import { Gerir_Funcionarios } from "../components/Gerir_Funcionarios";
import { Formulario_Funcionario } from "../components/Formulario_Funcionario";
import { Auditoria_Logs } from "../components/Auditoria_Logs";
import { Relatorios_Financeiros } from "../components/Relatorios_Financeiros";
import { Agendamentos_Lista } from "../components/Agendamentos_Lista";
import { Lista_Clientes } from "../components/Lista_Clientes";
import { Popularidade_Servicos } from "../components/Popularidade_Servicos";
import { Promocoes_Admin } from "../components/Promocoes_Admin";
import { Agenda_Item } from "../components/Agenda_Item";

// Configuração de Tempo (Sincronização Cabo Verde)
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);
const FUSO_CABO_VERDE = "Atlantic/Cape_Verde";

// =====================
// TIPOS
// =====================
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  onClick?: () => void;
}

interface ServiceBadgeProps {
  name: string;
  count: string;
  onEdit: () => void; // Adicionado
  onDelete: () => void; // Adicionado
}

interface Funcionario {
  id: number;
  nome: string;
  especialidade: string;
  email: string;
  telefone: string;
  data_nascimento: string;
  palavra_passe?: string;
  status: "Ativo" | "Inativo";
}

export interface Agendamento {
  id: number;
  cliente: string;
  servico: string;
  profissional: string;
  data: string;
  hora: string;
  dataISO: string;
  timestamp: number;
  telefone?: string;
  status: "confirmado" | "pendente" | "cancelado" | "reagendado" | "concluido";
}

interface Servico {
  id: number;
  nome: string;
  duracao: number;
  preco: number;
  ativo: boolean;
}

export interface Promocao {
  id: number;
  titulo: string; // Antes era 'nome'
  validade: string; // Antes era 'data_fim'
  servicos_ids: number[];
  ativo: boolean;
}

export function DashboardAdmin() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [logsAuditoria, setLogsAuditoria] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const onVoltar = () => {
    setView("home");
  };

  const formatarDataExibicao = (dataStr: any) => {
    if (!dataStr) return "Data não definida";
    const data = new Date(dataStr);
    if (isNaN(data.getTime())) return "Data inválida";

    return data.toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // 2. Função para carregar agendamentos do Back-end
  const hojeISO = useMemo(
    () => dayjs().tz(FUSO_CABO_VERDE).format("YYYY-MM-DD"),
    [],
  );

  const carregarAgendamentos = async () => {
    try {
      setLoading(true);
      const dados = await listarAgendamentos();
      const agendamentosArray = Array.isArray(dados)
        ? dados
        : dados?.data || [];

      const formatados = agendamentosArray
        .map((item: any) => {
          if (!item.data_hora_inicio) return null;

          // ✅ LÓGICA IDÊNTICA AO PROFISSIONAL:
          // Interpreta o que vem do banco como UTC e converte para Cabo Verde
          const dtCVE = dayjs
            .utc(item.data_hora_inicio)
            .tz(FUSO_CABO_VERDE)
            .subtract(1, "hour");

          return {
            id: item.id,
            cliente: item.cliente_nome || item.nome_cliente || "Sem nome",
            servico: item.nome_servico || "",
            profissional: item.profissional_nome || "",
            // Usamos dataIso (com 'o' minúsculo) para parear com o que você tem no Profissional
            dataIso: dtCVE.format("YYYY-MM-DD"),
            data: dtCVE.toDate(),
            hora: dtCVE.format("HH:mm"),
            timestamp: dtCVE.valueOf(),
            telefone: item.cliente_telefone || item.telefone_cliente || "",
            status: (item.status || "pendente")
              .toLowerCase()
              .trim()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, ""), // Remove acentos como no profissional
          };
        })
        .filter(Boolean);

      // Ordenação por horário real (timestamp)
      const ordenados = formatados.sort(
        (a: any, b: any) => a.timestamp - b.timestamp,
      );
      setAgendamentos(ordenados);
    } catch (error) {
      console.error("Erro ao carregar agendamentos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar agendamentos de hoje baseado na data de Cabo Verde
  const agendamentosHoje = useMemo(() => {
    return agendamentos.filter((item: any) => item.dataIso === hojeISO);
  }, [agendamentos, hojeISO]);

  // 3. Carregar assim que o componente montar
  useEffect(() => {
    carregarAgendamentos();
    carregarClientes();
    carregarFuncionarios();
    carregarServicos();
  }, []);

  // 4. Função para CANCELAR
  const handleCancelar = async (id: number) => {
    if (window.confirm("Deseja realmente cancelar este agendamento?")) {
      try {
        await cancelarAgendamento(id);
        alert("Cancelado com sucesso!");
        carregarAgendamentos(); // 🔄 Recarrega a lista após cancelar
      } catch (error) {
        alert("Erro ao cancelar agendamento.");
      }
    }
  };

  // 5. Função para REAGENDAR (Exemplo simples com prompt)
  const handleReagendar = async (id: number) => {
    const novaData = prompt("Nova Data (AAAA-MM-DD):");
    const novaHora = prompt("Nova Hora (HH:MM):");

    if (novaData && novaHora) {
      try {
        await reagendarAgendamento(id, { data: novaData, hora: novaHora });
        alert("Reagendado com sucesso!");
        carregarAgendamentos(); // 🔄 Recarrega a lista
      } catch (error) {
        alert("Erro ao reagendar.");
      }
    }
  };

  // Estados
  const [view, setView] = useState<
    | "home"
    | "equipa"
    | "novo-funcionario"
    | "logs"
    | "financeiro"
    | "todos-agendamentos"
    | "clientes"
    | "popularidade_servicos"
    | "promocoes"
    | "hoje"
  >("home");

  ///////////////////////////////////////////////
  ///clientes
  const [clientes, setClientes] = useState<any[]>([]);

  // 2. Função para carregar clientes
  const carregarClientes = async () => {
    try {
      const dados = await listarClientes();

      // Mapear dados do backend para o formato esperado
      const clientesArray = Array.isArray(dados) ? dados : dados?.data || [];

      const clientesFormatados = clientesArray.map((item: any) => ({
        id: item.id,
        nome: item.usuario?.nome || item.nome || "Sem nome",
        apelido: item.usuario?.apelido || item.apelido || "",
        email: item.usuario?.email || item.email || "",
        telefone: item.usuario?.numero_telefone || item.telefone || "",
        ativo: item.usuario?.ativo !== false && item.ativo !== false,
        desde: item.criado_em || new Date().toISOString().split("T")[0],
      }));

      setClientes(clientesFormatados);
      console.log("[DEBUG] Clientes formatados:", clientesFormatados);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
      setClientes([]);
    }
  };

  // 3. Chamar o carregamento quando a view mudar para clientes
  // 4. Função para alternar status (Ativar/Desativar)
  const handleToggleCliente = async (id: number, statusAtual: string) => {
    try {
      if (statusAtual === "Ativo") {
        await desativarCliente(id);
        alert("Cliente desativado.");
      } else {
        await ativarCliente(id);
        alert("Cliente ativado.");
      }
      carregarClientes(); // 🔄 recarrega a lista
    } catch (error) {
      alert("Erro ao alterar status do cliente.");
    }
  };

  // No topo do componente DashboardAdmin, depois de carregar clientes
  const handleAtivarCliente = (id: number) => {
    const cliente = clientes.find((c) => c.id === id);
    if (cliente) handleToggleCliente(id, "Inativo");
  };

  const handleDesativarCliente = (id: number) => {
    const cliente = clientes.find((c) => c.id === id);
    if (cliente) handleToggleCliente(id, "Ativo");
  };

  ////////////////////////////////////////777
  //funcionarios
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);

  // 2. Função para buscar do Back-end
  const carregarFuncionarios = async () => {
    try {
      const dados = await listarFuncionarios();

      // Mapear dados do backend para o formato esperado
      const funcionariosArray = Array.isArray(dados)
        ? dados
        : dados?.data || [];

      const funcionariosFormatados = funcionariosArray.map((item: any) => ({
        id: item.id,
        nome: item.usuario?.nome || item.nome || "Sem nome",
        especialidade: item.funcao_especialidade || item.especialidade || "",
        email: item.usuario?.email || item.email || "",
        telefone: item.usuario?.numero_telefone || item.telefone || "",
        nascimento: item.usuario?.data_nascimento || item.nascimento || "",
        status: item.ativo !== false ? "Ativo" : "Inativo",
      }));

      setFuncionarios(funcionariosFormatados);
      console.log("[DEBUG] Funcionários formatados:", funcionariosFormatados);
    } catch (error) {
      console.error("Erro ao carregar funcionários:", error);
      setFuncionarios([]);
    }
  };

  // 3. Função para Remover
  const handleRemover = async (id: number) => {
    if (
      window.confirm(
        "Tem certeza que deseja apagar este funcionário permanentemente?",
      )
    ) {
      try {
        await removerFuncionario(id);
        alert("Funcionário removido com sucesso!");
        carregarFuncionarios(); // Recarrega a lista
      } catch (error) {
        alert(
          "Erro ao remover: este profissional pode ter agendamentos registrados.",
        );
      }
    }
  };

  ////////////////////////////////////////
  //Servicos
  const [servicoParaEditar, setServicoParaEditar] = useState<
    Servico | undefined
  >(undefined);

  const carregarServicos = async () => {
    try {
      const dados = await listarServicos();

      // Mapear dados do backend para o formato esperado
      const servicosArray = Array.isArray(dados) ? dados : dados?.data || [];

      const servicosFormatados = servicosArray.map((item: any) => ({
        id: item.id,
        nome: item.nome_servico || item.nome || "",
        duracao: item.duracao_minutos || item.duracao || 0,
        preco: item.preco || 0,
        ativo: item.ativo !== false,
      }));

      setServicos(servicosFormatados);
      console.log("[DEBUG] Serviços formatados:", servicosFormatados);
    } catch (error) {
      console.error("Erro ao carregar serviços:", error);
      setServicos([]);
    }
  };

  const handleSalvarServico = async (dados: any) => {
    try {
      if (servicoParaEditar) {
        // Se estamos editando
        await atualizarServico(servicoParaEditar.id, dados);
        alert("Serviço atualizado com sucesso!");
      } else {
        // Se é um novo serviço
        await criarServico(dados);
        alert("Serviço criado com sucesso!");
      }
      setShowServicoModal(false);
      setServicoParaEditar(undefined);
      carregarServicos(); //  Atualiza lista
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar o serviço.");
    }
  };

  const handleRemoverServico = async (id: number) => {
    // Mudamos a mensagem para alertar sobre a exclusão permanente
    const confirmacao = window.confirm(
      "ATENÇÃO: Este serviço será apagado PERMANENTEMENTE do sistema. Esta ação não pode ser desfeita. Deseja continuar?",
    );

    if (confirmacao) {
      try {
        await removerServico(id);
        alert("Serviço apagado com sucesso!");
        carregarServicos();
      } catch (error: any) {
        // Se o backend retornar o erro de agendamentos vinculados (400)
        const msgErro =
          error.response?.data?.erro || "Erro ao remover serviço.";
        alert(msgErro);
      }
    }
  };

  ///////////////////////////////////77
  ///Promocoes
  // ESTADOS
  const [promocoes, setPromocoes] = useState<Promocao[]>([]);
  const formatDate = (dateStr: string) => new Date(dateStr + "T00:00:00");

  const carregarPromocoes = async () => {
    try {
      const dados = await PromocaoService.listar();
      const promosArray = Array.isArray(dados) ? dados : dados?.data || [];

      const formatadas = promosArray.map((p: any) => ({
        ...p,
        // Garante compatibilidade independente de como o back retorna
        titulo: p.titulo || p.nome || "Promoção Sem Nome",
        validade: p.validade || p.data_fim || p.data_validade,
      }));

      setPromocoes(formatadas);
      console.log("[DEBUG] Promoções carregadas no Admin:", formatadas);
    } catch (error) {
      console.error("Erro ao carregar promoções:", error);
    }
  };

  const handleAtivarPromocao = async (id: number) => {
    try {
      // Chamamos o serviço passando o estado 'ativo: true'
      await PromocaoService.atualizar(id, { ativo: true });
      alert("Promoção ativada com sucesso!");
      carregarPromocoes(); //  Atualiza a lista para refletir a mudança
    } catch (error) {
      console.error(error);
      alert("Erro ao ativar promoção.");
    }
  };

  const handleDesativarPromocao = async (id: number) => {
    try {
      // Chamamos o serviço passando o estado 'ativo: false'
      await PromocaoService.atualizar(id, { ativo: false });
      alert("Promoção desativada.");
      carregarPromocoes(); //  Atualiza a lista
    } catch (error) {
      console.error(error);
      alert("Erro ao desativar promoção.");
    }
  };

  


  

  useEffect(() => {
    carregarPromocoes();
  }, [view]);

  ////////////////////////////
  ////logs do sistema
  const carregarAuditoria = async () => {
    try {
      const data = await AuditoriaService.listar();
      setLogsAuditoria(data);
    } catch (error) {
      console.error("Erro ao carregar auditoria", error);
      alert("Erro ao carregar logs de auditoria");
    }
  };
  useEffect(() => {
    carregarAuditoria();
  }, [view]);

  const [showServicoModal, setShowServicoModal] = useState(false);
  const [funcionarioSelecionado, setFuncionarioSelecionado] =
    useState<any>(null);

  const abrirEdicao = (func: any) => {
    setFuncionarioSelecionado(func);
    setView("novo-funcionario");
  };

  /////////////////////////////////////////////////
  /////////
  const normalizarDataCVE = (dataHora: string) => {
    const d = dayjs.utc(dataHora).tz(FUSO_CABO_VERDE);

    return {
      dataISO: d.format("YYYY-MM-DD"),
      data: d.format("YYYY-MM-DDTHH:mm:ss"),
      hora: d.format("HH:mm"),
      timestamp: d.valueOf(),
    };
  };

  // =====================
  // CÁLCULOS REAIS
  // =====================

  // Data de hoje

  const clientesUnicos = new Set(agendamentos.map((item) => item.cliente));

  const contagemServicos: Record<string, number> = {};
  agendamentos.forEach((item) => {
    contagemServicos[item.servico] = (contagemServicos[item.servico] || 0) + 1;
  });

  const servicoMaisPopular =
    Object.entries(contagemServicos).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

  const faturamentoDiario = useMemo(() => {
    return agendamentos
      .filter(
        (item) =>
          dayjs(item.dataISO).format("YYYY-MM-DD") === hojeISO &&
          item.status === "concluido", // minúsculo garantido no carregamento
      )
      .reduce((total, item) => {
        const s = servicos.find((serv) => serv.nome === item.servico);
        return total + (s ? Number(s.preco) : 0);
      }, 0);
  }, [agendamentos, servicos, hojeISO]);

  const totalFuncionarios = funcionarios.length;

  const parseDate = (dateStr: any) => {
    if (!dateStr) return null;

    // Tenta criar o objeto Date diretamente da string
    const d = new Date(dateStr);

    // Verifica se a data é válida
    return isNaN(d.getTime()) ? null : d;
  };

  return (
    <div className="min-h-screen bg-white sm:p-8 md:px-20 md:py-10">
      {/* ===== HOME ===== */}
      {view === "home" && (
        <>
          <header className="mb-6 sm:mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 sm:gap-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-black">
                Bem vinda, Administradora!{" "}
              </h1>
              <p className="text-gray-500 mt-2 text-sm sm:text-lg font-medium italic">
                "Transformando visão em excelência: o sucesso da Maddie Beuty
                Boutique começa na sua liderança"
              </p>
            </div>
            <div className="flex items-end">
              <div className="flex items-center gap-2 text-[#b5820e] px-4 py-2 rounded-xl shadow-lg border-b-2 border-[#b5820e] text-xs sm:text-sm font-bold">
                <Calendar size={16} className="sm:mr-1" />
                <span>
                  {new Date().toLocaleDateString("pt-PT", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </header>

          {/* ===== STATS ===== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-4 mb-20 md:mb-25">
            <StatCard
              onClick={() => setView("hoje")}
              title="Agendamentos so de Hoje"
              value={agendamentosHoje.length}
              icon={<List className="text-purple-500" />}
              color="bg-purple-50"
            />
            <StatCard
              onClick={() => setView("todos-agendamentos")}
              title="Todos os Agendamentos"
              value={agendamentos.length}
              icon={<Calendar className="text-purple-500" />}
              color="bg-purple-50"
            />

            <StatCard
              onClick={() => setView("clientes")}
              title="Clientes Ativos"
              value={clientes.filter((c) => c.ativo).length}
              icon={<Users className="text-blue-500" />}
              color="bg-blue-50"
            />

            <StatCard
              onClick={() => setView("equipa")}
              title="Funcionários"
              value={totalFuncionarios}
              icon={<Scissors className="text-pink-600" />}
              color="bg-pink-50"
            />
            <StatCard
              onClick={() => setView("financeiro")}
              title="Faturamento Diário"
              value={`${faturamentoDiario.toLocaleString()} CVE`}
              icon={<DollarSign className="text-[#b5820e]" />}
              color="bg-amber-50"
            />

            <StatCard
              onClick={() => setView("popularidade_servicos")}
              title="Serviço Mais Procurado"
              value={servicoMaisPopular}
              icon={<TrendingUp className="text-green-500" />}
              color="bg-green-100"
            />
          </div>

          {/* ===== AGENDAMENTOS & SERVIÇOS ===== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 max-w-full gap-4 sm:gap-6 mb-10 sm:mb-8">
            {/* Agendamentos */}

            <div className=" rounded-3xl  border border-gray-300 p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-black">
                  Agendamentos Recentes
                </h2>
                <button
                  onClick={() => setView("todos-agendamentos")}
                  className="text-[9px] sm:text-xs font-bold text-[#b5820e] uppercase tracking-widest hover:underline"
                >
                  Ver Tudo →
                </button>
              </div>

              <div className="space-y-4">
                {loading ? (
                  <p className="text-gray-400 italic text-center py-10">
                    Sincronizando fuso horário...
                  </p>
                ) : agendamentosHoje.length > 0 ? (
                  agendamentosHoje
                    .slice(0, 5)
                    .map((item: any) => (
                      <Agenda_Item
                        key={item.id}
                        {...item}
                        dataIso={item.dataIso}
                        servico={`${item.servico} • ${item.profissional}`}
                        clickable={true}
                        onItemClick={() => setView("todos-agendamentos")}
                        onCancelar={() => handleCancelar(item.id)}
                        onRemarcar={() => handleReagendar(item.id)}
                      />
                    ))
                ) : (
                  <div className="p-10 border-2 border-dashed rounded-3xl text-center text-gray-400 italic">
                    Nenhum agendamento para hoje (
                    {dayjs().tz(FUSO_CABO_VERDE).format("DD/MM/YYYY")}).
                  </div>
                )}
              </div>
            </div>

            {/* Serviços Disponíveis: falta o botao para remover e editar servico */}

            {/* Serviços Disponíveis */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-4 sm:p-6 text-center mt-10">
              <h2 className="text-lg sm:text-xl font-bold text-black mb-4 sm:mb-6 text-left">
                Serviços Disponíveis
              </h2>
              <div className="max-h-[300px] overflow-y-auto pr-2">
                {" "}
                {/* Adicionado scroll se tiver muitos */}
                {servicos.map((servico) => (
                  <ServiceBadge
                    key={servico.id}
                    name={servico.nome}
                    count={`${servico.preco} esc`}
                    onEdit={() => {
                      setServicoParaEditar(servico);
                      setShowServicoModal(true);
                    }}
                    onDelete={() => handleRemoverServico(servico.id)}
                  />
                ))}
              </div>

              <button
                onClick={() => {
                  setServicoParaEditar(undefined); // Garante que o modal venha vazio
                  setShowServicoModal(true);
                }}
                className="w-full mt-4 sm:mt-6 py-2 sm:py-3 border-2 border-dashed border-[#b5820e] text-[#b5820e] rounded-2xl font-bold flex items-center justify-center gap-1 sm:gap-2 hover:bg-amber-50 transition"
              >
                <Plus size={16} /> Novo Serviço
              </button>
            </div>
          </div>

          {/* ===== FINANCEIRO, EQUIPA, LOGS & PROMOÇÕES ===== */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 sm:gap-6">
            {/* Financeiro */}
            {/* Vendas & Lucro */}
            <div className="bg-[#0a0a0a] text-white rounded-[2rem] shadow-2xl border border-gray-800 p-6 flex flex-col justify-between group hover:border-[#b5820e]/50 transition-all duration-500">
              {/* TOPO: Título e Ícone */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-serif font-black uppercase tracking-tighter text-white">
                    Vendas & Lucro
                  </h2>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" />
                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                      Live: Atualização em tempo real
                    </p>
                  </div>
                </div>
                <div className="p-3 bg-gray-900 rounded-2xl group-hover:bg-[#b5820e] transition-colors duration-500">
                  <TrendingUp
                    className="text-[#b5820e] group-hover:text-black"
                    size={20}
                  />
                </div>
              </div>

              {/* MEIO: Visualização de Dados Rápida */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">
                      Faturamento Hoje
                    </p>
                    <p className="text-2xl font-black text-white">
                      {faturamentoDiario.toLocaleString()}
                      <span className="text-xs font-normal text-[#b5820e] ml-1">
                        CVE
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">
                      Margem
                    </p>
                    <p className="text-sm font-bold text-green-500">+12.5%</p>
                  </div>
                </div>

                {/* Barra de Progresso Simbólica (Meta Mensal) */}
                <div className="h-1.5 w-full bg-gray-900 rounded-full overflow-hidden">
                  <div className="h-full bg-[#b5820e] rounded-full w-[65%] shadow-[0_0_10px_#b5820e]" />
                </div>
              </div>

              {/* BOTÃO: Ação Principal */}
              <button
                onClick={() => setView("financeiro")}
                className="group/btn w-full py-4 bg-gray-900 hover:bg-[#b5820e] text-white hover:text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all duration-300 border border-gray-800 hover:border-[#b5820e]"
              >
                <FileText
                  size={16}
                  className="text-[#b5820e] group-hover/btn:text-black"
                />
                Análise Detalhada
                <ArrowUpRight
                  size={14}
                  className="opacity-0 group-hover/btn:opacity-100 transition-all translate-x-[-10px] group-hover/btn:translate-x-0"
                />
              </button>
            </div>

            {/* Equipa */}
            <div className="bg-gray-800 text-white rounded-3xl shadow-sm border border-gray-700 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold">Corpo Técnico</h2>
                <Settings className="text-gray-400" size={18} />
              </div>

              <div className="flex flex-col gap-2 sm:gap-3">
                {/* Verificamos se existem funcionários carregados */}
                {funcionarios.length === 0 ? (
                  <p className="text-gray-500 text-xs italic">
                    Nenhum profissional registado.
                  </p>
                ) : (
                  // Exibimos apenas os 3 primeiros na Home para não ocupar muito espaço
                  funcionarios.slice(0, 3).map((func) => (
                    <div
                      key={func.id}
                      className="flex items-center justify-between p-2 sm:p-3 border-l-4 border-[#b5820e] bg-gray-900 rounded-r-xl"
                    >
                      <span className="text-[10px] sm:text-sm font-bold">
                        {func.nome}
                      </span>

                      {/* Status dinâmico: verde se Ativo, vermelho se Inativo */}
                      <span
                        className={`text-[8px] sm:text-[10px] px-2 py-1 rounded-md font-bold uppercase ${
                          func.status === "Ativo"
                            ? "text-green-400 bg-green-900"
                            : "text-red-400 bg-red-900"
                        }`}
                      >
                        {func.status}
                      </span>
                    </div>
                  ))
                )}

                <button
                  onClick={() => setView("equipa")}
                  className="w-full mt-2 py-2 sm:py-3 bg-[#b5820e] text-black rounded-2xl font-bold text-xs sm:text-sm hover:opacity-90 transition"
                >
                  {/* Mostra o total real de funcionários no botão */}
                  Gerir Profissionais ({funcionarios.length})
                </button>
              </div>
            </div>

            {/* Logs */}
            {/* Logs Dinâmicos na Home */}
            <div className="bg-gray-800 rounded-3xl p-4 sm:p-6 shadow-xl text-white">
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <ShieldCheck className="text-[#b5820e]" size={18} />
                <h2 className="text-lg sm:text-xl font-bold">Logs Sistema</h2>
              </div>

              <div className="space-y-2 sm:space-y-4 font-mono text-[8px] sm:text-[10px] text-gray-400">
                {logsAuditoria.length === 0 ? (
                  <p className="italic">Nenhuma atividade registada.</p>
                ) : (
                  // Exibe os 3 logs mais recentes
                  logsAuditoria.slice(0, 3).map((log, index) => (
                    <p key={index}>
                      <span className="text-[#b5820e]">
                        [
                        {new Date(log.data_hora).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        ]
                      </span>{" "}
                      {log.usuario_nome?.toUpperCase()}: {log.acao}
                    </p>
                  ))
                )}
              </div>

              <button
                onClick={() => setView("logs")}
                className="w-full mt-4 sm:mt-6 py-1 sm:py-2 text-[#b5820e] border border-[#b5820e] rounded-xl text-[9px] sm:text-xs font-bold hover:bg-[#b5820e] hover:text-black transition"
              >
                Ver Auditoria Completa ({logsAuditoria.length})
              </button>
            </div>

            {/* Promoções */}
            {/* Card de Promoções Dinâmico na Home */}
            <div className="bg-gray-800 text-white rounded-[2rem] shadow-xl border border-gray-700 p-6 flex flex-col justify-between group hover:border-[#b5820e]/30 transition-all duration-500">
              {/* CABEÇALHO DO CARD */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-serif font-black uppercase tracking-tighter text-[#b5820e]">
                    Campanhas & Promoções
                  </h2>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="h-1.5 w-1.5 bg-[#b5820e] rounded-full animate-pulse" />
                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                      {promocoes.length} campanhas no total
                    </p>
                  </div>
                </div>
                <div className="p-3 bg-gray-900 rounded-2xl">
                  <TrendingUp className="text-[#b5820e]" size={20} />
                </div>
              </div>

              {/* LISTA DE PROMOÇÕES (SÓ AS 2 PRIMEIRAS) */}
              <div className="space-y-3">
                {promocoes.length === 0 ? (
                  <div className="py-8 text-center border-2 border-dashed border-gray-700 rounded-2xl">
                    <p className="text-gray-500 text-xs italic">
                      Nenhuma promoção registada.
                    </p>
                  </div>
                ) : (
                  promocoes.slice(0, 2).map((promo) => (
                    <div
                      key={promo.id}
                      className="flex items-center justify-between p-4 bg-gray-900/50 rounded-2xl border border-gray-700/50 hover:border-[#b5820e]/50 transition-colors"
                    >
                      <div className="flex flex-col">
                        <p className="text-sm font-black text-white uppercase tracking-tight">
                          {promo.titulo}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar size={12} className="text-[#b5820e]" />
                          <p className="text-[10px] font-bold text-gray-500 uppercase">
                            Até {formatarDataExibicao(promo.validade)}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest ${
                          promo.ativo
                            ? "text-green-400 bg-green-900/30 border border-green-900"
                            : "text-red-500 bg-red-900/30 border border-red-900"
                        }`}
                      >
                        {promo.ativo ? "Ativa" : "Inativa"}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* BOTÃO DE AÇÃO */}
              <button
                onClick={() => setView("promocoes")}
                className="w-full mt-6 py-4 bg-[#b5820e] text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-white transition-all duration-300 shadow-lg shadow-[#b5820e]/10"
              >
                <Plus size={16} />
                Gerir Ofertas de Luxo
              </button>
            </div>
          </div>
        </>
      )}
      {view === "hoje" && (
        <div className="space-y-4">
          <button
            onClick={onVoltar}
            className="p-3 bg-white/10 rounded-full text-[#b5820e] hover:bg-[#b5820e] hover:text-black transition-all"
          >
            <ChevronLeft size={24} />
          </button>

          {loading ? (
            <p className="text-gray-400 italic text-center py-10">
              Sincronizando fuso horário...
            </p>
          ) : agendamentosHoje.length > 0 ? (
            agendamentosHoje
              .slice(0, 5)
              .map((item: any) => (
                <Agenda_Item
                  key={item.id}
                  {...item}
                  dataIso={item.dataIso}
                  servico={`${item.servico} • ${item.profissional}`}
                  clickable={true}
                  onItemClick={() => setView("todos-agendamentos")}
                  onCancelar={() => handleCancelar(item.id)}
                  onRemarcar={() => handleReagendar(item.id)}
                />
              ))
          ) : (
            <div className="p-10 border-2 border-dashed rounded-3xl text-center text-gray-400 italic">
              Nenhum agendamento para hoje (
              {dayjs().tz(FUSO_CABO_VERDE).format("DD/MM/YYYY")}).
            </div>
          )}
        </div>
      )}

      {/* ===== VIEWS DINÂMICAS ===== */}
      {view === "promocoes" && (
        <Promocoes_Admin
          promocoes={promocoes}
          servicosReais={servicos}
          onVoltar={() => setView("home")}
          onAtivar={handleAtivarPromocao} // Passa a função de ativar
          onDesativar={handleDesativarPromocao} // Passa a função de desativar
          onAtualizar={carregarPromocoes} // <--- ESSA É A FUNÇÃO DE ATUALIZAR
        />
      )}

      {view === "popularidade_servicos" && (
        <Popularidade_Servicos
          agendamentos={agendamentos} //  Passa os dados reais aqui
          onVoltar={() => setView("home")}
        />
      )}
      {view === "clientes" && (
        <Lista_Clientes
          clientes={clientes}
          onVoltar={() => setView("home")}
          onAtivar={handleAtivarCliente}
          onDesativar={handleDesativarCliente}
        />
      )}
      {view === "todos-agendamentos" && (
        <Agendamentos_Lista
          agendamentos={agendamentos} // Passa a lista do banco
          onVoltar={() => setView("home")}
          onCancelar={handleCancelar} // Passa a função de cancelar
          onReagendar={handleReagendar} // Passa a função de reagendar
        />
      )}
      {view === "financeiro" && (
        <Relatorios_Financeiros
          agendamentos={agendamentos}
          servicos={servicos}
          onVoltar={() => setView("home")} // Faz voltar para a home
        />
      )}

      {view === "logs" && (
        <Auditoria_Logs logs={logsAuditoria} onVoltar={() => setView("home")} />
      )}
      {view === "equipa" && (
        <Gerir_Funcionarios
          funcionarios={funcionarios}
          onVoltar={() => setView("home")}
          onNovoFuncionario={() => {
            setFuncionarioSelecionado(null);
            setView("novo-funcionario");
          }}
          onEditarFuncionario={(func: Funcionario) => {
            setFuncionarioSelecionado(func);
            setView("novo-funcionario");
          }}
          onRemover={handleRemover}
        />
      )}

      {view === "novo-funcionario" && (
        <Formulario_Funcionario
          funcionarioParaEditar={funcionarioSelecionado}
          onVoltar={() => setView("equipa")}
          onSalvar={async (dados) => {
            try {
              if (funcionarioSelecionado) {
                // Se existe um selecionado, é EDIÇÃO (PUT)
                await atualizarFuncionario(funcionarioSelecionado.id, dados);
                alert("Funcionário atualizado!");
              } else {
                // Se não existe, é NOVO (POST)
                await criarFuncionario(dados);
                alert("Funcionário criado com sucesso!");
              }
              carregarFuncionarios(); // 🔄 Atualiza a lista global
              setView("equipa"); // Volta para a listagem
            } catch (error) {
              alert("Erro ao salvar funcionário. Verifique os dados.");
            }
          }}
        />
      )}

      {/* MODAL NOVO SERVIÇO */}
      {showServicoModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => {
            setShowServicoModal(false);
            setServicoParaEditar(undefined);
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-6 rounded-3xl w-full max-w-md"
          >
            <Formulario_Servico
              onVoltar={() => {
                setShowServicoModal(false);
                setServicoParaEditar(undefined);
              }}
              onSubmit={handleSalvarServico}
              servicoParaEditar={servicoParaEditar}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ===== COMPONENTES AUXILIARES =====
function StatCard({ title, value, icon, color, onClick }: StatCardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white p-4 sm:p-6 rounded-3xl shadow-sm border border-gray-300 transition-all duration-300 
        ${
          onClick
            ? "cursor-pointer hover:shadow-lg hover:-translate-y-1 active:scale-95"
            : "cursor-default"
        }`}
    >
      <div
        className={`w-10 h-10 sm:w-12 sm:h-12 ${color} rounded-2xl flex items-center justify-center mb-3 sm:mb-4 shadow-inner`}
      >
        {icon}
      </div>
      <p className="text-[12px] sm:text-sm text-gray-400 font-medium uppercase tracking-wider mb-3">
        {title}
      </p>
      <p className="text-lg sm:text-2xl font-bold text-gray-800 mt-1">
        {value}
      </p>
      {onClick && (
        <p className="text-[9px] sm:text-[9px] text-[#b5820e] font-bold mt-1 uppercase tracking-tighter opacity-0 hover:opacity-100 transition-opacity">
          Clique para gerir →
        </p>
      )}
    </div>
  );
}

function ServiceBadge({ name, count, onEdit, onDelete }: ServiceBadgeProps) {
  return (
    // Adicionei 'group' para mostrar os botões melhor ao passar o mouse
    <div className="flex items-center justify-between p-2 sm:p-4 bg-gray-50 rounded-2xl transition hover:bg-white hover:shadow-md mb-2 group">
      <div className="flex items-center gap-1 sm:gap-2">
        <Scissors size={14} className="text-[#b5820e]" />
        <span className="text-xs sm:text-sm font-medium text-gray-700">
          {name}
        </span>
        <span className="text-xs sm:text-sm font-bold text-gray-500 ml-2">
          - {count}
        </span>
      </div>

      {/* Botões de Ação */}
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onEdit}
          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
          title="Editar"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={onDelete}
          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
          title="Remover"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

function statusClass(status: Agendamento["status"]) {
  switch (status) {
    case "confirmado":
      return "bg-green-100 text-green-600";
    case "pendente":
      return "bg-yellow-100 text-yellow-600";
    case "cancelado":
      return "bg-red-100 text-red-600";
    case "reagendado":
      return "bg-blue-100 text-blue-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
}
