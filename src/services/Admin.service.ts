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
// Localização: src/services/Admin.service.ts

// 1. Corrigir a função de Criar
export const criarServico = async (data: { nome: string; preco: number; duracao: number }) => {
  // MAPEAMENTO: Transformamos os nomes do front para os nomes que o backend espera
  const payload = {
    nome_servico: data.nome,
    duracao_minutos: data.duracao,
    preco: data.preco
  };

  const res = await api.post("/admin/servicos", payload);
  return res.data;
};

// 2. Corrigir a função de Atualizar
export const atualizarServico = async (id: number, data: any) => {
  // Também precisamos mapear aqui para garantir que a edição funcione
  const payload = {
    nome_servico: data.nome,
    duracao_minutos: data.duracao,
    preco: data.preco,
    ativo: data.ativo
  };

  const res = await api.put(`/admin/servicos/${id}`, payload);
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
  // Mapeamos os campos do formulário para o que o backend espera
  const payload = {
    nome: data.nome,
    apelido: data.apelido,
    email: data.email,
    numero_telefone: data.telefone, // De telefone para numero_telefone
    data_nascimento: data.nascimento,
    palavra_passe: data.senha,      // De senha para palavra_passe
    funcao_especialidade: data.especialidade
  };
  const res = await api.post("/admin/funcionarios", payload);
  return res.data;
};

// src/services/Admin.service.ts

export const atualizarFuncionario = async (id: number, data: any) => {
  const payload = {
    nome: data.nome,
    apelido: data.apelido,
    email: data.email,
    numero_telefone: data.telefone,    // Mapeando para o nome do banco
    data_nascimento: data.nascimento,
    funcao_especialidade: data.especialidade,
    ativo: data.status === "Ativo",    // Converte para boolean
    servicos_ids: data.servicos_ids    // O array de IDs [1, 5, 8]
  };

  // Se o usuário digitou uma nova senha, adiciona ao envio
  if (data.senha && data.senha.length >= 8) {
    (payload as any).palavra_passe = data.senha;
  }

  const res = await api.put(`/admin/funcionarios/${id}`, payload);
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




