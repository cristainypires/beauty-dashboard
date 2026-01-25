import React, { useState, useEffect } from "react";
import { Save, User, Scissors, Phone, Users, UserPlus, Mail, ArrowLeft } from "lucide-react";
import { FuncionarioService } from "../services/Funcionario.service";

interface FormProps {
  onVoltar: () => void;
  onSubmit: () => void;
}

export function Form_Agendamento_Funcionario({ onVoltar, onSubmit }: FormProps) {
  const [loading, setLoading] = useState(false);
  
  // Listas do Banco
  const [servicos, setServicos] = useState<any[]>([]);
  const [profissionais, setProfessionais] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);

  // Toggle Cliente Novo vs Existente
  const [isNovoCliente, setIsNovoCliente] = useState(false);

  // Estados dos Campos
  const [clienteId, setClienteId] = useState("");
  const [nomeNovo, setNomeNovo] = useState("");
  const [telefoneNovo, setTelefoneNovo] = useState(""); 
  const [emailNovo, setEmailNovo] = useState("");
  const [servicoId, setServicoId] = useState("");
  const [funcionarioId, setFuncionarioId] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [s, p, c] = await Promise.all([
          FuncionarioService.listarServicos(),
          FuncionarioService.listarProfissionais(),
          FuncionarioService.listarClientes()
        ]);
        setServicos(s || []);
        setProfessionais(p || []);
        setClientes(c || []);
      } catch (e) { console.error("Erro ao carregar dados", e); }
    };
    carregarDados();
  }, []);

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value.replace(/\D/g, ""); 
    if (valor.length <= 7) setTelefoneNovo(valor);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isNovoCliente) {
      if (!nomeNovo || !emailNovo) return alert("Preencha nome e e-mail.");
      if (telefoneNovo.length !== 7) return alert("O telefone deve ter exatamente 7 dígitos.");
    } else {
      if (!clienteId) return alert("Selecione um cliente.");
    }

    if (!servicoId || !funcionarioId || !data || !hora) return alert("Preencha todos os campos.");

    setLoading(true);
    try {
      const payload = {
        servico_id: Number(servicoId),
        funcionario_id: Number(funcionarioId),
        data_hora_inicio: `${data}T${hora}:00`,
        cliente_id: isNovoCliente ? null : Number(clienteId),
        novo_cliente_nome: isNovoCliente ? nomeNovo : null,
        novo_cliente_telefone: isNovoCliente ? telefoneNovo : null,
        novo_cliente_email: isNovoCliente ? emailNovo : null,
      };

      const res = await FuncionarioService.fazerNovoAgendamento(payload);
      
      alert(res.mensagem || "Agendamento realizado!");
      onSubmit();
      onVoltar();
    } catch (error: any) {
      alert(error.response?.data?.erro || "Erro ao processar agendamento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl w-full mx-auto bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-300">
      <div className="flex justify-between items-center mb-10">
        <button onClick={onVoltar} className="text-gray-400 hover:text-black transition-colors flex items-center gap-2 font-bold uppercase text-[10px]">
          <ArrowLeft size={16} /> Voltar
        </button>
        <h2 className="text-3xl font-serif font-black uppercase tracking-tighter text-center">
          Nova <span className="text-[#b5820e]">Marcação</span>
        </h2>
        <div className="w-16"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* ÁREA DO CLIENTE */}
        <div className="bg-amber-50 p-8 rounded-[2.5rem] border border-amber-100 shadow-sm">
          <div className="flex gap-4 mb-8">
            <button 
              type="button" 
              onClick={() => setIsNovoCliente(false)} 
              className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase transition-all ${!isNovoCliente ? 'bg-black text-white shadow-xl' : 'bg-white text-gray-400 border'}`}
            >
              Cliente da Casa
            </button>
            <button 
              type="button" 
              onClick={() => setIsNovoCliente(true)} 
              className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase transition-all ${isNovoCliente ? 'bg-[#b5820e] text-white shadow-xl' : 'bg-white text-gray-400 border'}`}
            >
              <UserPlus size={14} className="inline mr-2" /> Novo Cadastro
            </button>
          </div>

          {!isNovoCliente ? (
            <div className="relative">
              <User className="absolute left-4 top-4 text-[#b5820e]" size={20} />
              <select 
                className="w-full p-4 pl-12 bg-white rounded-2xl font-bold outline-none shadow-sm border-none focus:ring-2 focus:ring-[#b5820e] appearance-none"
                value={clienteId} 
                onChange={(e) => setClienteId(e.target.value)}
              >
                <option value="">Pesquisar cliente...</option>
                {clientes.map(c => <option key={c.id} value={c.id}>{c.nome} - {c.numero_telefone}</option>)}
              </select>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  placeholder="Nome Completo" 
                  className="p-4 bg-white rounded-2xl font-bold outline-none shadow-sm border-none focus:ring-2 focus:ring-[#b5820e]" 
                  value={nomeNovo} 
                  onChange={(e) => setNomeNovo(e.target.value)} 
                />
                <input 
                  placeholder="Telefone (7 dígitos)" 
                  className="p-4 bg-white rounded-2xl font-bold outline-none shadow-sm border-2 border-amber-200 focus:border-[#b5820e]" 
                  value={telefoneNovo} 
                  onChange={handleTelefoneChange}
                  maxLength={7}
                />
              </div>
              <input 
                type="email" 
                placeholder="E-mail do Cliente" 
                className="w-full p-4 bg-white rounded-2xl font-bold outline-none shadow-sm border-none focus:ring-2 focus:ring-[#b5820e]" 
                value={emailNovo} 
                onChange={(e) => setEmailNovo(e.target.value)} 
              />
              <p className="text-[9px] text-amber-700 font-bold uppercase tracking-wider ml-2 italic">
                * A senha de acesso será os 7 dígitos do telefone.
              </p>
            </div>
          )}
        </div>

        {/* PROFISSIONAL E SERVIÇO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-4">Quem vai atender?</label>
            <select required className="w-full p-4 bg-gray-50 rounded-2xl font-bold outline-none border-none focus:ring-2 focus:ring-[#b5820e]" value={funcionarioId} onChange={(e) => setFuncionarioId(e.target.value)}>
              <option value="">Selecione o profissional...</option>
              {profissionais.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-4">Qual o serviço?</label>
            <select required className="w-full p-4 bg-gray-50 rounded-2xl font-bold outline-none border-none focus:ring-2 focus:ring-[#b5820e]" value={servicoId} onChange={(e) => setServicoId(e.target.value)}>
              <option value="">Selecione o serviço...</option>
              {servicos.map(s => <option key={s.id} value={s.id}>{s.nome_servico} ({s.preco}€)</option>)}
            </select>
          </div>
        </div>

        {/* DATA E HORA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-4">Data</label>
              <input type="date" required className="w-full p-4 bg-gray-50 rounded-2xl font-bold outline-none border-none focus:ring-2 focus:ring-[#b5820e]" value={data} onChange={(e) => setData(e.target.value)} />
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-4">Horário</label>
              <input type="time" required className="w-full p-4 bg-gray-50 rounded-2xl font-bold outline-none border-none focus:ring-2 focus:ring-[#b5820e]" value={hora} onChange={(e) => setHora(e.target.value)} />
           </div>
        </div>

        <button type="submit" disabled={loading} className="w-full py-6 bg-black text-[#b5820e] rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50">
          {loading ? "Sincronizando..." : "Finalizar Agendamento"}
        </button>
      </form>
    </div>
  );
}