import React, { useState, useEffect } from "react";
import { Users, Save, Calendar, ChevronRight, Search } from "lucide-react";
import { FuncionarioService } from "../services/Funcionario.service";

export function Gestao_Disponibilidade() {
  const [profissionais, setProfissionais] = useState<any[]>([]);
  const [selectedProfId, setSelectedProfId] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [semana, setSemana] = useState([
    "Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"
  ].map(dia => ({ dia, ativo: true, entrada: "09:00", saida: "18:00" })));

  // 1. Carrega a lista de profissionais ao abrir
  useEffect(() => {
    FuncionarioService.listarProfissionais().then(setProfissionais);
  }, []);

  // 2. Sempre que mudar o profissional, busca a agenda dele no banco
  useEffect(() => {
    if (!selectedProfId) return;

    const carregarAgendaDoProfissional = async () => {
      setLoading(true);
      try {
        const dadosBanco = await FuncionarioService.obterDisponibilidadeAdm(selectedProfId);
        
        const mapaDiasInverso = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
        
        // Resetar para padrão e mesclar com o que vem do banco
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

    carregarAgendaDoProfissional();
  }, [selectedProfId]);

  const handleSalvar = async () => {
    if (!selectedProfId) return alert("Selecione um profissional primeiro!");
    
    setLoading(true);
    try {
      await FuncionarioService.marcarDisponibilidadeAdm({
        funcionario_id: selectedProfId,
        semana
      });
      alert("Agenda atualizada com sucesso! ✨");
    } catch (e) {
      alert("Erro ao salvar.");
    } finally {
      setLoading(false);
    }
  };

  const atualizarDia = (index: number, campo: string, valor: any) => {
    setSemana(prev => prev.map((d, i) => i === index ? { ...d, [campo]: valor } : d));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">Configurar <span className="text-[#b5820e]">Horários</span></h1>
          <p className="text-gray-400 text-sm font-bold uppercase mt-1">Gestão de Equipa — Receção</p>
        </div>

        {/* SELETOR DE PROFISSIONAL */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-4 top-4 text-[#b5820e]" size={18} />
          <select 
            className="w-full p-4 pl-12 bg-gray-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-[#b5820e] appearance-none"
            value={selectedProfId}
            onChange={(e) => setSelectedProfId(e.target.value)}
          >
            <option value="">Escolher Profissional...</option>
            {profissionais.map(p => (
              <option key={p.id} value={p.id}>{p.nome}</option>
            ))}
          </select>
        </div>
      </header>

      {!selectedProfId ? (
        <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
          <Users size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-400 font-bold uppercase text-sm tracking-widest">Selecione um profissional acima para gerir a sua agenda.</p>
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in zoom-in duration-300">
          {semana.map((d, i) => (
            <div key={d.dia} className={`p-6 rounded-[2rem] border flex flex-col md:flex-row justify-between items-center transition-all ${!d.ativo ? "bg-gray-50 opacity-40" : "bg-white shadow-md border-gray-100"}`}>
              <div className="flex items-center gap-6 w-full md:w-1/3">
                <input type="checkbox" checked={d.ativo} onChange={e => atualizarDia(i, 'ativo', e.target.checked)} className="w-6 h-6 accent-black" />
                <span className="font-black text-xl uppercase tracking-tighter">{d.dia}</span>
              </div>

              {d.ativo && (
                <div className="flex items-center gap-4 mt-4 md:mt-0">
                  <input type="time" value={d.entrada} onChange={e => atualizarDia(i, 'entrada', e.target.value)} className="p-3 bg-gray-100 rounded-xl font-bold" />
                  <ChevronRight size={20} className="text-[#b5820e]" />
                  <input type="time" value={d.saida} onChange={e => atualizarDia(i, 'saida', e.target.value)} className="p-3 bg-gray-100 rounded-xl font-bold" />
                </div>
              )}
            </div>
          ))}

          <div className="flex justify-end pt-6">
            <button 
              onClick={handleSalvar}
              disabled={loading}
              className="bg-black text-[#b5820e] px-12 py-5 rounded-2xl font-black uppercase text-sm tracking-[0.2em] shadow-2xl flex items-center gap-3 hover:scale-105 transition-all disabled:opacity-50"
            >
              <Save size={20} /> {loading ? "A Guardar..." : "Atualizar Agenda do Profissional"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}