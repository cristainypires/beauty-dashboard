import React, { useState, useEffect } from "react";
import {
  Plus,
  Percent,
  ChevronLeft,
  Trash2,
  Pencil,
  X,
  Calendar,
  Check,
  Tag,
} from "lucide-react";

// Importamos o serviço para fazer as chamadas
import { PromocaoService } from "../services/Admin.service";

interface PromocoesAdminProps {
  promocoes: any[];
  servicosReais: any[]; // 👈 Agora recebemos os serviços do banco
  onVoltar: () => void;
  onAtivar: (id: number) => void;
  onDesativar: (id: number) => void;
  onAtualizar: () => void; // 👈 Para recarregar a lista no Dashboard
}

export function Promocoes_Admin({ 
  promocoes, 
  servicosReais, 
  onVoltar, 
  onAtivar, 
  onDesativar, 
  onAtualizar 
}: PromocoesAdminProps) {
  
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState<any | null>(null);

  // Estados do formulário
  const [formTitulo, setFormTitulo] = useState("");
  const [formValidade, setFormValidade] = useState("");
  const [selectedServicos, setSelectedServicos] = useState<number[]>([]);

  function abrirModal(promo?: any) {
    if (promo) {
      setEditando(promo);
      setFormTitulo(promo.titulo);
      setFormValidade(promo.validade);
      setSelectedServicos(promo.servicos_ids || []);
    } else {
      setEditando(null);
      setFormTitulo("");
      setFormValidade("");
      setSelectedServicos([]);
    }
    setShowModal(true);
  }

  function toggleServico(id: number) {
    if (selectedServicos.includes(id)) {
      setSelectedServicos(selectedServicos.filter(sid => sid !== id));
    } else {
      setSelectedServicos([...selectedServicos, id]);
    }
  }

  // --- LIGAÇÃO COM BACK-END: SALVAR ---
  async function salvarPromocao() {
    if (!formTitulo || !formValidade || selectedServicos.length === 0) {
      alert("Preencha todos os campos e escolha pelo menos um serviço.");
      return;
    }

    try {
      const dados = {
        titulo: formTitulo,
        validade: formValidade,
        servicos_ids: selectedServicos,
        ativo: true
      };

      if (editando) {
        await PromocaoService.atualizar(editando.id, dados);
        alert("Promoção atualizada!");
      } else {
        await PromocaoService.criar(dados);
        alert("Promoção criada com sucesso!");
      }

      setShowModal(false);
      onAtualizar(); // 🔄 Avisa o DashboardAdmin para recarregar a lista
    } catch (err) {
      alert("Erro ao salvar promoção.");
    }
  }

  // --- LIGAÇÃO COM BACK-END: REMOVER ---
  async function removerPromocao(id: number) {
    if (!window.confirm("Eliminar esta campanha permanentemente?")) return;
    try {
      await PromocaoService.remover(id);
      onAtualizar(); // 🔄 Recarrega a lista
    } catch (err) {
      alert("Erro ao remover promoção.");
    }
  }

  return (
    <div className="rounded-[2.5rem] overflow-hidden animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="p-6 sm:p-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full sm:w-auto">
          <button onClick={onVoltar} className="p-3 bg-white/10 rounded-full text-[#b5820e] hover:bg-[#b5820e] hover:text-black transition-all">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-black uppercase tracking-tighter">Ofertas de Luxo</h2>
            <p className="text-gray-400 text-[10px] uppercase tracking-[0.3em] mt-1">Campanhas Ativas no Sistema</p>
          </div>
        </div>

        <button onClick={() => abrirModal()} className="bg-[#b5820e] text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-2">
          <Plus size={18} /> Lançar Campanha
        </button>
      </div>

      {/* LISTA DE PROMOÇÕES DINÂMICA */}
      <div className="p-6 sm:p-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {promocoes.map((promo) => (
            <div key={promo.id} className="group rounded-[2.5rem] p-8 border border-transparent hover:border-[#b5820e] bg-white transition-all shadow-md flex flex-col justify-between">
              <div className="flex justify-between mb-6">
                <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center text-[#b5820e] shadow-lg">
                  <Percent size={20} />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => abrirModal(promo)} className="p-2 bg-gray-50 rounded-lg text-blue-600 hover:bg-blue-600 hover:text-white transition"><Pencil size={14} /></button>
                  <button onClick={() => removerPromocao(promo.id)} className="p-2 bg-gray-50 rounded-lg text-red-600 hover:bg-red-600 hover:text-white transition"><Trash2 size={14} /></button>
                </div>
              </div>

              <h3 className="text-xl font-bold text-black mb-4">{promo.titulo}</h3>

              {/* SERVIÇOS DA PROMOÇÃO (Buscando nomes reais do banco) */}
              <div className="flex flex-wrap gap-2 mb-6">
                {promo.servicos_ids?.map((sid: number) => {
                  const s = servicosReais.find((srv) => srv.id === sid);
                  return (
                    <span key={sid} className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1">
                      <Tag size={10} className="text-[#b5820e]" /> {s?.nome || "Serviço Removido"}
                    </span>
                  );
                })}
              </div>

              <div className="flex items-center gap-2 text-gray-400 text-[10px]">
                <Calendar size={14} className="text-[#b5820e]" />
                <span className="font-black uppercase tracking-widest">Até {new Date(promo.validade).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL DE EDIÇÃO / CRIAÇÃO */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-[3rem] w-full max-w-xl shadow-2xl overflow-hidden border border-gray-100 animate-in zoom-in duration-300">
            <div className="bg-black p-8 flex justify-between items-center">
              <h3 className="text-2xl font-serif font-black text-white uppercase">Detalhes da Campanha</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white"><X size={24} /></button>
            </div>

            <div className="p-10 space-y-6 text-left">
              <div>
                <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-3">Nome da Promoção</label>
                <input
                  className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-[#b5820e] outline-none transition"
                  value={formTitulo}
                  onChange={(e) => setFormTitulo(e.target.value)}
                  placeholder="Ex: Especial de Primavera"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-3">Serviços Abrangidos (Escolha da Lista Real)</label>
                <div className="grid grid-cols-2 gap-3 max-h-44 overflow-y-auto p-1">
                  {servicosReais.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => toggleServico(s.id)}
                      className={`flex items-center justify-between p-3 rounded-xl text-sm font-bold transition-all ${
                        selectedServicos.includes(s.id) ? "bg-black text-[#b5820e]" : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                      }`}
                    >
                      {s.nome}
                      {selectedServicos.includes(s.id) && <Check size={14} />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-3">Data de Expiração</label>
                <input
                  type="date"
                  className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-[#b5820e] outline-none transition"
                  value={formValidade}
                  onChange={(e) => setFormValidade(e.target.value)}
                />
              </div>

              <button onClick={salvarPromocao} className="w-full py-5 bg-black text-[#b5820e] rounded-2xl font-black uppercase text-sm tracking-[0.3em] hover:opacity-90 transition-all">
                {editando ? "Atualizar Campanha" : "Confirmar Campanha"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}