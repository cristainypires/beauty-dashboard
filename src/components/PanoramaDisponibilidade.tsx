import React, { useState, useEffect } from "react";
import { Clock, ShieldAlert, Plane, User, Calendar as CalendarIcon, Info, CheckCircle, XCircle } from "lucide-react";
import { FuncionarioService } from "../services/Funcionario.service";
import dayjs from "dayjs";

export function PanoramaDisponibilidade() {
  const [profissionais, setProfissionais] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [dados, setDados] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const diasSemana = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

  useEffect(() => {
    FuncionarioService.listarProfissionais().then(setProfissionais);
  }, []);

  useEffect(() => {
    if (selectedId) {
      setLoading(true);
      // Aqui chamarias a nova rota de panorama que criamos no passo 1
      FuncionarioService.obterPanoramaCompleto(selectedId)
        .then(setDados)
        .finally(() => setLoading(false));
    }
  }, [selectedId]);

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      {/* HEADER & SELETOR */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="mb-6">
  <h1 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-gray-900">
    Agenda <span className="text-[#b5820e]">Geral</span> dos Profissionais 📅
  </h1>
  <p className=" text-gray-500 text-sm md:text-base mt-5 font-semibold uppercase tracking-wide flex items-center gap-1">
    <Clock size={14} className="text-[#b5820e]" /> Controle de Escalas e Ausências
  </p>
</div>

        <select 
  className="w-full md:w-72 p-4 bg-gray-50 rounded-2xl font-bold border-2 border-transparent focus:border-[#b5820e] outline-none"
  value={selectedId} // Adicione o value para o componente ser controlado
  onChange={(e) => setSelectedId(e.target.value)}
>
  <option value="">Escolher Profissional...</option>
  {/* O sinal de interrogação profissionais?. evita erros se a lista for nula */}
  {profissionais?.length > 0 && profissionais.map(p => (
    <option key={p.id} value={p.id}>{p.nome}</option>
  ))}
</select>
      </div>

      {!dados ? (
        <div className="text-center py-24 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
           <User size={48} className="mx-auto text-gray-300 mb-4" />
           <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">Selecione um profissional para ver a disponibilidade total</p>
        </div>
      ) : (
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

  {/* ESTADO DE FÉRIAS / STATUS */}
  <div className="space-y-6">
    <div className={`p-8 rounded-[2.5rem] shadow-2xl transition-all duration-300 hover:scale-[1.02] ${dados.profissional.ativo ? 'bg-black text-white' : 'bg-red-600 text-white'}`}>
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-white/10 rounded-2xl flex items-center justify-center">
          <Plane size={24} />
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">
          {dados.profissional.ativo ? "Em Atividade ✅" : "Em Férias / Ausente ✈️"}
        </span>
      </div>
      <h2 className="text-2xl md:text-3xl font-black uppercase leading-tight">{dados.profissional.nome}</h2>
      <p className="text-white/70 text-xs mt-2 font-bold uppercase tracking-widest">Status Atual do Sistema</p>
    </div>

    <div className="bg-amber-50 p-6 rounded-[2rem] border border-amber-100 flex gap-4 items-start">
      <Info className="text-[#b5820e] shrink-0 mt-1" />
      <p className="text-xs text-amber-800 leading-relaxed font-medium">
        Este panorama ajuda a receção a decidir se pode realizar marcações manuais. 
        Bloqueios em vermelho representam imprevistos registados.
      </p>
    </div>
  </div>

  {/* DISPONIBILIDADE SEMANAL (ESCALA) */}
  <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
      <Clock size={16} /> Escala Semanal Fixa
    </h3>
    <div className="space-y-3">
      {diasSemana.map((diaNome, index) => {
        const diaEscala = dados.escala.find((e: any) => e.dia_semana === index);
        return (
          <div key={diaNome} className={`flex justify-between items-center p-3 rounded-xl transition-colors duration-200 ${!diaEscala?.disponivel ? 'opacity-40 bg-gray-50' : 'bg-gray-50/50 hover:bg-gray-100'}`}>
            <span className="text-xs font-bold text-gray-600">{diaNome}</span>
            {diaEscala?.disponivel ? (
              <span className="text-xs font-black text-gray-800">{diaEscala.hora_inicio.substring(0,5)} - {diaEscala.hora_fim.substring(0,5)}</span>
            ) : (
              <span className="text-[10px] font-black uppercase text-gray-400">Folga 💤</span>
            )}
          </div>
        );
      })}
    </div>
  </div>

  {/* BLOQUEIOS PONTUAIS (IMPREVISTOS) */}
  <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
      <ShieldAlert size={16} className="text-red-500" /> Bloqueios de Horário
    </h3>
    <div className="space-y-4">
      {dados.bloqueios.length === 0 ? (
        <div className="text-center py-10">
          <CheckCircle size={32} className="mx-auto text-green-400 mb-2" />
          <p className="text-[10px] font-black uppercase text-gray-300">Nenhum imprevisto registado</p>
        </div>
      ) : (
        dados.bloqueios.map((b: any, i: number) => (
          <div key={i} className="group p-4 bg-red-50 rounded-2xl border border-red-100 hover:bg-red-100 transition-colors duration-300 cursor-pointer">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-black text-red-600 uppercase">Bloqueado ⛔</span>
              <span className="text-[10px] font-bold text-red-400">{dayjs(b.data_hora_inicio).format('DD MMM')}</span>
            </div>
            <p className="text-sm font-black text-red-900">{b.motivo || "Imprevisto"}</p>
            <p className="text-[10px] font-bold text-red-400 mt-1">
              {dayjs(b.data_hora_inicio).format('HH:mm')} às {dayjs(b.data_hora_fim).format('HH:mm')}
            </p>
          </div>
        ))
      )}
    </div>
  </div>

</div>

      )}
    </div>
  );
}