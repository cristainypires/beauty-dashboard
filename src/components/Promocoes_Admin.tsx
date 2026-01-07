import { useState } from "react";
import { Plus, Percent, ChevronLeft, Trash2, Pencil, X, Calendar, Sparkles, Check, Tag } from "lucide-react";

type Promocao = {
  id: number;
  titulo: string;
  validade: string;
  ativa: boolean;
  servicos_ids: number[]; // IDs dos serviços associados
};

// Mock de serviços que já existem no teu sistema (Tabela SERVICO)
const servicosDisponiveis = [
  { id: 1, nome: "Manicure" },
  { id: 2, nome: "Pedicure" },
  { id: 3, nome: "Limpeza de Pele" },
  { id: 4, nome: "Massagem Relaxante" },
  { id: 5, nome: "Drenagem Linfática" },
];

export function Promocoes_Admin({ onVoltar }: { onVoltar: () => void }) {
  const [promocoes, setPromocoes] = useState<Promocao[]>([
    { id: 1, titulo: "Pack Mãos & Pés Gold", validade: "2023-12-31", ativa: true, servicos_ids: [1, 2] },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState<Promocao | null>(null);
  
  // Estados do formulário
  const [formTitulo, setFormTitulo] = useState("");
  const [formValidade, setFormValidade] = useState("");
  const [selectedServicos, setSelectedServicos] = useState<number[]>([]);

  function abrirModal(promo?: Promocao) {
    if (promo) {
      setEditando(promo);
      setFormTitulo(promo.titulo);
      setFormValidade(promo.validade);
      setSelectedServicos(promo.servicos_ids);
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

  function salvarPromocao() {
    if (!formTitulo || !formValidade || selectedServicos.length === 0) {
      alert("Por favor, selecione pelo menos um serviço.");
      return;
    }

    const novaData: Promocao = {
      id: editando ? editando.id : Date.now(),
      titulo: formTitulo,
      validade: formValidade,
      ativa: true,
      servicos_ids: selectedServicos
    };

    if (editando) {
      setPromocoes(promocoes.map(p => p.id === editando.id ? novaData : p));
    } else {
      setPromocoes([...promocoes, novaData]);
    }
    setShowModal(false);
  }

  return (
    <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-50 overflow-hidden animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="bg-black p-10 flex justify-between items-center relative">
        <div className="relative z-10 flex items-center gap-6">
          <button onClick={onVoltar} className="p-3 bg-white/10 rounded-full text-[#b5820e] hover:bg-[#b5820e] hover:text-black transition-all">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h2 className="text-3xl font-serif font-black text-white uppercase tracking-tighter text-left">Ofertas de Luxo</h2>
            <p className="text-gray-400 text-[10px] uppercase tracking-[0.3em] mt-1">Vincule serviços a campanhas exclusivas</p>
          </div>
        </div>
        <button onClick={() => abrirModal()} className="bg-[#b5820e] text-black px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-2">
          <Plus size={18} /> Lançar Campanha
        </button>
      </div>

      {/* LISTA */}
      <div className="p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {promocoes.map((promo) => (
            <div key={promo.id} className="group bg-gray-50 rounded-[2.5rem] p-8 border border-transparent hover:border-[#b5820e]/30 transition-all shadow-sm">
              <div className="flex justify-between mb-6">
                <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center text-[#b5820e] shadow-lg">
                  <Percent size={20} />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => abrirModal(promo)} className="p-2 bg-white rounded-lg text-blue-600 hover:bg-blue-600 hover:text-white transition"><Pencil size={14}/></button>
                  <button onClick={() => setPromocoes(promocoes.filter(p => p.id !== promo.id))} className="p-2 bg-white rounded-lg text-red-600 hover:bg-red-600 hover:text-white transition"><Trash2 size={14}/></button>
                </div>
              </div>

              <h3 className="text-xl font-bold text-black mb-4">{promo.titulo}</h3>
              
              {/* SERVIÇOS ASSOCIADOS */}
              <div className="flex flex-wrap gap-2 mb-6">
                {promo.servicos_ids.map(sid => {
                  const s = servicosDisponiveis.find(srv => srv.id === sid);
                  return (
                    <span key={sid} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-[9px] font-bold text-gray-500 uppercase flex items-center gap-1">
                      <Tag size={10} className="text-[#b5820e]"/> {s?.nome}
                    </span>
                  );
                })}
              </div>

              <div className="flex items-center gap-2 text-gray-400">
                <Calendar size={14} className="text-[#b5820e]" />
                <span className="text-[10px] font-black uppercase tracking-widest">Até {promo.validade}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL COM SELEÇÃO DE SERVIÇOS */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-xl shadow-2xl overflow-hidden border border-gray-100 animate-in zoom-in duration-300">
            <div className="bg-black p-8 flex justify-between items-center text-left">
                <h3 className="text-xl font-serif font-black text-white uppercase">Detalhes da Campanha</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white"><X/></button>
            </div>
            
            <div className="p-10 space-y-6 text-left">
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3">Nome da Promoção</label>
                  <input
                    className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-[#b5820e] outline-none transition"
                    value={formTitulo}
                    onChange={(e) => setFormTitulo(e.target.value)}
                  />
                </div>

                {/* SELEÇÃO DE SERVIÇOS (Multi-select visual) */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3">Serviços Abrangidos</label>
                  <div className="grid grid-cols-2 gap-3 max-h-40 overflow-y-auto p-2">
                    {servicosDisponiveis.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => toggleServico(s.id)}
                        className={`flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all ${
                          selectedServicos.includes(s.id) 
                          ? 'bg-black text-[#b5820e] shadow-md' 
                          : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                        }`}
                      >
                        {s.nome}
                        {selectedServicos.includes(s.id) && <Check size={14} />}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3">Expira em</label>
                  <input
                    type="date"
                    className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-[#b5820e] outline-none transition"
                    value={formValidade}
                    onChange={(e) => setFormValidade(e.target.value)}
                  />
                </div>

                <button
                  onClick={salvarPromocao}
                  className="w-full py-5 bg-black text-[#b5820e] rounded-2xl font-black uppercase text-xs tracking-[0.3em] shadow-xl hover:opacity-90 transition-all"
                >
                  Confirmar Campanha
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}