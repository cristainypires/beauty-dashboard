// src/pages/DashboardAdmin.tsx
import React, { useState } from "react";
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

interface Agendamento {
  id: number;
  cliente: string;
  servico: string;
  profissional: string;
  data: string;
  hora: string;
  telefone?: string;
  status: "Confirmado" | "Pendente" | "Cancelado" | "Remarcado";
}

export function DashboardAdmin() {
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

  const isHojeOuFuturo = (data: string, hora: string) => {
    const agora = new Date();
    const agendamento = new Date(`${data}T${hora}`);
    return agendamento >= agora;
  };

  const agendamentosRecentes: Agendamento[] = [
    {
      id: 1,
      cliente: "Marta Tavares",
      servico: "Limpeza de Pele",
      profissional: "Ana Beatriz",
      data: "2023-10-27",
      hora: "09:00",
      status: "Confirmado",
    },
    {
      id: 2,
      cliente: "Carla Antunes",
      servico: "Massagem Relaxante",
      profissional: "Sofia Lemos",
      data: "2023-10-27",
      hora: "10:30",
      status: "Pendente",
    },
    {
      id: 3,
      cliente: "Joana Dias",
      servico: "Manicure",
      profissional: "Ana Beatriz",
      data: "2026-10-26",
      telefone: "912345678",
      hora: "14:00",
      status: "Cancelado",
    },
    {
      id: 4,
      cliente: "Rita Gomes",
      servico: "Depilação",
      profissional: "Sofia Lemos",
      data: "2027-10-26",
      telefone: "9500589",
      hora: "15:30",
      status: "Remarcado",
    },
  ];

  // =====================
  // CÁLCULOS REAIS
  // =====================

  // Data de hoje
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  // 🔹 Agendamentos de hoje
  const agendamentosHoje = agendamentosRecentes.filter((item) => {
    const data = new Date(item.data);
    data.setHours(0, 0, 0, 0);
    return data.getTime() === hoje.getTime();
  });

  // 🔹 Clientes únicos
  const clientesUnicos = new Set(
    agendamentosRecentes.map((item) => item.cliente)
  );

  // 🔹 Serviço mais popular
  const contagemServicos: Record<string, number> = {};
  agendamentosRecentes.forEach((item) => {
    contagemServicos[item.servico] = (contagemServicos[item.servico] || 0) + 1;
  });

  const servicoMaisPopular =
    Object.entries(contagemServicos).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

  // 🔹 Faturamento mensal
  const precoServico: Record<string, number> = {
    "Limpeza de Pele": 2500,
    "Massagem Relaxante": 3000,
    Manicure: 1500,
    Depilação: 2000,
  };

  const faturamentoMensal = agendamentosRecentes.reduce(
    (total, item) => total + (precoServico[item.servico] || 0),
    0
  );

  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([
    {
      id: 1,
      nome: "Ana Beatriz",
      especialidade: "Estética Facial",
      email: "ana.b@maddie.com",
      telefone: "9912345",
      status: "Ativo",
    },
    {
      id: 2,
      nome: "Sofia Lemos",
      especialidade: "Massoterapia",
      email: "sofia.l@maddie.com",
      telefone: "9955667",
      status: "Ativo",
    },
    {
      id: 3,
      nome: "Marta Pires",
      especialidade: "Manicure",
      email: "marta.p@maddie.com",
      telefone: "9988776",
      status: "Inativo",
    },
  ]);

  const totalFuncionarios = funcionarios.length;

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
              value={clientesUnicos.size}
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
              title="Faturamento Mensal"
              value={`${faturamentoMensal.toLocaleString()} CVE`}
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-10 sm:mb-8">
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
                {agendamentosRecentes
                  .filter((item) => {
                    const hoje = new Date();
                    hoje.setHours(0, 0, 0, 0);

                    const dataAgendamento = new Date(item.data);
                    dataAgendamento.setHours(0, 0, 0, 0);

                    return dataAgendamento >= hoje;
                  })
                  .sort(ordenarPorDataHora)
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
                      clickable={false}
                      onItemClick={() => setView("todos-agendamentos")}
                      onClienteClick={() => setView("clientes")}
                      onRemarcar={() => {}}
                      onCancelar={() => {}}
                    />
                  ))}
              </div>
            </div>

            {/* Serviços Disponíveis */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-4 sm:p-6 text-center mt-10">
              <h2 className="text-lg sm:text-xl font-bold text-black mb-4 sm:mb-6 text-left">
                Serviços Disponíveis
              </h2>
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <ServiceBadge name="Manicure" count="4000 esc" />
                <ServiceBadge name="Limpeza de Pele" count="3200 esc" />
                <ServiceBadge name="Massagem" count="2800 esc" />
                <ServiceBadge name="Depilação" count="1500 esc" />
              </div>
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
                {["Ana Beatriz", "Sofia Lemos", "Marta Pires"].map(
                  (nome, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 sm:p-3 border-l-4 border-[#b5820e] bg-gray-900 rounded-r-xl"
                    >
                      <span className="text-[10px] sm:text-sm font-bold">
                        {nome}
                      </span>
                      <span className="text-[8px] sm:text-[10px] px-2 py-1 rounded-md font-bold uppercase text-green-400 bg-green-900">
                        Ativo
                      </span>
                    </div>
                  )
                )}
                <button
                  onClick={() => setView("equipa")}
                  className="w-full mt-2 py-2 sm:py-3 bg-[#b5820e] text-black rounded-2xl font-bold text-xs sm:text-sm hover:opacity-90 transition"
                >
                  Gerir Profissionais
                </button>
              </div>
            </div>

            {/* Logs */}
            <div className="bg-gray-800 rounded-3xl p-4 sm:p-6 shadow-xl text-white">
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <ShieldCheck className="text-[#b5820e]" size={18} />
                <h2 className="text-lg sm:text-xl font-bold">Logs Sistema</h2>
              </div>
              <div className="space-y-2 sm:space-y-4 font-mono text-[8px] sm:text-[10px] text-gray-400">
                <p>
                  <span className="text-[#b5820e]">[14:30]</span> ADMIN criou
                  serviço.
                </p>
                <p>
                  <span className="text-[#b5820e]">[10:05]</span> SISP:
                  Confirmado #448.
                </p>
              </div>
              <button
                onClick={() => setView("logs")}
                className="w-full mt-4 sm:mt-6 py-1 sm:py-2 text-[#b5820e] border border-[#b5820e] rounded-xl text-[9px] sm:text-xs font-bold hover:bg-[#b5820e] hover:text-black transition"
              >
                Ver Auditoria
              </button>
            </div>

            {/* Promoções */}
            <div className="bg-gray-800 text-white rounded-3xl shadow-sm border border-gray-700 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-[#b5820e]">
                  Promoções
                </h2>
                <TrendingUp className="text-[#b5820e]" size={18} />
              </div>

              {/* Lista de promoções */}
              <div className="space-y-2 sm:space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 sm:p-4 bg-gray-900 rounded-2xl">
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-white">
                      Desconto Massagem
                    </p>
                    <p className="text-[8px] sm:text-[10px] text-gray-400">
                      -20% até 30/01
                    </p>
                  </div>
                  <span className="text-[8px] sm:text-[10px] font-bold text-green-400 bg-green-900 px-2 py-1 rounded-full mt-1 sm:mt-0">
                    Ativa
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 sm:p-4 bg-gray-900 rounded-2xl">
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-white">
                      Manicure & Pedicure
                    </p>
                    <p className="text-[8px] sm:text-[10px] text-gray-400">
                      Pack especial
                    </p>
                  </div>
                  <span className="text-[8px] sm:text-[10px] font-bold text-red-500 bg-red-900 px-2 py-1 rounded-full mt-1 sm:mt-0">
                    Inativa
                  </span>
                </div>
              </div>

              {/* Botão admin */}
              <button
                onClick={() => setView("promocoes")}
                className="w-full mt-4 sm:mt-6 py-2 sm:py-3 bg-[#b5820e] text-black rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1 sm:gap-2 hover:opacity-90 transition"
              >
                <Plus size={16} /> Criar / Gerir Promoções
              </button>
            </div>
          </div>
        </>
      )}

      {/* ===== VIEWS DINÂMICAS ===== */}
      {view === "promocoes" && (
        <Promocoes_Admin onVoltar={() => setView("home")} />
      )}
      {view === "popularidade_servicos" && (
        <Popularidade_Servicos onVoltar={() => setView("home")} />
      )}
      {view === "clientes" && (
        <Lista_Clientes onVoltar={() => setView("home")} />
      )}
      {view === "todos-agendamentos" && (
        <Agendamentos_Lista onVoltar={() => setView("home")} />
      )}
      {view === "financeiro" && (
        <Relatorios_Financeiros onVoltar={() => setView("home")} />
      )}
      {view === "logs" && <Auditoria_Logs onVoltar={() => setView("home")} />}
      {view === "equipa" && (
        <Gerir_Funcionarios
          onVoltar={() => setView("home")}
          onNovoFuncionario={() => {
            setFuncionarioSelecionado(null);
            setView("novo-funcionario");
          }}
          onEditarFuncionario={abrirEdicao}
        />
      )}
      {view === "novo-funcionario" && (
        <Formulario_Funcionario
          onVoltar={() => setView("equipa")}
          funcionarioParaEditar={funcionarioSelecionado}
        />
      )}

      {/* MODAL NOVO SERVIÇO */}
      {showServicoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Formulario_Servico
            onVoltar={() => setShowServicoModal(false)}
            onSubmit={(data) => {
              console.log("Novo serviço:", data);
              setShowServicoModal(false);
            }}
          />
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
    case "Confirmado":
      return "bg-green-100 text-green-600";
    case "Pendente":
      return "bg-yellow-100 text-yellow-600";
    case "Cancelado":
      return "bg-red-100 text-red-600";
    case "Remarcado":
      return "bg-blue-100 text-blue-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
}
