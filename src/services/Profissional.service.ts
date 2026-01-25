import api from "./api";

export const ProfissionalService = {
  listarMinhaAgenda: async (data?: string) => {
    try {
      // ✅ CORREÇÃO: Não force a data de hoje se 'data' vier vazio
      const res = await api.get(`/funcionario/listar-agendamentos`, {
        params: data ? { data } : {} // Só envia o parâmetro se ele existir
      });
      return res.data;
    } catch (error: any) {
      console.error("Erro ao listar agenda:", error);
      throw error;
    }
  },

  verHistorico: async () => {
    try {
      const res = await api.get("/funcionario/historico");
      return res.data;
    } catch (error) {
      console.error("Erro ao ver histórico:", error);
      throw error;
    }
  },

  obterPerfil: async () => {
  try {
    const res = await api.get("/funcionario/perfil-resumo"); 
    return res.data;
  } catch {
    return {
      nome: localStorage.getItem("usuario_nome") || "Profissional",
      servico_associado: localStorage.getItem("usuario_servico") || "Serviço",
      avaliacao: 4.9,
      estatisticas: { total_agendamentos: 0 },
    };
  }
},




  obterMinhaDisponibilidade: async () => {
    const res = await api.get("/funcionario/minha-disponibilidade");
    return res.data;
  },
};