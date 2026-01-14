import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  ChevronLeft,
  Star,
  Plus,
  History,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { FuncionarioService } from "../services/Funcionario.service";

// Imports de Componentes
import { Agenda_Item } from "../components/Agenda_Item";
import { Gestao_Disponibilidade } from "../components/Gestao_Disponibilidade";
import { Form_Agendamento_Funcionario } from "../components/Form_Agendamento_Funcionario";
import { Lista_Clientes } from "../components/Lista_Clientes";
import { Cliente } from "../components/Lista_Clientes";

// =====================
// DASHBOARD FUNCIONÁRIO
// =====================
export function DashboardFuncionario() {
  const [view, setView] = useState<
    | "home"
    | "agenda"
    | "historico"
    | "disponibilidade"
    | "novo"
    | "Lista_clientes"
  >("home");

  // 3. Substitua a agenda estática por este estado:
  const [agenda, setAgenda] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Estado para os clientes (também virá do banco)
  const [clientes, setClientes] = useState<Cliente[]>([]);

  const navigate = useNavigate();
  const [filtroCliente, setFiltroCliente] = useState("");
  const [filtroServico, setFiltroServico] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<
    "Confirmado" | "Pendente" | "Cancelado" | "Remarcado" | ""
  >("");
  const [filtroData, setFiltroData] = useState("");

  const handleAtivarCliente = (id: number) => {
    setClientes((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ativo: true } : c))
    );
  };

  const handleDesativarCliente = (id: number) => {
    setClientes((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ativo: false } : c))
    );
  };

  // Dentro do DashboardFuncionario
  const carregarDados = async () => {
    try {
      setLoading(true);
      let dados;

      if (view === "historico") {
        // Chama router.get("/historico", ...) do back-end
        dados = await FuncionarioService.verMeuHistorico();
      } else {
        // Chama router.get("/listar-agendamentos", ...) do back-end
        dados = await FuncionarioService.listarMinhaAgenda();
      }

      setAgenda(dados); // Atualiza o estado com os dados do banco
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  // Carregar sempre que mudar a view
  useEffect(() => {
    carregarDados();
  }, [view]);

  // --- AÇÕES LIGADAS AO BACK-END ---

  const handleConcluir = async (id: number) => {
    try {
      await FuncionarioService.concluirServico(id);
      alert("Serviço concluído com sucesso! 🎉");
      carregarDados(); // Recarrega a lista
    } catch (error) {
      alert("Erro ao concluir serviço.");
    }
  };

  const handleCancelar = async (id: number) => {
    if (window.confirm("Tem certeza que deseja cancelar este agendamento?")) {
      try {
        await FuncionarioService.cancelarAgendamento(id);
        alert("Agendamento cancelado.");
        carregarDados();
      } catch (error) {
        alert("Erro ao cancelar.");
      }
    }
  };

  const handleReagendar = async (id: number) => {
    const novaData = prompt("Nova Data (AAAA-MM-DD):");
    const novaHora = prompt("Nova Hora (HH:MM):");
    if (novaData && novaHora) {
      try {
        await FuncionarioService.reagendarAgendamento(id, {
          data: novaData,
          hora: novaHora,
        });
        alert("Reagendado com sucesso!");
        carregarDados();
      } catch (error) {
        alert("Erro ao reagendar. Verifique a disponibilidade.");
      }
    }
  };


  const handleCriarAgendamento = async (dadosDoForm: any) => {
  try {
    // 1. Chama o serviço que criamos no ficheiro Funcionario.service.ts
    // Rota: router.post("/agendamentos", agendamento_Controller.fazer_agendamento);
    await FuncionarioService.fazerNovoAgendamento(dadosDoForm);
    
    alert("Agendamento registado com sucesso! 🎉");
    
    // 2. Volta para a Home
    setView("home");
    
    // 3. Recarrega a agenda para o novo agendamento aparecer na lista
    carregarDados(); 
    
  } catch (error) {
    console.error("Erro ao criar agendamento:", error);
    alert("Erro ao criar agendamento. Verifique se o horário está disponível.");
  }
};

  const hoje = new Date();

  const isHojeOuFuturo = (data: string, hora: string) => {
    const agora = new Date();
    const agendamento = new Date(`${data}T${hora}`);
    return agendamento >= agora;
  };

  const agendaHojeOuFuturo = agenda
    .filter((item) => isHojeOuFuturo(item.data, item.hora))
    .sort((a, b) => {
      const dtA = new Date(`${a.data}T${a.hora}`);
      const dtB = new Date(`${b.data}T${b.hora}`);
      return dtA.getTime() - dtB.getTime();
    });
  const [pagina, setPagina] = React.useState(1);
  const itensPorPagina = 5;

  const totalPaginas = Math.ceil(agendaHojeOuFuturo.length / itensPorPagina);

  const agendaPaginada = agendaHojeOuFuturo.slice(
    (pagina - 1) * itensPorPagina,
    pagina * itensPorPagina
  );

  const isAgendamentoPassado = (data: string, hora: string) => {
    const agora = new Date();
    const agendamento = new Date(`${data}T${hora}`);
    return agendamento < agora;
  };

  const proximosAgendamentos = agenda.filter((item) =>
    isHojeOuFuturo(item.data, item.hora)
  );

  const [filtroClienteHist, setFiltroClienteHist] = useState("");
  const [filtroServicoHist, setFiltroServicoHist] = useState("");
  const [filtroDataHist, setFiltroDataHist] = useState("");
  const [filtroStatusHist, setFiltroStatusHist] = useState<
    "Confirmado" | "Pendente" | "Cancelado" | "Remarcado" | ""
  >("");
  const ordenarPorDataHora = (
    a: { data: string; hora: string },
    b: { data: string; hora: string }
  ) => {
    const dataHoraA = new Date(`${a.data}T${a.hora}`);
    const dataHoraB = new Date(`${b.data}T${b.hora}`);
    return dataHoraA.getTime() - dataHoraB.getTime();
  };

  return (
    <div className="min-h-screen bg-white p-6 md:p-10">
      {/* HEADER LUXO */}
      <section className="mb-5 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gray-100 pb-10 gap-6">
        <div>
          {view !== "home" && (
            <div>
              <button
                onClick={() => setView("home")}
                className="flex items-center gap-2 text-[#b5820e] font-bold text-xs uppercase tracking-widest mb-4 hover:underline"
              >
                <ChevronLeft size={16} /> Voltar ao Início
              </button>

              <p className="text-gray-400 italic mt-2 text-lg">
                "Excelência em cada detalhe, beleza em cada toque. Você é capaz,
                você consegue."
              </p>
            </div>
          )}

          {![
            "agenda",
            "historico",
            "disponibilidade",
            "novo",
            "Lista_clientes",
          ].includes(view) && (
            <>
              <h1 className="md:text-4xl text-2xl font-serif font-black tracking-tight text-black">
                Painel da Recepcionista
              </h1>
              <p className="text-gray-400 italic mt-2 text-lg">
                "Excelência em cada detalhe, beleza em cada toque. Você é capaz,
                você consegue."
              </p>
            </>
          )}
        </div>
        {![
          "agenda",
          "historico",
          "disponibilidade",
          "novo",
          "Lista_clientes",
        ].includes(view) && (
          <div className="flex flex-col items-end">
            <div className=" text-[#b5820e] px-6 py-2 rounded-xl shadow-lg border-b-2 border-[#b5820e] flex items-end md:items-center gap-3">
              <Calendar size={14} />
              <span className="text-xs font-bold uppercase tracking-widest">
                {new Date().toLocaleDateString("pt-PT", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        )}
      </section>

      {/* RENDERIZAÇÃO: HOME */}
      {view === "home" && (
        <>
          {/* CARDS DE RESUMO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 mb-12">
            <StatCard
              title="Próximos Agendamentos"
              value={loading ? "..." : agenda.length} // Mostra o total real do banco
              icon={Clock}
              color="bg-amber-50"
              onClick={() => setView("agenda")}
            />

            <StatCard
              title="Novo Agendamento"
              value="Criar"
              icon={Plus}
              color="bg-gray-50"
              onClick={() => setView("novo")}
            />
            <StatCard
              title="Histórico"
              value="Ver"
              icon={History}
              color="bg-gray-50"
              onClick={() => setView("agenda")}
            />
            <StatCard
              title="Avaliação"
              value="4.9"
              icon={Star}
              color="bg-gray-50 text-[#b5820e]"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
            {/* LISTA RÁPIDA DE AGENDA */}
            <div className="md:col-span-2 space-y-6">
              <div className=" justify-between items-center mb-4">
                <h2 className="text-2xl font-black text-black uppercase tracking-tighter italic mb-2">
                  Agenda de Hoje
                </h2>
                <button
                  onClick={() => setView("agenda")}
                  className="text-[#b5820e] font-bold text-xs uppercase tracking-widest hover:underline"
                >
                  Ver Agenda Completo
                </button>
              </div>

              <div className="space-y-4">
                {/* Dentro do map da Agenda */}
                {agendaPaginada.map((item) => (
                  <Agenda_Item
                    key={item.id}
                    id={item.id}
                    cliente={item.cliente}
                    telefone={item.telefone}
                    servico={item.servico}
                    data={item.data}
                    hora={item.hora}
                    status={item.status}
                    obs={item.obs}
                    onItemClick={() => handleConcluir(item.id)} // Clique no card conclui o serviço
                    onClienteClick={() => setView("Lista_clientes")}
                    onRemarcar={() => handleReagendar(item.id)}
                    onCancelar={() => handleCancelar(item.id)}
                  />
                ))}

                {/* PAGINAÇÃO */}
                {totalPaginas > 1 && (
                  <div className="flex justify-center gap-2 mt-4">
                    <button
                      onClick={() => setPagina((prev) => Math.max(prev - 1, 1))}
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      Anterior
                    </button>
                    <span className="px-3 py-1">
                      {pagina} / {totalPaginas}
                    </span>
                    <button
                      onClick={() =>
                        setPagina((prev) => Math.min(prev + 1, totalPaginas))
                      }
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      Próxima
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* SIDEBAR DE ACÇÕES */}
            <div className="space-y-8">
              <div className="bg-black rounded-[2.5rem] p-10 md:mb-30 text-white shadow-2xl relative overflow-hidden">
                <div className="bg-black/10 flex gap-5 group-hover/btn:bg-black/5 p-1 rounded-lg transition-colors md:mb-2">
                  <Calendar size={27} />

                  <h3 className="text-xl font-bold text-[#b5820e] mb-4 uppercase tracking-widest">
                    <span className="text-white"> Configurar</span> <br /> Minha
                    Agenda
                  </h3>
                </div>
                <p className="text-gray-400 text-xs mb-8 leading-relaxed">
                  Gerencie sua disponibilidade diária, mensal e anual para o
                  sistema automatizado.
                </p>
                <button
                  onClick={() => setView("disponibilidade")}
                  className="w-full py-5 bg-[#b5820e] text-black rounded-2xl font-black uppercase text-xs tracking-widest hover:opacity-90 transition shadow-lg"
                >
                  Configurar Disponibilidade
                </button>
              </div>

              <CreateAppointmentCard onClick={() => setView("novo")} />
            </div>
          </div>
        </>
      )}
      {view === "Lista_clientes" && (
        <Lista_Clientes
          clientes={clientes}
          onVoltar={() => setView("home")}
          onAtivar={handleAtivarCliente}
          onDesativar={handleDesativarCliente}
        />
      )}

      {/* RENDERIZAÇÃO: OUTRAS TELAS */}
      {view === "agenda" && (
        <div className="space-y-6">
          <h2 className="md:text-3xl text-2xl font-black text-black uppercase tracking-widest mb-6">
            Agenda Completa
          </h2>

          {/* FILTROS */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <input
              type="text"
              placeholder="Pesquisar cliente..."
              className="flex-1 p-3 rounded-xl border border-gray-200 focus:border-[#b5820e] outline-none"
              value={filtroCliente}
              onChange={(e) => setFiltroCliente(e.target.value)}
            />
            <input
              type="text"
              placeholder="Pesquisar serviço..."
              className="flex-1 p-3 rounded-xl border border-gray-200 focus:border-[#b5820e] outline-none"
              value={filtroServico}
              onChange={(e) => setFiltroServico(e.target.value)}
            />
            <select
              className="p-3 rounded-xl border border-gray-200 focus:border-[#b5820e] outline-none"
              value={filtroStatusHist}
              onChange={(e) =>
                setFiltroStatusHist(
                  e.target.value as
                    | "Confirmado"
                    | "Pendente"
                    | "Cancelado"
                    | "Remarcado"
                    | ""
                )
              }
            >
              <option value="">Todos os Status</option>
              <option value="Confirmado">Confirmado</option>
              <option value="Pendente">Pendente</option>
              <option value="Cancelado">Cancelado</option>
              <option value="Remarcado">Remarcado</option>
            </select>
            <input
              type="date"
              className="p-3 rounded-xl border border-gray-200 focus:border-[#b5820e] outline-none"
              value={filtroData}
              onChange={(e) => setFiltroData(e.target.value)}
            />
          </div>

          {/* AGENDA FILTRADA */}
          {agenda
            .filter((item) => {
              const nomeMatch = item.cliente
                .toLowerCase()
                .includes(filtroCliente.toLowerCase());
              const servicoMatch = item.servico
                .toLowerCase()
                .includes(filtroServico.toLowerCase());
              const statusMatch = filtroStatus
                ? item.status === filtroStatus
                : true;
              const dataMatch = filtroData ? item.data === filtroData : true;
              return nomeMatch && servicoMatch && statusMatch && dataMatch;
            })
            .map((item) => (
              <Agenda_Item
                key={item.id}
                id={item.id}
                cliente={item.cliente}
                telefone={item.telefone}
                servico={item.servico}
                data={item.data}
                hora={item.hora}
                status={item.status}
                obs={item.obs}
                onItemClick={() => handleConcluir(item.id)} // Clique no card conclui o serviço
                onClienteClick={() => setView("Lista_clientes")}
                onRemarcar={() => handleReagendar(item.id)}
                onCancelar={() => handleCancelar(item.id)}
              />
            ))}
        </div>
      )}

      {view === "disponibilidade" && <Gestao_Disponibilidade />}

      {view === "novo" && (
  <Form_Agendamento_Funcionario 
    onVoltar={() => setView("home")} 
    // Passamos a nossa função handleCriarAgendamento para ser usada no submit do form
    onSubmit={handleCriarAgendamento} 
  />
)}

      {view === "historico" && (
        <div className="space-y-6">
          <h2 className="md:text-3xl text-2xl font-black uppercase tracking-widest">
            Histórico de Agendamentos
          </h2>

          {/* FILTROS */}
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Filtrar por cliente..."
              className="flex-1 p-3 rounded-xl border border-gray-200 focus:border-[#b5820e] outline-none"
              value={filtroClienteHist}
              onChange={(e) => setFiltroClienteHist(e.target.value)}
            />

            <input
              type="text"
              placeholder="Filtrar por serviço..."
              className="flex-1 p-3 rounded-xl border border-gray-200 focus:border-[#b5820e] outline-none"
              value={filtroServicoHist}
              onChange={(e) => setFiltroServicoHist(e.target.value)}
            />

            <input
              type="date"
              className="p-3 rounded-xl border border-gray-200 focus:border-[#b5820e] outline-none"
              value={filtroDataHist}
              onChange={(e) => setFiltroDataHist(e.target.value)}
            />
            <select
              className="p-3 rounded-xl border border-gray-200 focus:border-[#b5820e] outline-none"
              value={filtroStatus}
              onChange={(e) =>
                setFiltroStatus(
                  e.target.value as
                    | "Confirmado"
                    | "Pendente"
                    | "Cancelado"
                    | "Remarcado"
                    | ""
                )
              }
            >
              <option value="">Todos os Status</option>
              <option value="Confirmado">Confirmado</option>
              <option value="Pendente">Pendente</option>
              <option value="Cancelado">Cancelado</option>
              <option value="Remarcado">Remarcado</option>
            </select>
          </div>

          {/* LISTA DO HISTÓRICO */}
          <div className="space-y-4">
            {agenda

              .filter((item) => isAgendamentoPassado(item.data, item.hora))
              .filter((item) => {
                const clienteMatch = item.cliente
                  .toLowerCase()
                  .includes(filtroClienteHist.toLowerCase());

                const servicoMatch = item.servico
                  .toLowerCase()
                  .includes(filtroServicoHist.toLowerCase());

                const dataMatch = filtroDataHist
                  ? item.data === filtroDataHist
                  : true;

                return clienteMatch && servicoMatch && dataMatch;
              })
              .map((item) => (
                <Agenda_Item
                  id={item.id}
                  cliente={item.cliente}
                  telefone={item.telefone}
                  servico={item.servico}
                  data={item.data}
                  hora={item.hora}
                  status={item.status}
                  obs={item.obs}
                  onItemClick={() => navigate(`/agenda`)}
                  onClienteClick={() => navigate(`/Lista_Clientes`)}
                  onRemarcar={() => alert("Remarcar")}
                  onCancelar={() => alert("Cancelar")}
                />
              ))}

            {/* SEM RESULTADOS */}
            {agenda
              .filter((item) => isAgendamentoPassado(item.data, item.hora))
              .filter((item) => {
                const clienteMatch = item.cliente
                  .toLowerCase()
                  .includes(filtroClienteHist.toLowerCase());
                const servicoMatch = item.servico
                  .toLowerCase()
                  .includes(filtroServicoHist.toLowerCase());
                const dataMatch = filtroDataHist
                  ? item.data === filtroDataHist
                  : true;
                return clienteMatch && servicoMatch && dataMatch;
              }).length === 0 && (
              <p className="text-gray-400 italic">
                Nenhum agendamento encontrado.
              </p>
            )}
          </div>
        </div>
      )}
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

// Subcomponente StatCard
function StatCard({ title, value, icon: Icon, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className="
        relative
        bg-white
        p-4
        rounded-3xl
        border border-gray-300
        shadow-[0_10px_30px_rgba(0,0,0,0.06)]
        cursor-pointer
        transition-all duration-300 ease-out
        hover:-translate-y-1
        hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]
        hover:border-gray-300
        md:mb-20
      "
    >
      {/* Ícone */}
      <div
        className="
        w-14 h-14
        rounded-2xl
        bg-gradient-to-br 
        flex items-center justify-center
        mb-6
      "
      >
        <Icon size={32} className="text-[#b5820e] " />
      </div>

      {/* Texto */}
      <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-2">
        {title}
      </p>

      <p className="md:text-3xl text-2xl font-bold text-gray-900 leading-none mb-2">
        {value}
      </p>

      {/* detalhe visual */}
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-gray-100/40 blur-2xl pointer-events-none" />
    </div>
  );
}
