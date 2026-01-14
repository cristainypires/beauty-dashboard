// src/components/Auditoria_Logs.tsx
import { useMemo, useState } from "react";
import {
  ShieldCheck,
  Search,
  Filter,
  Calendar,
  ChevronLeft,
  Download,
} from "lucide-react";
import { LogEntry } from "../services/Auditoria.service";

interface AuditoriaLogsProps {
  logs: LogEntry[];
  onVoltar: () => void;
}
const LOGS_POR_PAGINA = 5;
export function Auditoria_Logs({ logs, onVoltar }: AuditoriaLogsProps) {
  /* ====== FILTROS ====== */
  const [pesquisa, setPesquisa] = useState("");
  const [ator, setAtor] = useState("TODOS");
  const [data, setData] = useState("");
  const [pagina, setPagina] = useState(1);

  const logsFiltrados = useMemo(() => {
    return logs.filter((log) => {
      const textoMatch =
        log.descricao.toLowerCase().includes(pesquisa.toLowerCase()) ||
        log.detalhes.toLowerCase().includes(pesquisa.toLowerCase());

      const atorMatch = ator === "TODOS" || log.ator === ator;
      const dataMatch = !data || log.data === data;

      return textoMatch && atorMatch && dataMatch;
    });
  }, [logs, pesquisa, ator, data]);

  const totalPaginas = Math.ceil(logsFiltrados.length / LOGS_POR_PAGINA);

  const logsPaginados = logsFiltrados.slice(
    (pagina - 1) * LOGS_POR_PAGINA,
    pagina * LOGS_POR_PAGINA
  );

  return (
    <div className=" rounded-[2.5rem] overflow-hidden">
      {/* HEADER */}
      <div className=" p-6 sm:p-8 flex flex-col sm:flex-row justify-between gap-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onVoltar}
            className="p-2 hover:bg-white/10 rounded-full text-[#b5820e]"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-black text-black uppercase">
              Auditoria & Logs
            </h2>
            <p className="text-gray-400 text-[9px]  tracking-[0.3em]">
              Rastreabilidade total do sistema
            </p>
          </div>
        </div>
      </div>

      {/* FILTROS */}
      <div className="p-4 sm:p-6  flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-4 top-3 text-gray-400" size={18} />
          <input
            value={pesquisa}
            onChange={(e) => {
              setPagina(1);
              setPesquisa(e.target.value);
            }}
            placeholder="Pesquisar logs..."
            className="w-full pl-12 p-3 rounded-xl border border-gray-200 text-sm"
          />
        </div>

        <select
          value={ator}
          onChange={(e) => {
            setPagina(1);
            setAtor(e.target.value);
          }}
          className="p-3 rounded-xl border border-gray-200 text-sm"
        >
          <option value="TODOS">Todos os Atores</option>
          <option value="ADMIN">Admin</option>
          <option value="SISTEMA">Sistema</option>
          <option value="CLIENTE">Cliente</option>
          <option value="FUNCIONÁRIO">Funcionário</option>
        </select>

        <div className="relative">
          <Calendar className="absolute left-3 top-3 text-gray-400" size={16} />
          <input
            type="date"
            value={data}
            onChange={(e) => {
              setPagina(1);
              setData(e.target.value);
            }}
            className="pl-10 p-3 rounded-xl border border-gray-200 text-sm"
          />
        </div>
      </div>

      {/* LOGS */}
      <div className="p-4 sm:p-8 space-y-4">
        {logsPaginados.map((log) => (
          <div
            key={log.id}
            className="p-4 rounded-2xl border border-gray-100 hover:shadow-md  transition flex flex-col sm:flex-row gap-4"
          >
            <div className="min-w-[80px] text-center sm:text-left">
              <p className="text-[10px] text-gray-400">{log.data}</p>
              <p className="text-sm font-mono font-bold text-[#b5820e]">
                {log.hora}
              </p>
            </div>

            <div className="flex-1">
              <span
                className={`text-[9px] px-2 py-1 rounded font-black uppercase ${
                  log.ator === "ADMIN"
                    ? "bg-black text-[#b5820e]"
                    : log.ator === "SISTEMA"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {log.ator}
              </span>
              <p className="font-bold text-sm mt-1">{log.descricao}</p>
              <p className="text-xs text-gray-500 font-mono">{log.detalhes}</p>
            </div>
          </div>
        ))}

        {logsPaginados.length === 0 && (
          <p className="text-center text-sm text-gray-400 mt-10">
            Nenhum log encontrado.
          </p>
        )}
      </div>

      {/* PAGINAÇÃO */}
      {totalPaginas > 1 && (
        <div className="p-6 flex justify-center gap-2">
          {Array.from({ length: totalPaginas }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPagina(i + 1)}
              className={`w-9 h-9 rounded-lg font-bold text-sm ${
                pagina === i + 1
                  ? "bg-[#b5820e] text-black"
                  : "border border-gray-200 text-gray-400 hover:border-[#b5820e]"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
