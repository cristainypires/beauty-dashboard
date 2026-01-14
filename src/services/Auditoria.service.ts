import api from "./api";

export interface LogEntry {
  id: number;
  data: string;
  hora: string;
  ator: "ADMIN" | "SISTEMA" | "CLIENTE" | "FUNCIONÁRIO" |"Profissional";
  descricao: string;
  detalhes: string;
  data_hora: string;
  usuario_id: number | null;
  acao: string;
  usuario_nome: string | null;
}

export const AuditoriaService = {
  listar: async (): Promise<LogEntry[]> => {
    const res = await api.get("/admin/logs");
    return res.data;
  },
};
