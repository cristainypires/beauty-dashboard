import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  User,
  Mail,
  Phone,
  Lock,
  Calendar,
  Save,
  Eye,
  EyeOff,
  ToggleLeft,
  ToggleRight,
  AlertCircle,
  Check,
  Scissors,
} from "lucide-react";
import { listarServicos } from "../services/Admin.service";

// --- INTERFACES ---
interface Funcionario {
  id?: number;
  nome: string;
  apelido?: string;
  email: string;
  telefone?: string;
  nascimento?: string;
  especialidade?: string; // Mantido por compatibilidade
  senha?: string;
  status: "Ativo" | "Inativo";
  servicos_ids: number[]; // Novo campo para associação múltipla
}

interface ServicoDB {
  id: number;
  nome: string;
  nome_servico?: string;
  preco: number;
}

interface Props {
  onVoltar: () => void;
  onSalvar?: (dados: Funcionario) => Promise<void>;
  funcionarioParaEditar?: any; // Recebe o objeto do backend
}

export function Formulario_Funcionario({
  onVoltar,
  onSalvar,
  funcionarioParaEditar,
}: Props) {
  const modoEdicao = !!funcionarioParaEditar;
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erros, setErros] = useState<{ [key: string]: string }>({});
  
  // Estados para serviços do banco
  const [listaServicosDB, setListaServicosDB] = useState<ServicoDB[]>([]);
  const [servicosSelecionados, setServicosSelecionados] = useState<number[]>([]);

  const [formData, setFormData] = useState<Funcionario>({
    nome: "",
    apelido: "",
    email: "",
    telefone: "",
    nascimento: "",
    especialidade: "",
    senha: "",
    status: "Ativo",
    servicos_ids: [],
  });

  // 1. Carregar Serviços e Dados para Edição
  useEffect(() => {
    const carregarDados = async () => {
      try {
        const dados = await listarServicos();
        const arrayServicos = Array.isArray(dados) ? dados : dados?.data || [];
        setListaServicosDB(arrayServicos);
      } catch (error) {
        console.error("Erro ao carregar serviços:", error);
      }
    };

    carregarDados();

    if (funcionarioParaEditar) {
      setFormData({
        nome: funcionarioParaEditar.nome || "",
        apelido: funcionarioParaEditar.apelido || "",
        email: funcionarioParaEditar.email || "",
        telefone: funcionarioParaEditar.telefone || "",
        nascimento: funcionarioParaEditar.data_nascimento || funcionarioParaEditar.nascimento || "",
        status: funcionarioParaEditar.ativo !== false ? "Ativo" : "Inativo",
        especialidade: funcionarioParaEditar.especialidade || "",
        servicos_ids: funcionarioParaEditar.servicos_ids || [],
        senha: "", 
      });
      if (funcionarioParaEditar.servicos_ids) {
        setServicosSelecionados(funcionarioParaEditar.servicos_ids);
      }
    }
  }, [funcionarioParaEditar]);

  // --- VALIDAÇÕES ---
  const validarEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  
  const validarSenha = (senha: string) => 
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(senha);

  const toggleServico = (id: number) => {
    setServicosSelecionados(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const novosErros: { [key: string]: string } = {};

    if (formData.telefone && formData.telefone.length !== 7) {
      novosErros.telefone = "O telefone deve ter exatamente 7 dígitos.";
    }

    if (!validarEmail(formData.email)) {
      novosErros.email = "Insira um formato de email válido.";
    }

    if (!modoEdicao || formData.senha) {
      if (!validarSenha(formData.senha || "")) {
        novosErros.senha = "Senha fraca: use min. 8 caracteres, Maiúscula, Minúscula, Número e Símbolo.";
      }
    }

    if (servicosSelecionados.length === 0) {
      novosErros.servicos = "Selecione pelo menos um serviço para o profissional.";
    }

    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      return;
    }

    setErros({});
    try {
      if (onSalvar) {
        await onSalvar({ ...formData, servicos_ids: servicosSelecionados });
      }
    } catch (error) {
      alert("Erro ao guardar dados. Verifique email/telefone duplicados.");
    }
  };

  return (
    <div className="rounded-[2.5rem] max-w-5xl mx-auto overflow-hidden bg-white shadow-2xl border border-gray-100">
      {/* HEADER */}
      <div className="p-6 sm:p-8 flex items-center justify-between border-b bg-gray-50/50">
        <button onClick={onVoltar} className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white hover:shadow-sm transition text-[#b5820e] font-bold">
          <ChevronLeft size={20} /> Voltar
        </button>
        <h2 className="text-xl sm:text-2xl font-black text-black uppercase tracking-tighter">
          {modoEdicao ? "Editar Profissional" : "Novo Profissional"}
        </h2>
        <div className="w-10 h-10 rounded-full bg-[#b5820e]/10 flex items-center justify-center">
          <User className="text-[#b5820e]" size={20} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <Input label="Nome Próprio" icon={<User size={16} />} value={formData.nome} onChange={(v: string) => setFormData({ ...formData, nome: v })} required />
          <Input label="Apelido / Sobrenome" value={formData.apelido || ""} onChange={(v: string) => setFormData({ ...formData, apelido: v })} required />

          <div>
            <Input label="Email Profissional" icon={<Mail size={16} />} type="email" value={formData.email} onChange={(v: string) => setFormData({ ...formData, email: v.toLowerCase().trim() })} required />
            {erros.email && <ErrorMessage message={erros.email} />}
          </div>

          <div>
            <Input label="Telefone (7 dígitos)" icon={<Phone size={16} />} value={formData.telefone || ""} 
              onChange={(v: string) => {
                const apenasNumeros = v.replace(/\D/g, "").slice(0, 7);
                setFormData({ ...formData, telefone: apenasNumeros });
              }} required />
            {erros.telefone && <ErrorMessage message={erros.telefone} />}
          </div>

          <Input label="Data de Nascimento" icon={<Calendar size={16} />} type="date" value={formData.nascimento || ""} onChange={(v: string) => setFormData({ ...formData, nascimento: v })} />

          {/* ÁREA DE SELEÇÃO DE SERVIÇOS */}
          <div className="md:col-span-2">
            <Label>Serviços Habilitados (Associação ao Profissional)</Label>
            {erros.servicos && <ErrorMessage message={erros.servicos} />}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {listaServicosDB.map((servico) => (
                <button
                  key={servico.id}
                  type="button"
                  onClick={() => toggleServico(servico.id)}
                  className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                    servicosSelecionados.includes(servico.id)
                      ? "border-[#b5820e] bg-amber-50 shadow-sm"
                      : "border-gray-100 bg-gray-50 text-gray-400 opacity-70"
                  }`}
                >
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] font-black uppercase text-gray-900 leading-tight">
                      {servico.nome_servico || servico.nome}
                    </span>
                    <span className="text-[9px] font-bold text-[#b5820e] mt-1">
                       {servico.preco} CVE
                    </span>
                  </div>
                  {servicosSelecionados.includes(servico.id) ? (
                    <div className="w-6 h-6 bg-[#b5820e] rounded-full flex items-center justify-center animate-in zoom-in">
                      <Check size={14} className="text-white" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 border-2 border-gray-200 rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* SENHA FORTE */}
          <div className="md:col-span-2">
            <Label>{modoEdicao ? "Alterar Senha (opcional)" : "Definir Palavra-passe de Acesso"}</Label>
            <div className="relative">
              <Lock className="absolute left-4 top-4 text-gray-300" size={16} />
              <input
                type={mostrarSenha ? "text" : "password"}
                className={`w-full p-4 pl-12 pr-12 rounded-2xl bg-gray-50 focus:ring-2 focus:ring-[#b5820e] outline-none transition-all ${erros.senha ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                value={formData.senha}
                onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                required={!modoEdicao}
                placeholder="Mín. 8 chars, A-z, 0-9, @#$"
              />
              <button type="button" onClick={() => setMostrarSenha(!mostrarSenha)} className="absolute right-4 top-4 text-gray-400 hover:text-[#b5820e]">
                {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {erros.senha && <ErrorMessage message={erros.senha} />}
          </div>

          {/* STATUS */}
          <div className="md:col-span-2 flex items-center justify-between bg-gray-900 text-white p-6 rounded-[1.5rem] shadow-xl">
            <div>
              <p className="font-bold text-sm">Estado da Conta</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Bloqueia ou permite o login do profissional</p>
            </div>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, status: formData.status === "Ativo" ? "Inativo" : "Ativo" })}
              className={`flex items-center gap-3 px-5 py-2 rounded-xl font-black text-[10px] uppercase transition-all ${
                formData.status === "Ativo" ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
              }`}
            >
              {formData.status === "Ativo" ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
              {formData.status}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-black text-[#b5820e] py-6 rounded-[1.5rem] font-black uppercase tracking-[0.3em] flex justify-center items-center gap-4 hover:bg-gray-800 transition-all shadow-2xl active:scale-[0.98]"
        >
          <Save size={22} />
          {modoEdicao ? "Guardar Alterações" : "Finalizar Registo"}
        </button>
      </form>
    </div>
  );
}

// --- AUXILIARES TIPADOS ---
interface InputProps {
  label: string;
  icon?: React.ReactNode;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}

function Input({ label, icon, type = "text", value, onChange, required }: InputProps) {
  return (
    <div className="flex flex-col">
      <Label>{label}</Label>
      <div className="relative">
        {icon && <span className="absolute left-4 top-4 text-gray-300">{icon}</span>}
        <input
          type={type}
          value={value}
          required={required}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full p-4 rounded-2xl bg-gray-50 focus:ring-2 focus:ring-[#b5820e] outline-none transition-all ${icon ? "pl-12" : "pl-6"}`}
        />
      </div>
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-1.5 mt-2 ml-2 text-red-500 animate-pulse">
      <AlertCircle size={14} />
      <span className="text-[10px] font-black uppercase tracking-tight">{message}</span>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.15em] ml-2 mb-2 block">{children}</label>;
}