import React, { useState } from "react";
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
  Zap,
} from "lucide-react";

// Importamos o serviço para fazer as chamadas ao backend
import { PromocaoService } from "../services/Admin.service";

interface PromocoesAdminProps {
  promocoes: any[];
  servicosReais: any[];
  onVoltar: () => void;
  onAtivar: (id: number) => void;
  onDesativar: (id: number) => void;
  onAtualizar: () => void;
}

export function Promocoes_Admin({
  promocoes,
  servicosReais,
  onVoltar,
  onAtualizar,
}: PromocoesAdminProps) {
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState<any | null>(null);

  // Estados do formulário
  const [formTitulo, setFormTitulo] = useState("");
  const [formValidade, setFormValidade] = useState("");
  const [formValor, setFormValor] = useState<number>(10);
  const [selectedServicos, setSelectedServicos] = useState<number[]>([]);

  // Abre o modal para criar ou editar
  function abrirModal(promo?: any) {
    if (promo) {
      setEditando(promo);
      setFormTitulo(promo.titulo || promo.nome || "");
      setFormValor(promo.valor || 10);
      
      // Tenta pegar a data de validade de vários campos possíveis
      const dataBruta = promo.validade || promo.data_fim || "";
      const dataFormatada = dataBruta ? dataBruta.split("T")[0] : "";
      setFormValidade(dataFormatada);

      // Tenta pegar os IDs dos serviços de vários campos possíveis
      const ids = promo.servicos_ids || promo.servico_ids || promo.servicos || [];
      setSelectedServicos(Array.isArray(ids) ? ids : []);
    } else {
      setEditando(null);
      setFormTitulo("");
      setFormValidade("");
      setFormValor(10);
      setSelectedServicos([]);
    }
    setShowModal(true);
  }

  // Selecionar/Deslecionar serviço
  function toggleServico(id: number) {
    if (selectedServicos.includes(id)) {
      setSelectedServicos(selectedServicos.filter((sid) => sid !== id));
    } else {
      setSelectedServicos([...selectedServicos, id]);
    }
  }

  // --- SALVAR NO BACKEND ---
  async function salvarPromocao() {
    if (!formTitulo || !formValidade || selectedServicos.length === 0) {
      alert("Por favor, preencha o título, validade e escolha pelo menos um serviço.");
      return;
    }

    try {
      const payload = {
        titulo: formTitulo,     // Para o backend
        validade: formValidade, // Para o backend
        servicos_ids: selectedServicos,
        ativo: editando ? editando.ativo : true,
        tipo: "percentual",    // Evita erro de constraint no banco
        valor: Number(formValor),
        descricao: ""
      };

      if (editando) {
        await PromocaoService.atualizar(editando.id, payload);
        alert("Promoção atualizada!");
      } else {
        await PromocaoService.criar(payload);
        alert("Campanha lançada com sucesso!");
      }

      setShowModal(false);
      onAtualizar(); 
    } catch (err) {
      console.error("Erro ao salvar promoção:", err);
      alert("Erro ao salvar. Verifique se todos os campos estão corretos.");
    }
  }

  // --- REMOVER ---
  async function removerPromocao(id: number) {
    if (!window.confirm("Deseja apagar esta campanha permanentemente?")) return;

    try {
      await PromocaoService.remover(id);
      alert("Campanha removida.");
      onAtualizar();
    } catch (err) {
      console.error("Erro ao remover:", err);
      alert("Erro ao remover promoção.");
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen rounded-[2.5rem] overflow-hidden animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="p-6 sm:p-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white border-b border-gray-100">
        <div className="flex items-center gap-4 sm:gap-6">
          <button onClick={onVoltar} className="p-3 bg-gray-100 rounded-full text-black hover:bg-[#b5820e] hover:text-white transition-all shadow-sm">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-black uppercase tracking-tighter">Ofertas de Luxo</h2>
            <p className="text-gray-400 text-[10px] uppercase tracking-[0.3em] mt-1">Campanhas e Descontos Exclusivos</p>
          </div>
        </div>
        <button onClick={() => abrirModal()} className="bg-black text-[#b5820e] px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-lg">
          <Plus size={18} /> Lançar Campanha
        </button>
      </div>

      {/* LISTA DE CARDS */}
      <div className="p-6 sm:p-10">
        {promocoes.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-gray-200">
            <Percent className="mx-auto text-gray-200 mb-4" size={64} />
            <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Nenhuma campanha ativa</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {promocoes.map((promo) => (
              <div key={promo.id} className="group rounded-[2.5rem] p-8 bg-white border border-transparent hover:border-[#b5820e] transition-all shadow-sm hover:shadow-2xl flex flex-col justify-between relative overflow-hidden">
                
                {/* Badge de Desconto */}
                <div className="absolute top-0 right-0 bg-[#b5820e] text-black font-black px-6 py-2 rounded-bl-3xl text-sm shadow-md">
                  {parseFloat(promo.valor || 0).toFixed(0)}% OFF
                </div>

                <div>
                  <div className="flex justify-between mb-8">
                    <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center text-[#b5820e] shadow-xl">
                      <Percent size={24} />
                    </div>
                    <div className="flex gap-2 mr-16">
                      <button onClick={() => abrirModal(promo)} className="p-2.5 bg-gray-50 rounded-xl text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm"><Pencil size={16} /></button>
                      <button onClick={() => removerPromocao(promo.id)} className="p-2.5 bg-gray-50 rounded-xl text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm"><Trash2 size={16} /></button>
                    </div>
                  </div>

                  <h3 className="text-2xl font-black text-black mb-4 uppercase tracking-tight">{promo.titulo || promo.nome}</h3>
                  
                  {/* EXIBIÇÃO DOS SERVIÇOS (CORRIGIDA) */}
                  <div className="flex items-center gap-2 mb-3">
                    <Zap size={14} className="text-[#b5820e] fill-[#b5820e]" />
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Serviços Incluídos:</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-8 min-h-[40px]">
                    {(() => {
                      const ids = promo.servicos_ids || promo.servico_ids || [];
                      if (!Array.isArray(ids) || ids.length === 0) return <span className="text-[10px] text-gray-400 italic">Nenhum serviço selecionado</span>;

                      return ids.map((sid: any) => {
                        const s = servicosReais.find((srv) => Number(srv.id) === Number(sid));
                        return (
                          <span key={sid} className="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-xl text-[9px] font-bold text-gray-600 uppercase flex items-center gap-1.5">
                            <Tag size={10} className="text-[#b5820e]" /> {s?.nome || `Serviço #${sid}`}
                          </span>
                        );
                      });
                    })()}
                  </div>
                </div>

                {/* FOOTER DO CARD */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar size={16} className="text-[#b5820e]" />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      Expira: {new Date(promo.validade || promo.data_fim).toLocaleDateString("pt-PT")}
                    </span>
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full ${promo.ativo ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                    {promo.ativo ? "Ativa" : "Inativa"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL DE EDIÇÃO / CRIAÇÃO */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 sm:p-6">
          <div className="bg-white rounded-[3.5rem] w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 border border-white/20">
            <div className="bg-black p-8 flex justify-between items-center">
              <h3 className="text-2xl font-serif font-black text-white uppercase tracking-tight">
                {editando ? "Ajustar Campanha" : "Nova Campanha"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white transition-all p-2 bg-white/5 rounded-full"><X size={24} /></button>
            </div>

            <div className="p-10 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-3">Nome da Promoção</label>
                  <input className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-[#b5820e] focus:bg-white outline-none transition-all font-bold text-black" value={formTitulo} onChange={(e) => setFormTitulo(e.target.value)} placeholder="Ex: Black Friday" />
                </div>
                <div className="sm:col-span-1">
                  <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-3">Desconto %</label>
                  <input type="number" className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-[#b5820e] focus:bg-white outline-none transition-all font-bold text-black" value={formValor} onChange={(e) => setFormValor(Number(e.target.value))} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-3">Aplicar aos Serviços</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto p-2 scrollbar-hide">
                  {servicosReais.map((s) => (
                    <button key={s.id} onClick={() => toggleServico(s.id)} className={`flex items-center justify-between p-4 rounded-2xl text-xs font-black uppercase tracking-tighter transition-all ${selectedServicos.includes(s.id) ? "bg-black text-[#b5820e] shadow-lg scale-[0.98]" : "bg-gray-50 text-gray-400 hover:bg-gray-100"}`}>
                      <span className="truncate mr-2">{s.nome}</span>
                      {selectedServicos.includes(s.id) ? <Check size={16} strokeWidth={3} /> : <Plus size={16} />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-3">Data de Expiração</label>
                <input type="date" className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-[#b5820e] focus:bg-white outline-none transition-all font-bold text-black" value={formValidade} onChange={(e) => setFormValidade(e.target.value)} />
              </div>

              <button onClick={salvarPromocao} className="w-full py-5 bg-black text-[#b5820e] rounded-2xl font-black uppercase text-sm tracking-[0.3em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-black/20">
                {editando ? "Salvar Alterações" : "Lançar Campanha de Luxo"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}