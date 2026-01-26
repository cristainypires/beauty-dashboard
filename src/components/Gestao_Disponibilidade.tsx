import React, { useState, useEffect } from "react";
import { 
  Users, Save, Calendar, ChevronRight, Search, 
  Lock, Plane, Clock, AlertCircle 
} from "lucide-react";
import { FuncionarioService } from "../services/Funcionario.service";

export function Gestao_Disponibilidade() {
  const [profissionais, setProfissionais] = useState<any[]>([]);
  const [selectedProfId, setSelectedProfId] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"semanal" | "bloqueio" | "ferias">("semanal");
  
  // Estado para Agenda Semanal
  const [semana, setSemana] = useState([
     "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado","Domingo"
  ].map(dia => ({ dia, ativo: true, entrada: "09:00", saida: "19:00" })));

  // Estados para Bloqueio e Férias
  const [bloqueio, setBloqueio] = useState({ data: "", hora: "", motivo: "" });
  const [ferias, setFerias] = useState({ data_inicio: "", data_fim: "" });

  useEffect(() => {
    FuncionarioService.listarProfissionais().then(setProfissionais);
  }, []);

  useEffect(() => {
    if (!selectedProfId) return;
    carregarAgendaDoProfissional();
  }, [selectedProfId]);

  const carregarAgendaDoProfissional = async () => {
    setLoading(true);
    try {
      const dadosBanco = await FuncionarioService.obterDisponibilidade(selectedProfId);
      const mapaDiasInverso = [ "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado","Domingo"];
      
      const novaSemana = semana.map(diaLocal => {
        const diaNoBanco = dadosBanco.find((d: any) => mapaDiasInverso[d.dia_semana] === diaLocal.dia);
        return diaNoBanco ? {
          ...diaLocal,
          ativo: diaNoBanco.disponivel,
          entrada: diaNoBanco.hora_inicio.substring(0, 5),
          saida: diaNoBanco.hora_fim.substring(0, 5)
        } : { ...diaLocal, ativo: false };
      });
      setSemana(novaSemana);
    } catch (e) {
      console.error("Erro ao carregar agenda");
    } finally {
      setLoading(false);
    }
  };

  const handleSalvarSemanal = async () => {
    setLoading(true);
    try {
      await FuncionarioService.marcarDisponibilidade({ funcionario_id: selectedProfId, semana });
      alert("Horários semanais atualizados! ✨");
    } catch (e) { alert("Erro ao salvar horários."); }
    finally { setLoading(false); }
  };

  const handleBloquearHorario = async () => {
    if(!bloqueio.data || !bloqueio.hora) return alert("Preencha data e hora!");
    setLoading(true);
    try {
      // Adaptamos para enviar o ID do profissional selecionado (ADM mode)
      await FuncionarioService.bloquearHorario({ ...bloqueio, funcionario_id: selectedProfId });
      alert("Horário bloqueado com sucesso! 🔒");
      setBloqueio({ data: "", hora: "", motivo: "" });
    } catch (e) { alert("Erro ao bloquear."); }
    finally { setLoading(false); }
  };

  const handleMarcarFerias = async () => {
    if(!ferias.data_inicio || !ferias.data_fim) return alert("Preencha o período!");
    setLoading(true);
    try {
      await FuncionarioService.marcarFerias({ ...ferias, funcionario_id: selectedProfId });
      alert("Férias registradas! ✈️");
      setFerias({ data_inicio: "", data_fim: "" });
    } catch (e) { alert("Erro ao registrar férias."); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-6">
      {/* HEADER IGUAL AO SEU */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">Gestão de <span className="text-[#b5820e]">Disponibilidade</span></h1>
          <p className="text-gray-400 text-sm font-bold uppercase mt-1">Configurações de Agenda do Profissional</p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-4 top-4 text-[#b5820e]" size={18} />
          <select 
            className="w-full p-4 pl-12 bg-gray-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-[#b5820e] appearance-none"
            value={selectedProfId}
            onChange={(e) => setSelectedProfId(e.target.value)}
          >
            <option value="">Escolher Profissional...</option>
            {profissionais.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
          </select>
        </div>
      </header>

      {!selectedProfId ? (
        <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
          <Users size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-400 font-bold uppercase text-sm tracking-widest">Selecione um profissional para gerir a agenda.</p>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in duration-500">
          
          {/* MENU DE ABAS */}
          <div className="flex flex-wrap gap-2 p-1 bg-gray-100 rounded-3xl w-fit">
            <TabBtn active={activeTab === "semanal"} onClick={() => setActiveTab("semanal")} icon={<Clock size={16}/>} label="Agenda Semanal" />
            <TabBtn active={activeTab === "bloqueio"} onClick={() => setActiveTab("bloqueio")} icon={<Lock size={16}/>} label="Bloquear Horário" />
            <TabBtn active={activeTab === "ferias"} onClick={() => setActiveTab("ferias")} icon={<Plane size={16}/>} label="Férias / Ausência" />
          </div>

          {/* CONTEÚDO: SEMANAL */}
          {activeTab === "semanal" && (
            <div className="space-y-4">
              {semana.map((d, i) => (
                <div key={d.dia} className={`p-6 rounded-[2rem] border flex flex-col md:flex-row justify-between items-center transition-all ${!d.ativo ? "bg-gray-50 opacity-40" : "bg-white shadow-md border-gray-100"}`}>
                  <div className="flex items-center gap-6 w-full md:w-1/3">
                    <input type="checkbox" checked={d.ativo} onChange={e => {
                       const nova = [...semana];
                       nova[i].ativo = e.target.checked;
                       setSemana(nova);
                    }} className="w-6 h-6 accent-black cursor-pointer" />
                    <span className="font-black text-xl uppercase tracking-tighter">{d.dia}</span>
                  </div>
                  {d.ativo && (
                    <div className="flex items-center gap-4 mt-4 md:mt-0">
                      <input type="time" value={d.entrada} onChange={e => {
                         const nova = [...semana];
                         nova[i].entrada = e.target.value;
                         setSemana(nova);
                      }} className="p-3 bg-gray-100 rounded-xl font-bold border-none" />
                      <ChevronRight size={20} className="text-[#b5820e]" />
                      <input type="time" value={d.saida} onChange={e => {
                         const nova = [...semana];
                         nova[i].saida = e.target.value;
                         setSemana(nova);
                      }} className="p-3 bg-gray-100 rounded-xl font-bold border-none" />
                    </div>
                  )}
                </div>
              ))}
              <SaveButton onClick={handleSalvarSemanal} loading={loading} text="Atualizar Agenda Semanal" />
            </div>
          )}

          {/* CONTEÚDO: BLOQUEIO */}
          {activeTab === "bloqueio" && (
            <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center gap-3 text-red-600 mb-4">
                <AlertCircle size={20} />
                <p className="text-xs font-bold uppercase tracking-widest">O horário bloqueado ficará indisponível para agendamentos online.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 block mb-2">Data do Bloqueio</label>
                  <input type="date" value={bloqueio.data} onChange={e => setBloqueio({...bloqueio, data: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl font-bold" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 block mb-2">Hora (Início)</label>
                  <input type="time" value={bloqueio.hora} onChange={e => setBloqueio({...bloqueio, hora: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl font-bold" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 block mb-2">Motivo (Opcional)</label>
                  <input type="text" placeholder="Ex: Médico" value={bloqueio.motivo} onChange={e => setBloqueio({...bloqueio, motivo: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl font-bold" />
                </div>
              </div>
              <SaveButton onClick={handleBloquearHorario} loading={loading} text="Confirmar Bloqueio" />
            </div>
          )}

          {/* CONTEÚDO: FÉRIAS */}
          {activeTab === "ferias" && (
            <div className="bg-black text-white p-10 rounded-[2.5rem] shadow-2xl space-y-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#b5820e] rounded-2xl text-black">
                  <Plane size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase italic">Marcar Período de Ausência</h3>
                  <p className="text-gray-400 text-sm">O profissional não aparecerá na lista de agendamentos nestas datas.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-[#b5820e]">Data de Início</label>
                  <input type="date" value={ferias.data_inicio} onChange={e => setFerias({...ferias, data_inicio: e.target.value})} className="w-full p-5 bg-zinc-900 border border-zinc-800 rounded-2xl font-bold text-white focus:border-[#b5820e] outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-[#b5820e]">Data de Término</label>
                  <input type="date" value={ferias.data_fim} onChange={e => setFerias({...ferias, data_fim: e.target.value})} className="w-full p-5 bg-zinc-900 border border-zinc-800 rounded-2xl font-bold text-white focus:border-[#b5820e] outline-none" />
                </div>
              </div>

              <button 
                onClick={handleMarcarFerias}
                disabled={loading}
                className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-[#b5820e] transition-colors disabled:opacity-50"
              >
                {loading ? "Processando..." : "Registrar Período de Folga / Férias"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Subcomponentes para manter o código limpo
function TabBtn({ active, onClick, icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-xs uppercase transition-all ${active ? "bg-white text-[#b5820e] shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
    >
      {icon} {label}
    </button>
  );
}

function SaveButton({ onClick, loading, text }: any) {
  return (
    <div className="flex justify-end pt-4">
      <button 
        onClick={onClick}
        disabled={loading}
        className="bg-black text-[#b5820e] px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
      >
        <Save size={18} /> {loading ? "A Guardar..." : text}
      </button>
    </div>
  );
}