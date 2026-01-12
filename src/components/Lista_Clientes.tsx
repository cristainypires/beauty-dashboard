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

interface Cliente {
  id: number;
  nome: string;
  apelido: string;
  email: string;
  telefone: string;
  ativo: boolean;
  desde: string;
}

export function Lista_Clientes({ onVoltar }: { onVoltar: () => void }) {
  const [clientes, setClientes] = useState<Cliente[]>([
    {
      id: 1,
      nome: "Marta",
      apelido: "Tavares",
      email: "marta@email.com",
      telefone: "9912345",
      ativo: true,
      desde: "2023-01-15",
    },
    {
      id: 2,
      nome: "Carla",
      apelido: "Antunes",
      email: "carla@email.com",
      telefone: "9876543",
      ativo: true,
      desde: "2023-03-10",
    },
    {
      id: 3,
      nome: "João",
      apelido: "Pedro",
      email: "jp@email.com",
      telefone: "9955443",
      ativo: false,
      desde: "2023-05-20",
    },
  ]);

  const [busca, setBusca] = useState("");
  const [clienteSelecionado, setClienteSelecionado] =
    useState<Cliente | null>(null);

  const toggleCliente = (id: number) => {
    setClientes((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ativo: !c.ativo } : c))
    );
  };

  const clientesFiltrados = clientes.filter((c) => {
    const termo = busca.toLowerCase();
    return (
      c.nome.toLowerCase().includes(termo) ||
      c.apelido.toLowerCase().includes(termo) ||
      c.email.toLowerCase().includes(termo)
    );
  });

  /* PERFIL */
  if (clienteSelecionado) {
    return (
      <Perfil_Cliente
        cliente={clienteSelecionado}
        onVoltar={() => setClienteSelecionado(null)}
      />
    );
  }

  /* LISTA */
  return (
    <div className=" rounded-[2.5rem]  overflow-hidden animate-in fade-in zoom-in duration-300">
      {/* HEADER */}
      <div className="bg-black p-8 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={onVoltar}
            className="p-2 rounded-full text-[#b5820e] hover:bg-gray-300 transition"
          >
            <ChevronLeft size={22} />
          </button>

          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">
              Base de Clientes
            </h2>
            <p className="text-gray-400 text-[10px] uppercase tracking-[0.3em]">
              Gestão de Utilizadores
            </p>
          </div>
        </div>

        <div className="relative hidden md:block">
          <Search className="absolute left-4 top-3 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Pesquisar cliente..."
            className="
              bg-gray-900
              text-white
              rounded-xl
              py-3
              pl-12
              pr-4
              border border-gray-800
              focus:border-[#b5820e]
              outline-none
              text-sm
              w-64
              transition
            "
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
              className={`
                p-6
                rounded-[2rem]
                border
                cursor-pointer
                transition-all
                ${
                  cliente.ativo
                    ? "bg-gray-50 border-transparent hover:border-[#b5820e]"
                    : "bg-red-50/40 border-red-100 opacity-80"
                }
              `}
            >
              <div className="flex justify-between items-start mb-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${
                    cliente.ativo
                      ? "bg-black text-[#b5820e]"
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
                  <Mail size={14} className="text-gray-300" />
                  {cliente.email}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Phone size={14} className="text-gray-300" />
                  {cliente.telefone}
                </div>
                <div className="flex items-center gap-2 text-[10px] text-gray-400 uppercase font-bold pt-2">
                  <Calendar size={12} />
                  Desde{" "}
                  {new Date(cliente.desde).toLocaleDateString("pt-PT")}
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCliente(cliente.id);
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

        {clientesFiltrados.length === 0 && (
          <div className="py-20 text-center text-gray-400 italic">
            Nenhum cliente encontrado.
          </div>
        )}
      </div>
    </div>
  );
}
