// src/components/Lista_Clientes.tsx
import React, { useState } from "react";
import {
  Search,
  UserX,
  UserCheck,
  Mail,
  Phone,
  Calendar,
  ChevronLeft,
} from "lucide-react";
import { Perfil_Cliente } from "./Perfil_Cliente";

export interface Cliente {
  id: number;
  nome: string;
  apelido: string;
  email: string;
  telefone: string; // Mude de 'numero_telefone' para 'telefone'
  ativo: boolean;
  desde: string; // Verifique no console se é 'criado_em' ou 'desde'
}

interface ListaClientesProps {
  clientes: Cliente[];
  onVoltar: () => void;
  onAtivar: (id: number) => void;
  onDesativar: (id: number) => void;
}

export function Lista_Clientes({
  clientes,
  onVoltar,
  onAtivar,
  onDesativar,
}: ListaClientesProps) {
  const [busca, setBusca] = useState("");
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(
    null,
  );
  console.log("Dados dos clientes:", clientes); // Adicione esta linha

  // Filtro local (apenas para a pesquisa visual)
  const clientesFiltrados = clientes.filter((c) => {
    const termo = busca.toLowerCase();
    return (
      c.nome.toLowerCase().includes(termo) ||
      c.apelido.toLowerCase().includes(termo) ||
      c.email.toLowerCase().includes(termo)
    );
  });

  if (clienteSelecionado) {
    return (
      <Perfil_Cliente
        cliente={clienteSelecionado}
        onVoltar={() => setClienteSelecionado(null)}
      />
    );
  }

  return (
    <div className="rounded-[2.5rem] overflow-hidden animate-in fade-in zoom-in duration-300">
      {/* HEADER */}
      <div className=" p-8 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={onVoltar}
            className="p-2 rounded-full text-[#b5820e] hover:bg-[#b5820e]  hover:text-black transition"
          >
            <ChevronLeft size={22} />
          </button>
          <div>
            <h2 className="text-2xl font-black text-black uppercase tracking-tight">
              Base de Clientes
            </h2>
            <p className="text-gray-500 text-[10px] mt-2 uppercase tracking-[0.3em]">
              Gestão de Utilizadores
            </p>
          </div>
        </div>

        <div className="relative hidden md:block">
          <Search className="absolute left-4 top-3 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Pesquisar cliente..."
            className="bg-gray-900 text-white rounded-xl py-3 pl-12 pr-4 border border-gray-800 focus:border-[#b5820e] outline-none text-sm w-64 transition"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
      </div>

      {/* LISTA */}
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clientesFiltrados.map((cliente) => (
            <div
              key={cliente.id}
              onClick={() => setClienteSelecionado(cliente)}
              className={`p-6 rounded-[2rem] border cursor-pointer transition-all ${
                cliente.ativo
                  ? "bg-gray-50 border-transparent hover:border-[#b5820e]"
                  : "bg-red-50/40 border-red-100 opacity-80"
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${
                    cliente.ativo
                      ? "bg-[#b5820e] text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {cliente.nome[0]}
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    cliente.ativo
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {cliente.ativo ? "Ativo" : "Desativado"}
                </span>
              </div>

              <h3 className="text-lg font-bold text-black">
                {cliente.nome} {cliente.apelido}
              </h3>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Mail size={14} />
                  {cliente.email}
                </div>
                {/* Telefone */}
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Phone size={14} />
                  {cliente.telefone}
                </div>

                {/* 3. No campo da Data, verifique se o nome está certo */}
                {/* Data */}
                <div className="flex items-center gap-2 text-[10px] text-gray-400 uppercase font-bold pt-2">
                  <Calendar size={12} />
                  {/* Verificação de segurança para a data */}
                  Desde{" "}
                  {cliente.desde
                    ? new Date(cliente.desde).toLocaleDateString("pt-PT")
                    : "Data indisponível"}
                </div>
              </div>

              {/* BOTÃO LIGADO AO BACK-END */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  cliente.ativo
                    ? onDesativar(cliente.id)
                    : onAtivar(cliente.id);
                }}
                className={`w-full mt-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 transition ${
                  cliente.ativo
                    ? "bg-white border border-red-100 text-red-500 hover:bg-red-50"
                    : "bg-[#b5820e] text-white hover:opacity-90"
                }`}
              >
                {cliente.ativo ? (
                  <>
                    <UserX size={14} /> Desativar Cliente
                  </>
                ) : (
                  <>
                    <UserCheck size={14} /> Reativar Cliente
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
