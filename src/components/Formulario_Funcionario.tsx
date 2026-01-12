import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  User,
  Mail,
  Phone,
  Lock,
  Briefcase,
  Calendar,
  Save,
  Eye,
  EyeOff,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

interface Funcionario {
  nome: string;
  apelido?: string;
  email: string;
  telefone?: string;
  nascimento?: string;
  especialidade: string;
  senha: string;
  status: "Ativo" | "Inativo";
}

interface Props {
  onVoltar: () => void;
  funcionarioParaEditar?: Funcionario;
}

export function Formulario_Funcionario({
  onVoltar,
  funcionarioParaEditar,
}: Props) {
  const modoEdicao = !!funcionarioParaEditar;

  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [formData, setFormData] = useState<Funcionario & { senha: string }>({
    nome: "",
    apelido: "",
    email: "",
    telefone: "",
    nascimento: "",
    especialidade: "",
    senha: "",
    status: "Ativo",
  });

  useEffect(() => {
    if (funcionarioParaEditar) {
      setFormData({
        ...funcionarioParaEditar,
        senha: "",
      });
    }
  }, [funcionarioParaEditar]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (modoEdicao) {
      alert(
        `Funcionário ${formData.nome} atualizado (${formData.status})`
      );
    } else {
      alert(`Novo funcionário ${formData.nome} criado com sucesso`);
    }

    onVoltar();
  };

  return (
    <div className=" rounded-[2.5rem]  max-w-5xl mx-auto overflow-hidden">
      {/* HEADER */}
      <div className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
  
  {/* ESQUERDA — BOTÃO VOLTAR */}
  <div className="flex items-center gap-4">
    <button
      onClick={onVoltar}
      className="p-2 rounded-full hover:bg-gray-100 transition text-[#b5820e]"
      aria-label="Voltar"
    >Voltar
      <ChevronLeft size={24} />
    </button>
    
  </div>

  {/* CENTRO — TÍTULO */}
  <div className="text-center sm:text-left flex-1">
    <h2 className="text-xl sm:text-2xl font-black text-black uppercase">
      {modoEdicao ? "Editar Profissional" : "Novo Profissional"}
    </h2>
    <p className="text-gray-400 text-[10px] sm:text-xs tracking-widest uppercase mt-1">
      Formulário para adicionar um novo profissional à Maddie Tavares Beauty Boutique
    </p>
  </div>

  {/* DIREITA — ÍCONE */}
  <div className="hidden sm:flex items-center justify-end">
    <div className="w-12 h-12 rounded-2xl border border-[#b5820e]/30 flex items-center justify-center">
      <User className="text-[#b5820e]" size={26} />
    </div>
  </div>

</div>


      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="p-6 sm:p-10 space-y-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* NOME */}
          <Input
            label="Nome"
            icon={<User size={16} />}
            value={formData.nome}
            onChange={(v) => setFormData({ ...formData, nome: v })}
            required
          />

          {/* APELIDO */}
          <Input
            label="Apelido"
            value={formData.apelido || ""}
            onChange={(v) =>
              setFormData({ ...formData, apelido: v })
            }
            required
          />

          {/* EMAIL */}
          <Input
            label="Email"
            icon={<Mail size={16} />}
            type="email"
            value={formData.email}
            onChange={(v) =>
              setFormData({ ...formData, email: v })
            }
            required
          />

          {/* TELEFONE */}
          <Input
            label="Telefone"
            icon={<Phone size={16} />}
            value={formData.telefone || ""}
            onChange={(v) =>
              setFormData({ ...formData, telefone: v })
            }
          />

          {/* ESPECIALIDADE */}
          <div>
            <Label>Especialidade</Label>
            <div className="relative">
              <Briefcase
                className="absolute left-4 top-4 text-[#b5820e]"
                size={16}
              />
              <select
                className="w-full p-4 pl-12 rounded-2xl bg-gray-50 focus:ring-2 focus:ring-[#b5820e]"
                value={formData.especialidade}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    especialidade: e.target.value,
                  })
                }
                required
              >
                <option value="">Selecionar...</option>
                <option>Estética Facial</option>
                <option>Massoterapia</option>
                <option>Manicure & Pedicure</option>
              </select>
            </div>
          </div>

          {/* NASCIMENTO */}
          <Input
            label="Nascimento"
            icon={<Calendar size={16} />}
            type="date"
            value={formData.nascimento || ""}
            onChange={(v) =>
              setFormData({ ...formData, nascimento: v })
            }
          />

          {/* SENHA */}
          <div className="md:col-span-2">
            <Label>
              {modoEdicao
                ? "Nova Palavra-passe (opcional)"
                : "Palavra-passe "}
            </Label>
            <div className="relative">
              <Lock
                className="absolute left-4 top-4 text-gray-300"
                size={16}
              />
              <input
                type={mostrarSenha ? "text" : "password"}
                className="w-full p-4 pl-12 pr-12 rounded-2xl bg-gray-50 focus:ring-2 focus:ring-[#b5820e]"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    senha: e.target.value,
                  })
                }
                required={!modoEdicao}
              />
              <button
                type="button"
                onClick={() =>
                  setMostrarSenha(!mostrarSenha)
                }
                className="absolute right-4 top-4 text-gray-400 hover:text-[#b5820e]"
              >
                {mostrarSenha ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* STATUS */}
          <div className="md:col-span-2 flex items-center justify-between bg-gray-50 p-5 rounded-2xl">
            <div>
              <p className="font-bold text-sm">
                Estado do Funcionário
              </p>
              <p className="text-xs text-gray-400">
                Pode ser alterado a qualquer momento
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setFormData({
                  ...formData,
                  status:
                    formData.status === "Ativo"
                      ? "Inativo"
                      : "Ativo",
                })
              }
              className="flex items-center gap-2 font-bold text-sm"
            >
              {formData.status === "Ativo" ? (
                <>
                  <ToggleRight className="text-green-600" />
                  Ativo
                </>
              ) : (
                <>
                  <ToggleLeft className="text-red-500" />
                  Inativo
                </>
              )}
            </button>
          </div>
        </div>

        {/* SUBMIT */}
        
      </form>
      <button
          type="submit"
          className="w-full bg-black text-[#b5820e] py-5 rounded-2xl font-black uppercase tracking-widest flex justify-center items-center gap-3 hover:opacity-90"
        >
          <Save size={20} />
          {modoEdicao ? "Guardar Alterações" : "Criar Funcionário"}
        </button>
    </div>
  );
}

/* COMPONENTES AUX */
function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">
      {children}
    </label>
  );
}

function Input({
  label,
  icon,
  type = "text",
  value,
  onChange,
  required,
}: {
  label: string;
  icon?: React.ReactNode;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="relative">
        {icon && (
          <span className="absolute left-4 top-4 text-gray-300">
            {icon}
          </span>
        )}
        <input
          type={type}
          value={value}
          required={required}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full p-4 rounded-2xl bg-gray-50 focus:ring-2 focus:ring-[#b5820e] ${
            icon ? "pl-12" : ""
          }`}
        />
      </div>
    </div>
  );
}
