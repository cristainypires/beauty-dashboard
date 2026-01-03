import React, { useState, useEffect } from "react";
import { ChevronLeft, User, Mail, Phone, Lock, Briefcase, Calendar, Save } from "lucide-react";

interface Props {
  onVoltar: () => void;
  funcionarioParaEditar?: any; // Recebe os dados se for para editar
}

export function Formulario_Funcionario({ onVoltar, funcionarioParaEditar }: Props) {
  // Verifica se estamos em modo de edição
  const modoEdicao = !!funcionarioParaEditar;

  // Estado inicial dinâmico
  const [formData, setFormData] = useState({
    nome: "",
    apelido: "",
    email: "",
    telefone: "",
    nascimento: "",
    senha: "",
    especialidade: ""
  });

  // Efeito para preencher o formulário quando clicamos em Editar
  useEffect(() => {
    if (funcionarioParaEditar) {
      setFormData({
        nome: funcionarioParaEditar.nome || "",
        apelido: funcionarioParaEditar.apelido || "",
        email: funcionarioParaEditar.email || "",
        telefone: funcionarioParaEditar.telefone || "",
        nascimento: funcionarioParaEditar.nascimento || "",
        senha: "", // Senha geralmente não se preenche por segurança
        especialidade: funcionarioParaEditar.especialidade || ""
      });
    }
  }, [funcionarioParaEditar]);

  const handleSimularSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (modoEdicao) {
      alert(`Sucesso: Os dados de ${formData.nome} foram atualizados!`);
    } else {
      alert(`Sucesso: Profissional ${formData.nome} registado no sistema Maddie!`);
    }
    
    onVoltar();
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-50 overflow-hidden max-w-4xl mx-auto animate-in fade-in zoom-in duration-300">
      
      {/* CABEÇALHO DINÂMICO */}
      <div className="bg-black p-8 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button 
            onClick={onVoltar}
            className="p-2 hover:bg-white/10 rounded-full transition text-[#b5820e]"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h2 className="text-2xl font-serif font-black text-white uppercase tracking-tighter">
              {modoEdicao ? "Atualizar Profissional" : "Contratar Novo Profissional"}
            </h2>
            <p className="text-gray-400 text-[10px] uppercase tracking-[0.3em]">
              {modoEdicao ? `A editar perfil de ${funcionarioParaEditar.nome}` : "Maddie Beauty Team Expansion"}
            </p>
          </div>
        </div>
        <div className="w-12 h-12 rounded-2xl border border-[#b5820e]/30 flex items-center justify-center">
             <User className="text-[#b5820e]" size={24} />
        </div>
      </div>

      <form onSubmit={handleSimularSubmit} className="p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* NOME */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">Primeiro Nome</label>
            <div className="relative">
              <User className="absolute left-4 top-4 text-gray-300" size={18} />
              <input 
                type="text" 
                value={formData.nome}
                placeholder="Ex: Ana"
                className="w-full p-4 pl-12 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#b5820e] outline-none transition"
                onChange={e => setFormData({...formData, nome: e.target.value})}
                required
              />
            </div>
          </div>

          {/* APELIDO */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">Apelido</label>
            <input 
              type="text" 
              value={formData.apelido}
              placeholder="Ex: Beatriz"
              className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#b5820e] outline-none transition"
              onChange={e => setFormData({...formData, apelido: e.target.value})}
              required
            />
          </div>

          {/* EMAIL */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">E-mail de Acesso</label>
            <div className="relative">
              <Mail className="absolute left-4 top-4 text-gray-300" size={18} />
              <input 
                type="email" 
                value={formData.email}
                placeholder="ana.beatriz@maddie.com"
                className="w-full p-4 pl-12 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#b5820e] outline-none transition"
                onChange={e => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
          </div>

          {/* TELEFONE */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">Telemóvel</label>
            <div className="relative">
              <Phone className="absolute left-4 top-4 text-gray-300" size={18} />
              <input 
                type="tel" 
                value={formData.telefone}
                placeholder="999 00 00"
                className="w-full p-4 pl-12 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#b5820e] outline-none transition"
                onChange={e => setFormData({...formData, telefone: e.target.value})}
              />
            </div>
          </div>

          {/* ESPECIALIDADE */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">Especialidade / Função</label>
            <div className="relative">
              <Briefcase className="absolute left-4 top-4 text-[#b5820e]" size={18} />
              <select 
                value={formData.especialidade}
                className="w-full p-4 pl-12 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#b5820e] outline-none transition appearance-none"
                onChange={e => setFormData({...formData, especialidade: e.target.value})}
                required
              >
                <option value="">Escolha a função...</option>
                <option value="Estética Facial">Estética Facial</option>
                <option value="Massoterapia">Massoterapia</option>
                <option value="Manicure & Pedicure">Manicure & Pedicure</option>
              </select>
            </div>
          </div>

          {/* DATA NASCIMENTO */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">Data de Nascimento</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-4 text-gray-300" size={18} />
              <input 
                type="date" 
                value={formData.nascimento}
                className="w-full p-4 pl-12 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#b5820e] outline-none transition"
                onChange={e => setFormData({...formData, nascimento: e.target.value})}
              />
            </div>
          </div>

          {/* SENHA (Obrigatória apenas no cadastro) */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">
                {modoEdicao ? "Nova Senha (deixe em branco para manter)" : "Palavra-passe Temporária"}
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-4 text-gray-300" size={18} />
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full p-4 pl-12 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#b5820e] outline-none transition"
                onChange={e => setFormData({...formData, senha: e.target.value})}
                required={!modoEdicao}
              />
            </div>
          </div>
        </div>

        {/* BOTÃO SUBMIT DINÂMICO */}
        <div className="mt-12">
          <button 
            type="submit"
            className="w-full bg-black text-[#b5820e] py-5 rounded-2xl font-black uppercase tracking-[0.4em] flex items-center justify-center gap-3 hover:bg-gray-900 transition-all shadow-xl active:scale-[0.98]"
          >
            {modoEdicao ? <><Save size={20} /> Guardar Alterações</> : <><Save size={20} /> Finalizar Contratação</>}
          </button>
        </div>
      </form>
    </div>
  );
}