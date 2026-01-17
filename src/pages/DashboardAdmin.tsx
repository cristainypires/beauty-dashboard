// src/pages/DashboardAdmin.tsx
import React, { useState, useEffect } from "react";

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
}

interface Funcionario {
  id: number;
  nome: string;
  especialidade: string;
  email: string;
  telefone: string;
  status: "Ativo" | "Inativo";
}

export interface Agendamento {
  id: number;
  cliente: string;
  servico: string;
  profissional: string;
  data: string;
  hora: string;
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
  titulo: string;
  validade: string;
  servicos_ids: number[];
  ativo: boolean;
}

export function DashboardAdmin() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [logsAuditoria, setLogsAuditoria] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // 2. Função para carregar agendamentos do Back-end
  const carregarAgendamentos = async () => {
    try {
      setLoading(true);
      const dados = await listarAgendamentos();

      // Mapear dados do backend para o formato esperado
      const agendamentosArray = Array.isArray(dados)
        ? dados
        : dados?.data || [];

      const agendamentosFormatados = agendamentosArray.map((item: any) => {
        const inicio = new Date(item.data_hora_inicio);
        const data = inicio.toLocaleDateString("sv-SE"); // formato ISO local

        return {
          id: item.id,
          cliente: item.cliente_nome || item.cliente || "Sem nome",
          telefone: item.cliente_telefone || item.numero_telefone || "",
          servico: item.nome_servico || item.servico || "",
          profissional: item.funcionario_nome || item.profissional || "",
          status: (item.status || "pendente").toLowerCase(),
          data: inicio.toISOString().split("T")[0],
          hora: inicio.toISOString().split("T")[1].slice(0, 5),
        };
      });

      setAgendamentos(agendamentosFormatados);
      console.log("[DEBUG] Agendamentos formatados:", agendamentosFormatados);
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
      setAgendamentos([]);
    } finally {
      setLoading(false);
    }
  };

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
  const handleRemoverFuncionario = async (id: number) => {
    if (window.confirm("Tem certeza que deseja remover este funcionário?")) {
      try {
        await removerFuncionario(id);
        alert("Funcionário removido!");
        carregarFuncionarios(); // 🔄 Atualiza a lista
      } catch (error) {
        alert("Erro ao remover funcionário.");
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

  ///////////////////////////////////77
  ///Promocoes
  // ESTADOS
  const [promocoes, setPromocoes] = useState<Promocao[]>([]);
  const formatDate = (dateStr: string) => new Date(dateStr + "T00:00:00");

  const carregarPromocoes = async () => {
    try {
      const dados = await PromocaoService.listar();
      const promosArray = Array.isArray(dados) ? dados : dados?.data || [];

      // Formata os campos para garantir que o componente receba o que espera
      const formatadas = promosArray.map((p: any) => ({
        ...p,
        // Se no banco o nome for diferente, ajuste aqui:
        titulo: p.titulo || p.nome || "Promoção Sem Nome",
        validade: p.validade || p.data_fim || p.data_validade,
      }));

      setPromocoes(formatadas);
      console.log("[DEBUG] Promoções formatadas:", formatadas);
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

  const ordenarPorDataHora = (a: Agendamento, b: Agendamento) => {
    const dataHoraA = new Date(`${a.data}T${a.hora}`);
    const dataHoraB = new Date(`${b.data}T${b.hora}`);
    return dataHoraA.getTime() - dataHoraB.getTime();
  };

  /////////////////////////////////////////////////
  /////////

  const isHoje = (data: string) => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const dataAgendamento = new Date(data);
    dataAgendamento.setHours(0, 0, 0, 0);

    return dataAgendamento.getTime() === hoje.getTime();
  };

  const agendamentosHoje = agendamentos.filter((item) => isHoje(item.data));

  const precoServico: Record<string, number> = {
    "Limpeza de Pele": 2500,
    "Massagem Relaxante": 3000,
    Manicure: 1500,
    Depilação: 2000,
  };
  // =====================
  // CÁLCULOS REAIS
  // =====================

  // Data de hoje
  const hoje = new Date();

  const clientesUnicos = new Set(agendamentos.map((item) => item.cliente));

  const contagemServicos: Record<string, number> = {};
  agendamentos.forEach((item) => {
    contagemServicos[item.servico] = (contagemServicos[item.servico] || 0) + 1;
  });

  const servicoMaisPopular =
    Object.entries(contagemServicos).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

  const faturamentoDiario = React.useMemo(() => {
    if (agendamentos.length === 0 || servicos.length === 0) return 0;

    const hoje = new Date();

    return agendamentos
      .filter((item) => {
        if (item.status.toLowerCase() !== "concluido") return false;

        const dataAgendamento = new Date(item.data);
        // Comparando dia, mês e ano
        return (
          dataAgendamento.getDate() === hoje.getDate() &&
          dataAgendamento.getMonth() === hoje.getMonth() &&
          dataAgendamento.getFullYear() === hoje.getFullYear()
        );
      })
      .reduce((total, item) => {
        const servicoEncontrado = servicos.find(
          (s) =>
            s.nome.toLowerCase().trim() === item.servico.toLowerCase().trim(),
        );
        if (servicoEncontrado) {
          console.log(
            "[DEBUG] Somando serviço diário:",
            item.servico,
            "Valor:",
            servicoEncontrado.preco,
          );
        }
        return (
          total + (servicoEncontrado ? Number(servicoEncontrado.preco) : 0)
        );
      }, 0);
  }, [agendamentos, servicos]);

  const totalFuncionarios = funcionarios.length;

  const parseDate = (dateStr: any) => {
    if (!dateStr) return null;

    // Tenta criar o objeto Date diretamente da string
    const d = new Date(dateStr);

    // Verifica se a data é válida
    return isNaN(d.getTime()) ? null : d;
  };

  return (
    <div className="min-h-screen bg-white p-4 sm:p-8">
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
              onClick={() => setView("todos-agendamentos")}
              title="Agendamentos Hoje"
              value={agendamentosHoje.length}
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
              <div className="space-y-2 sm:space-y-4">
                {loading ? (
                  <p>A carregar agendamentos...</p>
                ) : (
                  agendamentosHoje
                    .filter((item) => {
                      const hoje = new Date();
                      hoje.setHours(0, 0, 0, 0);
                      const dataAgendamento = new Date(item.data);
                      dataAgendamento.setHours(0, 0, 0, 0);
                      return dataAgendamento >= hoje;
                    })
                    .sort(ordenarPorDataHora)
                    .slice(0, 5) // Mostra apenas os 5 primeiros na Home
                    .map((item) => (
                      <Agenda_Item
                        key={item.id}
                        id={item.id}
                        cliente={item.cliente}
                        telefone={item.telefone || ""}
                        servico={`${item.servico} • ${item.profissional}`}
                        data={item.data}
                        hora={item.hora}
                        status={item.status}
                        clickable={true}
                        onItemClick={() => setView("todos-agendamentos")}
                        onClienteClick={() => setView("clientes")}
                        // LIGAÇÃO COM O BACK-END AQUI:
                        onCancelar={() => handleCancelar(item.id)}
                        onRemarcar={() => handleReagendar(item.id)}
                      />
                    ))
                )}
              </div>
            </div>

            {/* Serviços Disponíveis */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-4 sm:p-6 text-center mt-10">
              <h2 className="text-lg sm:text-xl font-bold text-black mb-4 sm:mb-6 text-left">
                Serviços Disponíveis
              </h2>
              {servicos.map((servico) => (
                <ServiceBadge
                  key={servico.id}
                  name={servico.nome}
                  count={`${servico.preco} esc`}
                />
              ))}

              <button
                onClick={() => setShowServicoModal(true)}
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
            <div className="bg-gray-800 text-white rounded-3xl shadow-sm border border-gray-700 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold">Vendas & Lucro</h2>
                <BarChart3 className="text-[#b5820e]" size={18} />
              </div>
              <div className="space-y-2 sm:space-y-4">
                <div className="p-2 sm:p-4 bg-gray-900 rounded-2xl">
                  <p className="text-[9px] sm:text-xs text-gray-400 uppercase font-bold">
                    Primavera ERP
                  </p>
                  <p className="text-[10px] sm:text-sm font-medium text-green-500">
                    Status: Sincronizado
                  </p>
                </div>
                <button
                  onClick={() => setView("financeiro")}
                  className="w-full py-2 sm:py-3 bg-[#b5820e] text-black rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1 sm:gap-2 hover:opacity-90 transition"
                >
                  <FileText size={14} /> Relatório Detalhado
                </button>
              </div>
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
            <div className="bg-gray-800 text-white rounded-3xl shadow-sm border border-gray-700 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-[#b5820e]">
                  Promoções
                </h2>
                <TrendingUp className="text-[#b5820e]" size={18} />
              </div>

              {/* Lista de promoções vinda do Back-end */}
              <div className="space-y-2 sm:space-y-3">
                {promocoes.length === 0 ? (
                  <p className="text-gray-500 text-xs italic">
                    Nenhuma promoção registada.
                  </p>
                ) : (
                  promocoes.slice(0, 2).map((promo) => (
                    <div
                      key={promo.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 sm:p-4 bg-gray-900 rounded-2xl"
                    >
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-white">
                          {promo.titulo}
                        </p>
                        <p className="text-[8px] sm:text-[10px] text-gray-400">
                          Válido até{" "}
                          {parseDate(promo.validade)?.toLocaleDateString(
                            "pt-PT",
                          ) || "Data não definida"}
                        </p>
                      </div>

                      <span
                        className={`text-[8px] sm:text-[10px] font-bold px-2 py-1 rounded-full mt-1 sm:mt-0 ${
                          promo.ativo
                            ? "text-green-400 bg-green-900"
                            : "text-red-500 bg-red-900"
                        }`}
                      >
                        {promo.ativo ? "Ativa" : "Inativa"}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Botão para gerir todas as promoções */}
              <button
                onClick={() => setView("promocoes")}
                className="w-full mt-4 sm:mt-6 py-2 sm:py-3 bg-[#b5820e] text-black rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1 sm:gap-2 hover:opacity-90 transition"
              >
                <Plus size={16} /> Criar / Gerir Promoções ({promocoes.length})
              </button>
            </div>
          </div>
        </>
      )}
      {/* ===== VIEWS DINÂMICAS ===== */}
      {view === "promocoes" && (
        <Promocoes_Admin
          promocoes={promocoes}
          servicosReais={servicos} //  Passando os serviços do banco
          onVoltar={() => setView("home")}
          onAtivar={handleAtivarPromocao}
          onDesativar={handleDesativarPromocao}
          onAtualizar={() => carregarPromocoes()} // Passa a função para o filho se atualizar
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
        <Relatorios_Financeiros onVoltar={() => setView("home")} />
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
          onEditarFuncionario={(func) => {
            setFuncionarioSelecionado(func);
            setView("novo-funcionario");
          }}
          onRemover={handleRemoverFuncionario}
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

function ServiceBadge({ name, count }: ServiceBadgeProps) {
  return (
    <div className="flex items-center justify-between p-2 sm:p-4 bg-gray-50 rounded-2xl transition hover:bg-white hover:shadow-md">
      <div className="flex items-center gap-1 sm:gap-2">
        <Scissors size={14} className="text-[#b5820e]" />
        <span className="text-xs sm:text-sm font-medium text-gray-700">
          {name}
        </span>
        <span className="text-xs sm:text-sm font-bold text-gray-500 ml-2">
          - {count}
        </span>
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
