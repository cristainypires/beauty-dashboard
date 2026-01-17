// utilitários para tratamento seguro de dados e datas
export function safeArray<T = any>(input: any): T[] {
  if (Array.isArray(input)) return input as T[];
  if (input && Array.isArray(input.data)) return input.data as T[];
  return [];
}

export function safeString(input: any, fallback = ""): string {
  if (input === null || input === undefined) return fallback;
  return String(input);
}

export function parseDateSafe(input: any): Date | null {
  if (input === null || input === undefined) return null;

  try {
    // Se for apenas YYYY-MM-DD, adicionar hora para evitar timezone ambíguo
    if (typeof input === "string" && /^\d{4}-\d{2}-\d{2}$/.test(input)) {
      input = input + "T00:00:00";
    }

    const d = new Date(input);
    if (isNaN(d.getTime())) return null;
    return d;
  } catch (e) {
    return null;
  }
}

export function toDateParts(d: Date | null) {
  if (!d) return { date: null as string | null, time: null as string | null };
  const iso = d.toISOString();
  return { date: iso.split("T")[0], time: iso.split("T")[1].slice(0, 5) };
}

export function ensureAgendaItem(item: any) {
  // Normalização avançada para evitar [object Object] e nulos
  // Cliente
  let nome_cliente = "Sem nome";
  let telefone_cliente = "";
  if (item?.cliente) {
    if (typeof item.cliente === "object") {
      nome_cliente = item.cliente.nome || item.cliente.usuario?.nome || nome_cliente;
      telefone_cliente = item.cliente.telefone || item.cliente.usuario?.numero_telefone || telefone_cliente;
    } else {
      nome_cliente = safeString(item.cliente, nome_cliente);
    }
  } else if (item?.usuario) {
    nome_cliente = item.usuario.nome || nome_cliente;
    telefone_cliente = item.usuario.numero_telefone || telefone_cliente;
  } else if (item?.cliente_nome) {
    nome_cliente = safeString(item.cliente_nome, nome_cliente);
  }

  // Serviço
  let nome_servico = "";
  if (item?.servico) {
    if (typeof item.servico === "object") {
      nome_servico = item.servico.nome || nome_servico;
    } else {
      nome_servico = safeString(item.servico, nome_servico);
    }
  } else if (item?.nome_servico) {
    nome_servico = safeString(item.nome_servico, nome_servico);
  } else if (item?.nome) {
    nome_servico = safeString(item.nome, nome_servico);
  }

  // Profissional
  let nome_profissional = "";
  if (item?.profissional) {
    if (typeof item.profissional === "object") {
      nome_profissional = item.profissional.nome || nome_profissional;
    } else {
      nome_profissional = safeString(item.profissional, nome_profissional);
    }
  } else if (item?.funcionario_nome) {
    nome_profissional = safeString(item.funcionario_nome, nome_profissional);
  } else if (item?.profissional_nome) {
    nome_profissional = safeString(item.profissional_nome, nome_profissional);
  }

  // Telefone (prioridade: cliente, depois outros)
  let telefone = telefone_cliente;
  if (!telefone) {
    telefone = safeString(item?.cliente_telefone || item?.numero_telefone || item?.usuario?.numero_telefone, "");
  }

  // Status
  let status = safeString(item?.status || item?.status_agendamento || "pendente");
  if (typeof status === "object" && status !== null) {
    const statusObj = status as Record<string, any>;
    status = statusObj.nome || JSON.stringify(statusObj);
  }
  status = status.toLowerCase();

  // Data/hora
  const inicio = parseDateSafe(item?.data_hora_inicio || item?.data || item?.inicio);
  const partes = toDateParts(inicio);

  // Observação
  const obs = item?.obs || "";

  return {
    id: item?.id,
    // Prioriza campos do backend se existirem
    cliente: item?.nome_cliente || nome_cliente,
    telefone: item?.telefone_cliente || telefone,
    servico: item?.nome_servico || nome_servico,
    profissional: nome_profissional,
    status,
    data: partes.date || "",
    hora: partes.time || "",
    nome_cliente: item?.nome_cliente || nome_cliente,
    telefone_cliente: item?.telefone_cliente || telefone_cliente,
    obs,
    raw: item,
  };
}
