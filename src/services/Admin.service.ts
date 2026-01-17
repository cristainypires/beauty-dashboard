import api from "./api";


type PromocaoPayload = {
  titulo: string;
  validade: string;
  servicos_ids: number[];
  ativo?: boolean;
};


// =====================
// SERVIÇOS
// =====================
// Listar todos os serviços
export const listarServicos = async () => {
  try {
    const res = await api.get("/admin/servicos");
    return res.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      console.warn("[FALLBACK] Rota /admin/servicos não encontrada. Retornando dados vazios.");
      return [];
    }
    throw error;
  }
};

// Criar novo serviço
export const criarServico = async (data: { nome: string; preco: number; duracao: number }) => {
  const res = await api.post("/admin/servicos", data);
  return res.data;
};

// Atualizar serviço existente
export const atualizarServico = async (id: number, data: any) => {
  const res = await api.put(`/admin/servicos/${id}`, data);
  return res.data;
};

// Remover serviço
export const removerServico = async (id: number) => {
  const res = await api.delete(`/admin/servicos/${id}`);
  return res.data;
};


// =====================
// FUNCIONÁRIOS
// =====================
export const listarFuncionarios = async () => {
  try {
    const res = await api.get("/admin/funcionarios");
    return res.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      console.warn("[FALLBACK] Rota /admin/funcionarios não encontrada. Retornando dados vazios.");
      return [];
    }
    throw error;
  }
};

export const criarFuncionario = async (data: any) => {
  const res = await api.post("/admin/funcionarios", data);
  return res.data;
};

export const atualizarFuncionario = async (
  id: number,
  data: any
) => {
  const res = await api.put(`/admin/funcionarios/${id}`, data);
  return res.data;
};

export const removerFuncionario = async (id: number) => {
  const res = await api.delete(`/admin/funcionarios/${id}`);
  return res.data;
};

// =====================
// CLIENTES
// =====================
export const listarClientes = async () => {
  try {
    const res = await api.get("/admin/clientes");
    return res.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      console.warn("[FALLBACK] Rota /admin/clientes não encontrada. Retornando dados vazios.");
      return [];
    }
    throw error;
  }
};

export const desativarCliente = async (id: number) => {
  const res = await api.post(`/admin/clientes/${id}/desativar`);
  return res.data;
};

export const ativarCliente = async (id: number) => {
  const res = await api.post(`/admin/clientes/${id}/ativar`);
  return res.data;
};

// =====================
// AGENDAMENTOS
// =====================

// No seu Admin.service.ts - use sempre o 'api' que criamos
export const listarAgendamentos = async () => {
  try {
    const res = await api.get("/admin/agendamentos");
    return res.data;
  } catch (error: any) {
    // Fallback para dados mock se a rota não existir
    if (error.response?.status === 404) {
      console.warn("[FALLBACK] Rota /admin/agendamentos não encontrada. Retornando dados mock.");
      return [];
    }
    throw error;
  }
};

export const cancelarAgendamento = async (id: number) => {
  const res = await api.patch(`/admin/agendamentos/${id}/cancelar`);
  return res.data;
};

export const reagendarAgendamento = async (id: number, dataHora: { data: string; hora: string }) => {
  const res = await api.patch(`/admin/agendamentos/${id}/reagendar`, dataHora);
  return res.data;
};


//////////////////////////7
//Promoções
export const PromocaoService = {
  listar: async () => {
    const res = await api.get("/admin/promocoes");
    return res.data;
  },

  criar: async (promo: PromocaoPayload) => {
    const res = await api.post("/admin/promocoes", promo);
    return res.data;
  },

  atualizar: async (id: number, promo: Partial<PromocaoPayload>) => {
    const res = await api.put(`/admin/promocoes/${id}`, promo);
    return res.data;
  },

  remover: async (id: number) => {
    const res = await api.delete(`/admin/promocoes/${id}`);
    return res.data;
  },
};




