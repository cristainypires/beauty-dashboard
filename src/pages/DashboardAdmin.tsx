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
interface Agendamento {
  id: number;
  cliente: string;
  servico: string;
  profissional: string;
  hora: string;
  status: "Confirmado" | "Pendente" | "Cancelado" | "Remarcado";
}

// =====================
// DASHBOARD ADMIN
// =====================
export function DashboardAdmin() {
  // 1. ESTADOS DE NAVEGAÇÃO E MODAIS
  const [view, setView] = useState<
    | "home"
    | "equipa"
    | "novo-funcionario"
    | "logs"
    | "financeiro"
    | "todos-agendamentos"
    | "clientes"
  >("home");

  const [showServicoModal, setShowServicoModal] = useState(false);

  // Estado para armazenar qual funcionário estamos a editar
  const [funcionarioSelecionado, setFuncionarioSelecionado] =
    useState<any>(null);

  // Função para abrir o formulário em modo de edição
  const abrirEdicao = (func: any) => {
    setFuncionarioSelecionado(func);
    setView("novo-funcionario");
  };

  // DADOS MOCK
  const stats = {
    faturamento: "152.400",
    clientesAtivos: 48,
    servicosHoje: 12,
    taxaCancelamento: "5%",
  };

  const agendamentosRecentes: Agendamento[] = [
    {
      id: 1,
      cliente: "Marta Tavares",
      servico: "Limpeza de Pele",
      profissional: "Ana Beatriz",
      hora: "09:00",
      status: "Confirmado",
    },
    {
      id: 2,
      cliente: "Carla Antunes",
      servico: "Massagem Relaxante",
      profissional: "Sofia Lemos",
      hora: "10:30",
      status: "Pendente",
    },
    {
      id: 3,
      cliente: "Joana Dias",
      servico: "Manicure",
      profissional: "Ana Beatriz",
      hora: "14:00",
      status: "Cancelado",
    },
    {
      id: 4,
      cliente: "Rita Gomes",
      servico: "Depilação",
      profissional: "Sofia Lemos",
      hora: "15:30",
      status: "Remarcado",
    },
  ];

  return (
    <div className="min-h-screen bg-[#ffffff] p-8">
      {/* 1. VIEW: HOME (DASHBOARD) */}
      {view === "home" && (
        <>
          <header className="mb-10 flex justify-between items-end">
            <div>
              <p className="text-gray-500 mt-2 text-lg font-medium italic">
                "Transformando visão em excelência: o sucesso da Maddie Beuty
                Boutique começa na sua liderança"
              </p>
            </div>
            <div className="flex flex-col items-end">
              <div className=" text-[#b5820e] px-6 py-2 rounded-xl shadow-lg border-b-2 border-[#b5820e] flex items-center gap-3">
                <Calendar size={18} />
                <span className="text-xs font-bold uppercase tracking-widest">
                  {new Date().toLocaleDateString("pt-PT", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
  {/* Card de Faturamento -> Leva para o Financeiro */}
  <StatCard
    onClick={() => setView("financeiro")}
    title="Faturamento Mensal"
    value={`${stats.faturamento} CVE`}
    icon={<DollarSign className="text-[#b5820e]" />}
    color="bg-amber-50"
  />

  {/* Card de Clientes -> Leva para a Lista de Clientes */}
  <StatCard
    onClick={() => setView("clientes")}
    title="Clientes Ativos"
    value={stats.clientesAtivos}
    icon={<Users className="text-blue-500" />}
    color="bg-blue-50"
  />

  {/* Card de Serviços Hoje -> Leva para a Lista de Agendamentos */}
  <StatCard
    onClick={() => setView("todos-agendamentos")}
    title="Serviços Hoje"
    value={stats.servicosHoje}
    icon={<Calendar className="text-purple-500" />}
    color="bg-purple-50"
  />

  {/* Card de Popularidade -> (Sem clique ou leva para Serviços) */}
  <StatCard
    title="Popularidade"
    value="Drenagem"
    icon={<TrendingUp className="text-green-500" />}
    color="bg-green-100"
  />

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* CARD AGENDAMENTOS */}
            <div className="bg-white rounded-3xl shadow-sm border border-pink-50 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-black">
                  Agendamentos Recentes
                </h2>
                <button
                  onClick={() => setView("todos-agendamentos")}
                  className="text-xs font-bold text-[#b5820e] uppercase tracking-widest hover:underline"
                >
                  Ver Tudo →
                </button>
              </div>
              <div className="space-y-4">
                {agendamentosRecentes.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 hover:bg-pink-50 rounded-2xl transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#b5820e] text-white flex items-center justify-center font-bold">
                        {item.cliente[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {item.cliente}
                        </p>
                        <p className="text-xs text-gray-400">
                          {item.servico} • {item.profissional}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-700">
                        {item.hora}
                      </p>
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${statusClass(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CARD SERVIÇOS */}
            <div className="bg-white rounded-3xl shadow-sm border border-pink-50 p-6 text-center">
              <h2 className="text-xl font-bold text-black mb-6 text-left">
                Serviços Disponiveis
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <ServiceBadge name="Manicure" count="45x" />
                <ServiceBadge name="Limpeza de Pele" count="32x" />
                <ServiceBadge name="Massagem" count="28x" />
                <ServiceBadge name="Depilação" count="15x" />
              </div>
              <button
                onClick={() => setShowServicoModal(true)}
                className="w-full mt-6 py-3 border-2 border-dashed border-[#b5820e] text-[#b5820e] rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-amber-50 transition"
              >
                <Plus size={18} /> Novo Serviço
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* FINANCEIRO */}
            <div className="bg-white rounded-3xl shadow-sm border border-pink-50 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-black">Vendas & Lucro</h2>
                <BarChart3 className="text-[#b5820e]" size={20} />
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-2xl">
                  <p className="text-xs text-gray-400 uppercase font-bold">
                    Primavera ERP
                  </p>
                  <p className="text-sm font-medium text-green-600">
                    Status: Sincronizado
                  </p>
                </div>
                <button
                  onClick={() => setView("financeiro")}
                  className="w-full py-3 bg-black text-[#b5820e] rounded-2xl font-bold text-sm mt-4 flex items-center justify-center gap-2 hover:opacity-90 transition"
                >
                  <FileText size={16} /> Relatório Detalhado
                </button>
              </div>
            </div>

            {/* EQUIPA */}
            <div className="bg-white rounded-3xl shadow-sm border border-pink-50 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-black">Corpo Técnico</h2>
                <Settings className="text-gray-300" size={20} />
              </div>
              <div className="space-y-3">
                {["Ana Beatriz", "Sofia Lemos", "Marta Pires"].map(
                  (nome, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 border-l-4 border-[#b5820e] bg-gray-50 rounded-r-xl"
                    >
                      <span className="text-sm font-bold text-gray-700">
                        {nome}
                      </span>
                      <span className="text-[10px] bg-white px-2 py-1 rounded-md text-gray-400 font-bold uppercase">
                        Ativo
                      </span>
                    </div>
                  )
                )}
                <button
                  onClick={() => setView("equipa")}
                  className="w-full mt-2 py-3 bg-[#b5820e] text-white rounded-2xl font-bold text-sm hover:opacity-90 transition"
                >
                  Gerir Profissionais
                </button>
              </div>
            </div>

            {/* LOGS */}
            <div className="bg-gray-800 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-6">
                <ShieldCheck className="text-[#b5820e]" size={20} />
                <h2 className="text-xl font-bold text-white">Logs Sistema</h2>
              </div>
              <div className="space-y-4 font-mono text-[10px] text-gray-400">
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
                className="w-full mt-8 py-2 text-[#b5820e] border border-[#b5820e] rounded-xl text-xs font-bold hover:bg-[#b5820e] hover:text-black transition"
              >
                Ver Auditoria
              </button>
            </div>
          </div>
        </>
      )}

      {/* RENDERIZAÇÃO: LISTA DE CLIENTES */}
      {view === "clientes" && (
        <Lista_Clientes onVoltar={() => setView("home")} />
      )}
      {/* 2. VIEW: LISTA TODOS AGENDAMENTOS */}
      {view === "todos-agendamentos" && (
        <Agendamentos_Lista onVoltar={() => setView("home")} />
      )}

      {/* 3. VIEW: FINANCEIRO */}
      {view === "financeiro" && (
        <Relatorios_Financeiros onVoltar={() => setView("home")} />
      )}

      {/* 4. VIEW: LOGS */}
      {view === "logs" && <Auditoria_Logs onVoltar={() => setView("home")} />}

      {/* 5. VIEW: EQUIPA (LISTA) */}
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

      {/* 6. VIEW: FORMULÁRIO FUNCIONÁRIO (CRIAR/EDITAR) */}
      {view === "novo-funcionario" && (
        <Formulario_Funcionario
          onVoltar={() => setView("equipa")}
          funcionarioParaEditar={funcionarioSelecionado}
        />
      )}

      {/* 7. MODAL: NOVO SERVIÇO */}
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

// COMPONENTES AUXILIARES

function StatCard({ title, value, icon, color, onClick }: StatCardProps) {
  return (
    <div 
      onClick={onClick}
      className={`bg-white p-6 rounded-3xl shadow-sm border border-pink-50 transition-all duration-300 
        ${onClick 
          ? 'cursor-pointer hover:shadow-lg hover:-translate-y-1 active:scale-95' 
          : 'cursor-default'
        }`}
    >
      <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center mb-4 shadow-inner`}>
        {icon}
      </div>
      <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">{title}</p>
      <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
      
      {/* Pequeno indicador visual se for clicável */}
      {onClick && (
        <p className="text-[9px] text-[#b5820e] font-bold mt-2 uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
          Clique para gerir →
        </p>
      )}
    </div>
  );
}

function ServiceBadge({ name, count }: ServiceBadgeProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl transition hover:bg-white hover:shadow-md">
      <div className="flex items-center gap-2">
        <Scissors size={16} className="text-[#b5820e]" />
        <span className="text-sm font-medium text-gray-700">{name}</span>
      </div>
      <span className="text-xs font-bold text-[#b5820e]">{count}</span>
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
