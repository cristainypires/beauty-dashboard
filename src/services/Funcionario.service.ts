import api from "./api";

export const FuncionarioService = {
  // --- AGENDA E HISTÓRICO ---
  listarMinhaAgenda: async (data?: string) => {
    const res = await api.get("/funcionario/listar-agendamentos", {
      params: data ? { data } : {}
    });
    return res.data;
  },

  verMeuHistorico: async () => {
    const res = await api.get("/funcionario/historico");
    return res.data;
  },

  // --- AÇÕES NO AGENDAMENTO ---
  concluirServico: async (id: number) => {
    const res = await api.patch(`/funcionario/agendamentos/${id}/concluir`);
    return res.data;
  },

  cancelarAgendamento: async (id: number) => {
    const res = await api.patch(`/funcionario/agendamentos/${id}/cancelar`);
    return res.data;
  },

  reagendarAgendamento: async (id: number, dados: { nova_data_hora: string }) => {
    const res = await api.patch(`/funcionario/agendamentos/${id}/reagendar`, dados);
    return res.data;
  },



  // --- DISPONIBILIDADE ---
   // Busca a disponibilidade de OUTRO funcionário (ID passado no param)
  obterDisponibilidade: async (funcionarioId: string) => {
    const res = await api.get(`/funcionario/adm/disponibilidade/${funcionarioId}`);
    return res.data;
  },

  obterPanoramaCompleto: async (id: string) => {
    const res = await api.get(`/funcionario/panorama/${id}`);
    return res.data;
  },

  // Salva a disponibilidade de OUTRO funcionário (ID enviado no body)
  marcarDisponibilidade: async (dados: { funcionario_id: string, semana: any[] }) => {
    const res = await api.post("/funcionario/adm/disponibilidade", dados);
    return res.data;
  },
    marcarFerias: async (dados: { data_inicio: string; data_fim: string; funcionario_id: string }) => {
    // Agora aceita funcionario_id para quando o ADM for marcar
    const res = await api.post("/funcionario/ferias", dados);
    return res.data;
  },

  bloquearHorario: async (dados: { data: string; hora: string; motivo?: string; funcionario_id: string }) => {
  const res = await api.post("/funcionario/bloquear-horario", dados); // Esta URL está correta
    return res.data;
  },


  // No seu Funcionario.service.ts, certifique-se de que o nome é este:

  listarServicos: async () => {
    const res = await api.get("/funcionario/servicos");
    return res.data;
  },

  listarProfissionais: async () => {
    const res = await api.get("/funcionario/profissionais");
    return res.data;
  },

  listarClientes: async () => {
    const res = await api.get("/funcionario/clientes");
    return res.data;
  },

  // AJUSTE O NOME AQUI:
  fazerNovoAgendamento: async (dados: any) => {
    const res = await api.post("/funcionario/agendamentos", dados);
    return res.data;
  },



};