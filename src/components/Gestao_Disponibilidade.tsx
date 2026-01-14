import React, { useState } from "react";
import {
  Calendar,
  Coffee,
  Utensils,
  Ban,
  Trash2,
  Save,
  Clock,
  Palmtree,
  ChevronRight,
} from "lucide-react";

// Importamos o serviço
import { FuncionarioService } from "../services/Funcionario.service";

/* ================== TIPOS ================== */
interface DiaSemana {
  dia: string;
  ativo: boolean;
  entrada: string;
  saida: string;
  cafeInicio: string;
  cafeFim: string;
  almocoInicio: string;
  almocoFim: string;
}

interface Ferias {
  id: number;
  inicio: string;
  fim: string;
  obs?: string;
}

export function Gestao_Disponibilidade() {
  type AbaAtiva = "rotina" | "ferias" | "bloqueio";
  const [activeTab, setActiveTab] = useState<AbaAtiva>("rotina");

  /* ===== 1. JORNADA SEMANAL (DISPONIBILIDADE) ===== */
  const [semana, setSemana] = useState<DiaSemana[]>(
    ["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado", "Domingo"].map(
      (dia) => ({
        dia,
        ativo: !["Sábado", "Domingo"].includes(dia),
        entrada: "09:00",
        saida: "18:00",
        cafeInicio: "10:30",
        cafeFim: "10:45",
        almocoInicio: "13:00",
        almocoFim: "14:00",
      })
    )
  );

  const atualizarDia = (index: number, campo: keyof DiaSemana, valor: string | boolean) => {
    setSemana((prev) => prev.map((d, i) => (i === index ? { ...d, [campo]: valor } : d)));
  };

  // LIGAÇÃO BACK-END: Enviar horários semanais
  const handleGuardarAgenda = async () => {
    try {
      // router.post("/disponibilidade", ...)
      await FuncionarioService.marcarDisponibilidade({ semana });
      alert("Agenda semanal guardada com sucesso! ✅");
    } catch (error) {
      alert("Erro ao guardar agenda.");
    }
  };

  // ... outros estados anteriores (semana, ferias, etc)

/* ===== FUNÇÃO PARA REMOVER FÉRIAS ===== */
const removerFerias = async (id: number) => {
  if (window.confirm("Deseja remover este período de férias?")) {
    try {
      // 1. Opcional: Se você tiver uma rota no back-end para deletar férias, chame-a aqui
      // await FuncionarioService.removerFerias(id); 

      // 2. Remove do estado local para a lista atualizar na tela
      setFerias((prev) => prev.filter((f) => f.id !== id));
      
    } catch (error) {
      console.error("Erro ao remover férias:", error);
      alert("Não foi possível remover o período de férias.");
    }
  }
};

// ... aqui começa o return (JSX)

  /* ===== 2. FÉRIAS ===== */
  const [ferias, setFerias] = useState<Ferias[]>([]);
  const [inicioFerias, setInicioFerias] = useState("");
  const [fimFerias, setFimFerias] = useState("");
  const [obsFerias, setObsFerias] = useState("");

  // LIGAÇÃO BACK-END: Marcar Férias
  const handleSalvarFerias = async () => {
    if (!inicioFerias || !fimFerias) return alert("Preencha as datas.");
    
    try {
      // router.post("/ferias", ...)
      const novaFeria = { data_inicio: inicioFerias, data_fim: fimFerias, obs: obsFerias };
      await FuncionarioService.marcarFerias(novaFeria);
      
      setFerias([...ferias, { id: Date.now(), inicio: inicioFerias, fim: fimFerias, obs: obsFerias }]);
      setInicioFerias(""); setFimFerias(""); setObsFerias("");
      alert("Período de descanso registado! 🌴");
    } catch (error) {
      alert("Erro ao marcar férias.");
    }
  };

  /* ===== 3. BLOQUEIO DE EMERGÊNCIA ===== */
  const [bloqueioData, setBloqueioData] = useState("");
  const [bloqueioHora, setBloqueioHora] = useState("");

  // LIGAÇÃO BACK-END: Bloquear Horário
  const handleBloquearAgora = async () => {
    if (!bloqueioData || !bloqueioHora) return alert("Selecione data e hora.");

    try {
      // router.post("/bloquear-horario", ...)
      await FuncionarioService.bloquearHorario({
        data: bloqueioData,
        hora: bloqueioHora,
        motivo: "Bloqueio de emergência pelo funcionário"
      });
      alert("Horário bloqueado com sucesso! 🚫");
      setBloqueioData(""); setBloqueioHora("");
    } catch (error) {
      alert("Erro ao bloquear horário.");
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500  sm:px-6 md:px-12">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-black uppercase tracking-tighter">
          Configura sua Agenda Aqui
        </h1>
      </div>

      {/* ABAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <button
          onClick={() => setActiveTab("rotina")}
          className={`p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] text-left transition-all shadow-xl border-b-4 ${
            activeTab === "rotina"
              ? "bg-black text-white border-[#b5820e]"
              : "bg-white text-gray-500 border-transparent hover:bg-gray-50"
          }`}
        >
          <Calendar className="mb-4" size={28} />
          <h3 className="font-bold uppercase tracking-widest text-sm sm:text-base">
            Jornada Semanal
          </h3>
          <p className="text-[10px] sm:text-xs opacity-60 italic mt-1">
            Horários, Café e Almoço
          </p>
        </button>

        <button
          onClick={() => setActiveTab("ferias")}
          className={`p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] text-left transition-all shadow-xl border-b-4 ${
            activeTab === "ferias"
              ? "bg-black text-white border-[#b5820e]"
              : "bg-white text-gray-500 border-transparent hover:bg-gray-50"
          }`}
        >
          <Palmtree className="mb-4" size={28} />
          <h3 className="font-bold uppercase tracking-widest text-sm sm:text-base">
            Plano de Férias
          </h3>
          <p className="text-[10px] sm:text-xs opacity-60 italic mt-1">
            Descanso Anual e Folgas
          </p>
        </button>

        <button
          onClick={() => setActiveTab("bloqueio")}
          className={`p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] text-left transition-all shadow-xl border-b-4 ${
            activeTab === "bloqueio"
              ? "bg-black text-red-500 border-red-500"
              : "bg-white text-gray-500 border-transparent hover:bg-gray-50"
          }`}
        >
          <Ban className="mb-4" size={28} />
          <h3 className="font-bold uppercase tracking-widest text-sm sm:text-base">
            Bloqueio Emergência
          </h3>
          <p className="text-[10px] sm:text-xs opacity-60 italic mt-1">
            Encerrar agenda imediatamente
          </p>
        </button>
      </div>

      {/* CONTEÚDO */}
      <div className="rounded-[2rem] sm:rounded-[3rem]  sm:p-6 md:p-12">
        {/* JORNADA SEMANAL */}
        {activeTab === "rotina" && (
          <div className="space-y-6 animate-in slide-in-from-left-4 duration-300">
            {semana.map((d, i) => (
              <div
                key={d.dia}
                className={`p-4 sm:p-6 rounded-2xl sm:rounded-3xl border transition-all ${
                  !d.ativo
                    ? "bg-gray-50 opacity-50"
                    : "bg-white border-gray-100 shadow-sm"
                }`}
              >
                <div className="flex flex-col-2 sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
                  <span className="font-black text-lg sm:text-xl text-black uppercase tracking-tight mb-2 sm:mb-0">
                    {d.dia}
                  </span>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <span className="text-[10px] sm:text-xs font-black uppercase text-gray-400">
                      Ativo
                    </span>
                    <input
                      type="checkbox"
                      checked={d.ativo}
                      onChange={(e) =>
                        atualizarDia(i, "ativo", e.target.checked)
                      }
                      className="w-5 h-5 accent-black"
                    />
                  </label>
                </div>

                {d.ativo && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8">
                    {/* Entrada/Saída */}
                    <div className="space-y-2 sm:space-y-3">
                      <p className="text-[10px] sm:text-xs font-black text-[#b5820e] uppercase flex items-center gap-2">
                        <Clock size={12} /> Turno Geral
                      </p>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <input
                          type="time"
                          value={d.entrada}
                          onChange={(e) =>
                            atualizarDia(i, "entrada", e.target.value)
                          }
                          className="p-2 sm:p-2.5 bg-gray-50 rounded-lg text-xs sm:text-sm font-bold border-none"
                        />
                        <ChevronRight size={14} className="text-gray-300" />
                        <input
                          type="time"
                          value={d.saida}
                          onChange={(e) =>
                            atualizarDia(i, "saida", e.target.value)
                          }
                          className="p-2 sm:p-2.5 bg-gray-50 rounded-lg text-xs sm:text-sm font-bold border-none"
                        />
                      </div>
                    </div>

                    {/* Café */}
                    <div className="space-y-2 sm:space-y-3">
                      <p className="text-[10px] sm:text-xs font-black text-[#b5820e] uppercase flex items-center gap-2">
                        <Coffee size={12} /> Pausa Café
                      </p>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <input
                          type="time"
                          value={d.cafeInicio}
                          onChange={(e) =>
                            atualizarDia(i, "cafeInicio", e.target.value)
                          }
                          className="p-2 sm:p-2.5 bg-gray-50 rounded-lg text-xs sm:text-sm font-bold border-none"
                        />
                        <ChevronRight size={14} className="text-gray-300" />
                        <input
                          type="time"
                          value={d.cafeFim}
                          onChange={(e) =>
                            atualizarDia(i, "cafeFim", e.target.value)
                          }
                          className="p-2 sm:p-2.5 bg-gray-50 rounded-lg text-xs sm:text-sm font-bold border-none"
                        />
                      </div>
                    </div>

                    {/* Almoço */}
                    <div className="space-y-2 sm:space-y-3">
                      <p className="text-[10px] sm:text-xs font-black text-[#b5820e] uppercase flex items-center gap-2">
                        <Utensils size={12} /> Almoço
                      </p>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <input
                          type="time"
                          value={d.almocoInicio}
                          onChange={(e) =>
                            atualizarDia(i, "almocoInicio", e.target.value)
                          }
                          className="p-2 sm:p-2.5 bg-gray-50 rounded-lg text-xs sm:text-sm font-bold border-none"
                        />
                        <ChevronRight size={14} className="text-gray-300" />
                        <input
                          type="time"
                          value={d.almocoFim}
                          onChange={(e) =>
                            atualizarDia(i, "almocoFim", e.target.value)
                          }
                          className="p-2 sm:p-2.5 bg-gray-50 rounded-lg text-xs sm:text-sm font-bold border-none"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div className="flex justify-end items-end mb-8">
              <button onClick={handleGuardarAgenda} className="bg-black text-[#b5820e] px-6 sm:px-8 py-3 sm:py-3.5 rounded-2xl font-black uppercase text-xs sm:text-sm tracking-widest flex items-center gap-2 shadow-lg">
                <Save size={18} /> Guardar Agenda
              </button>
            </div>
          </div>
        )}

        {/* FÉRIAS */}
        {activeTab === "ferias" && (
          <div className="animate-in slide-in-from-right-4 duration-300">
            <div className="bg-gray-900 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-8 md:p-12 text-white relative overflow-hidden shadow-2xl mb-10">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Palmtree size={180} className="text-[#b5820e]" />
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl sm:text-3xl md:text-3xl font-serif font-black text-[#b5820e] uppercase mb-4 italic leading-none">
                  Agendar Descanso
                </h3>
                <p className="text-gray-400 text-sm sm:text-base mb-10 max-w-full md:max-w-md">
                  Bloqueie datas futuras para férias ou licenças prolongadas.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="text-[10px] sm:text-xs font-black uppercase text-[#b5820e] tracking-widest">
                      Data Inicial
                    </label>
                    <input
                      type="date"
                      value={inicioFerias}
                      onChange={(e) => setInicioFerias(e.target.value)}
                      className="w-full p-3 sm:p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-[#b5820e] text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] sm:text-xs font-black uppercase text-[#b5820e] tracking-widest">
                      Data Final
                    </label>
                    <input
                      type="date"
                      value={fimFerias}
                      onChange={(e) => setFimFerias(e.target.value)}
                      className="w-full p-3 sm:p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-[#b5820e] text-white"
                    />
                  </div>
                </div>

                <textarea
                  placeholder="Notas ou motivo (Opcional)"
                  value={obsFerias}
                  onChange={(e) => setObsFerias(e.target.value)}
                  className="w-full p-3 sm:p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-[#b5820e] text-white mb-6 h-24"
                />

                <button
                  onClick={handleSalvarFerias}
                  className="w-full bg-[#b5820e] text-black py-4 sm:py-5 rounded-2xl font-black uppercase text-xs sm:text-sm tracking-[0.3em] hover:bg-white transition-all shadow-xl"
                >
                  Confirmar Período de Férias
                </button>
              </div>
            </div>

            {/* LISTA DE FÉRIAS */}
            <div className="space-y-4">
              <h5 className="text-[10px] sm:text-xs font-black uppercase text-gray-400 tracking-widest ml-2 sm:ml-4">
                Férias Programadas
              </h5>
              {ferias.length === 0 ? (
                <p className="text-gray-300 italic text-sm ml-2 sm:ml-4">
                  Sem períodos de descanso marcados.
                </p>
              ) : (
                ferias.map((f) => (
                  <div
                    key={f.id}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-6 bg-gray-50 rounded-[1.5rem] sm:rounded-[2rem] border border-gray-100"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                      <div className="p-2 sm:p-3 bg-white rounded-xl text-[#b5820e] shadow-sm">
                        <Palmtree size={20} />
                      </div>
                      <div>
                        <p className="font-black text-black uppercase tracking-tight text-sm sm:text-base">
                          {new Date(f.inicio).toLocaleDateString()} —{" "}
                          {new Date(f.fim).toLocaleDateString()}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-400 italic">
                          {f.obs || "Sem observações"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removerFerias(f.id)}
                      className="mt-2 sm:mt-0 p-2 sm:p-3 text-red-400 hover:bg-red-50 rounded-xl transition"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* BLOQUEIO */}
      {activeTab === "bloqueio" && (
        <div className="bg-black rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Ban size={120} className="text-red-500" />
          </div>
          <div className="relative z-10">
            <h3 className="text-xl sm:text-2xl md:text-2xl font-black uppercase tracking-tighter mb-2 italic">
              Bloqueio de <span className="text-red-500">Emergência</span>
            </h3>
            <p className="text-gray-400 text-sm sm:text-base mb-6 sm:mb-8">
              Use isto para fechar a agenda imediatamente por motivos de força
              maior.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <input
                type="date"
                value={bloqueioData}
                onChange={(e) => setBloqueioData(e.target.value)}
                className="flex-1 p-3 sm:p-4 bg-white/10 border border-white/10 rounded-2xl outline-none focus:border-red-500"
              />
              <input
                type="time"
                value={bloqueioHora}
                onChange={(e) => setBloqueioHora(e.target.value)}
                className="flex-1 p-3 sm:p-4 bg-white/10 border border-white/10 rounded-2xl outline-none focus:border-red-500"
              />
              <button
                onClick={handleBloquearAgora}
                className="bg-red-600 text-white px-6 sm:px-10 py-3 sm:py-4 rounded-2xl font-black uppercase text-xs sm:text-sm tracking-widest hover:bg-red-700 transition"
              >
                Bloquear Agora
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
