// src/services/Profissional.service.ts
import api from "./api";

export const ProfissionalService = {
  // Agenda de hoje e futura
  listarMinhaAgenda: async () => {
    try {
      const res = await api.get("/funcionario/listar-agendamentos");
      return res.data;
    } catch (error: any) {
      console.error("ProfissionalService.listarMinhaAgenda erro:", error?.response?.data || error.message || error);
      throw error;
    }
  },

  // Histórico (passados)
  verHistorico: async () => {
    const res = await api.get("/funcionario/historico");
    return res.data;
  },

  // Todos os agendamentos do sistema (sem exceção)
  
  // Concluir agendamento
  concluirServico: async (id: number) => {
    const res = await api.patch(`/funcionario/agendamentos/${id}/concluir`);
    return res.data;
  },

  // Dados do Perfil (Avaliação e Serviço Associado)
  obterPerfil: async () => {
    // Caso não tenha esta rota ainda, retornamos um mock que você pode ajustar
    try {
      const res = await api.get("/funcionario/perfil");
      return res.data;
    } catch {
      return {
        nome: localStorage.getItem("usuario_nome") || "Profissional",
        servico_associado: "Estética Avançada",
        avaliacao: 4.9
      };
    }
  }
};