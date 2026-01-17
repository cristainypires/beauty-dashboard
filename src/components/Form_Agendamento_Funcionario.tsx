import React, { useState } from "react";
import {
  Save,
  User,
  Scissors,
  Phone,
  Calendar as CalendarIcon,
  Clock,
} from "lucide-react";

interface FormProps {
  onVoltar: () => void;
  onSubmit: (dados: any) => void; // Função que criamos no DashboardFuncionario
}

export function Form_Agendamento_Funcionario({
  onVoltar,
  onSubmit,
}: FormProps) {
  // 1. Estados para capturar o que o funcionário digita
  const [cliente, setCliente] = useState("");
  const [telefone, setTelefone] = useState("");
  const [servico, setServico] = useState("Drenagem Linfática");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");

  // 2. Função que agrupa os dados e envia para o Dashboard
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Impede a página de recarregar

    if (!cliente || !data || !hora) {
      alert("Por favor, preencha o nome, a data e a hora.");
      return;
    }

    const dadosAgendamento = {
      cliente,
      telefone,
      servico,
      data,
      hora,
      status: "confirmado", // Alinhado com status_agendamento.nome da BD
    };

    onSubmit(dadosAgendamento);
  };

  return (
    <div className="max-w-4xl w-full mx-auto bg-white rounded-[3rem] p-6 sm:p-10 border border-gray-400">
      <h2 className="text-2xl sm:text-3xl font-serif text-center font-black text-black mb-6 sm:mb-8">
        Nova Marcação
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6 text-left">
        {/* Nome da Cliente */}
        <div className="space-y-2">
          <label className="text-[10px] sm:text-[12px] font-black uppercase text-gray-400 tracking-widest ml-2">
            Nome da Cliente
          </label>
          <div className="relative">
            <User
              className="absolute left-3 sm:left-4 top-3 sm:top-4 text-gray-300"
              size={18}
            />
            <input
              type="text"
              required
              placeholder="Pesquisar ou digitar nome..."
              className="w-full p-3 sm:p-4 pl-10 sm:pl-12 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#b5820e] outline-none"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
            />
          </div>
        </div>

        {/* Telefone */}
        <div className="space-y-2">
          <label className="text-[10px] sm:text-[12px] font-black uppercase text-gray-400 tracking-widest ml-2">
            Telefone
          </label>
          <div className="relative">
            <Phone
              className="absolute left-3 sm:left-4 top-3 sm:top-4 text-gray-300"
              size={18}
            />
            <input
              type="text"
              placeholder="Digite o telefone..."
              className="w-full p-3 sm:p-4 pl-10 sm:pl-12 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#b5820e] outline-none"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />
          </div>
        </div>

        {/* Serviço */}
        <div className="space-y-2">
          <label className="text-[10px] sm:text-[12px] font-black uppercase text-gray-400 tracking-widest ml-2">
            Serviço Especializado
          </label>
          <div className="relative">
            <Scissors
              className="absolute left-3 sm:left-4 top-3 sm:top-4 text-[#b5820e]"
              size={18}
            />
            <select
              className="w-full p-3 sm:p-4 pl-10 sm:pl-12 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#b5820e] outline-none appearance-none"
              value={servico}
              onChange={(e) => setServico(e.target.value)}
            >
              <option value="Drenagem Linfática">Drenagem Linfática</option>
              <option value="Limpeza de Pele">Limpeza de Pele</option>
              <option value="Massagem Relaxante">Massagem Relaxante</option>
            </select>
          </div>
        </div>

        {/* Data e Horário */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] sm:text-[12px] font-black uppercase text-gray-400 tracking-widest ml-2">
              Data
            </label>
            <input
              type="date"
              required
              className="w-full p-3 sm:p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#b5820e] outline-none"
              value={data}
              onChange={(e) => setData(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] sm:text-[12px] font-black uppercase text-gray-400 tracking-widest ml-2">
              Horário
            </label>
            <input
              type="time"
              required
              className="w-full p-3 sm:p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#b5820e] outline-none"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
            />
          </div>
        </div>

        {/* Botões */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="button"
            onClick={onVoltar}
            className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-200 transition"
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="flex-[2] py-4 bg-black text-[#b5820e] rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl hover:opacity-90 transition flex items-center justify-center gap-3"
          >
            <Save size={20} /> Confirmar na Agenda
          </button>
        </div>
      </form>
    </div>
  );
}
