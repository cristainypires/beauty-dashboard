import api from "./api";

export const FuncionarioService = {
  // AGENDA E HISTÓRICO
  listarMinhaAgenda: async () => {
    // router.get("/listar-agendamentos", ...)
    const res = await api.get("/funcionario/listar-agendamentos");
    return res.data;
  },

  verMeuHistorico: async () => {
    // router.get("/historico", ...)
    const res = await api.get("/funcionario/historico");
    return res.data;
  },

  // AÇÕES NO AGENDAMENTO
  concluirServico: async (id: number) => {
    // router.patch("/agendamentos/:agendamento_id/concluir", ...)
    const res = await api.patch(`/funcionario/agendamentos/${id}/concluir`);
    return res.data;
  },

  cancelarAgendamento: async (id: number) => {
    // router.patch("/agendamentos/:id/cancelar", ...)
    const res = await api.patch(`/funcionario/agendamentos/${id}/cancelar`);
    return res.data;
  },

  reagendarAgendamento: async (id: number, dados: { data: string; hora: string }) => {
    // router.patch("/agendamentos/:id/reagendar", ...)
    const res = await api.patch(`/funcionario/agendamentos/${id}/reagendar`, dados);
    return res.data;
  },

  fazerNovoAgendamento: async (dados: any) => {
    // router.post("/agendamentos", ...)
    const res = await api.post("/funcionario/agendamentos", dados);
    return res.data;
  },

  // DISPONIBILIDADE
  marcarDisponibilidade: async (dados: any) => {
    const res = await api.post("/funcionario/disponibilidade", dados);
    return res.data;
  },

  marcarFerias: async (dados: { data_inicio: string; data_fim: string }) => {
    const res = await api.post("/funcionario/ferias", dados);
    return res.data;
  },

  bloquearHorario: async (dados: { data: string; hora: string; motivo?: string }) => {
    const res = await api.post("/funcionario/bloquear-horario", dados);
    return res.data;
  }
};