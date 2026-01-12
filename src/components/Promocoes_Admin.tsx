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
    <div className=" rounded-[2.5rem] overflow-hidden animate-in fade-in duration-500">
  
  {/* HEADER */}
  <div className="p-6 sm:p-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
  
  {/* Botão voltar + título */}
  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full sm:w-auto">
    
    {/* Botão voltar */}
    <button
      onClick={onVoltar}
      className="p-3 bg-white/10 rounded-full text-[#b5820e] hover:bg-[#b5820e] hover:text-black transition-all"
    >
      <ChevronLeft size={24} />
    </button>
    
    {/* Título e subtítulo */}
    <div>
      <h2 className="text-2xl sm:text-3xl font-serif font-black text-black uppercase tracking-tighter">
        Ofertas de Luxo
      </h2>
      <p className="text-gray-400 text-[10px] sm:text-[11px] uppercase tracking-[0.3em] mt-1">
        Vincule serviços a campanhas exclusivas
      </p>
    </div>
  </div>

  {/* Botão Lançar Campanha */}
  <button
    onClick={() => abrirModal()}
    className="bg-[#b5820e] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-black uppercase text-xs sm:text-sm tracking-widest flex items-center gap-2 w-full sm:w-auto justify-center"
  >
    <Plus size={18} /> Lançar Campanha
  </button>

</div>


  {/* LISTA */}
  <div className="p-6 sm:p-10">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {promocoes.map((promo) => (
        <div key={promo.id} className="group  rounded-[2.5rem] p-6 sm:p-8 border border-transparent hover:border-[#b5820e] transition-all shadow-md flex flex-col justify-between">
          
          <div className="flex justify-between mb-4 sm:mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black rounded-xl flex items-center justify-center text-[#b5820e] shadow-lg">
              <Percent size={20} />
            </div>
            <div className="flex gap-2">
              <button onClick={() => abrirModal(promo)} className="p-2 bg-white rounded-lg text-blue-600 hover:bg-blue-600 hover:text-white transition"><Pencil size={14}/></button>
              <button onClick={() => setPromocoes(promocoes.filter(p => p.id !== promo.id))} className="p-2 bg-white rounded-lg text-red-600 hover:bg-red-600 hover:text-white transition"><Trash2 size={14}/></button>
            </div>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-black mb-4">{promo.titulo}</h3>
          
          {/* SERVIÇOS ASSOCIADOS */}
          <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
            {promo.servicos_ids.map(sid => {
              const s = servicosDisponiveis.find(srv => srv.id === sid);
              return (
                <span key={sid} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-[9px] sm:text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                  <Tag size={10} className="text-[#b5820e]"/> {s?.nome}
                </span>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-gray-400 text-[9px] sm:text-[10px]">
            <Calendar size={14} className="text-[#b5820e]" />
            <span className="font-black uppercase tracking-widest">Até {promo.validade}</span>
          </div>
        </div>
      ))}
    </div>
  </div>

  {/* MODAL */}
  {showModal && (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 sm:p-6">
      <div className="bg-white rounded-[3rem] w-full max-w-md sm:max-w-xl shadow-2xl overflow-hidden border border-gray-100 animate-in zoom-in duration-300">
        <div className="bg-black p-6 sm:p-8 flex justify-between items-center">
          <h3 className="text-xl sm:text-2xl font-serif font-black text-white uppercase">Detalhes da Campanha</h3>
          <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white"><X size={20}/></button>
        </div>
        
        <div className="p-6 sm:p-10 space-y-4 sm:space-y-6 text-left">
          
          <div>
            <label className="block text-[10px] sm:text-xs font-black uppercase text-gray-400 tracking-widest mb-2 sm:mb-3">Nome da Promoção</label>
            <input
              className="w-full p-3 sm:p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-[#b5820e] outline-none transition"
              value={formTitulo}
              onChange={(e) => setFormTitulo(e.target.value)}
            />
          </div>

          {/* SELEÇÃO DE SERVIÇOS */}
          <div>
            <label className="block text-[10px] sm:text-xs font-black uppercase text-gray-400 tracking-widest mb-2 sm:mb-3">Serviços Abrangidos</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 max-h-44 overflow-y-auto p-1">
              {servicosDisponiveis.map((s) => (
                <button
                  key={s.id}
                  onClick={() => toggleServico(s.id)}
                  className={`flex items-center justify-between p-2 sm:p-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
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
            <label className="block text-[10px] sm:text-xs font-black uppercase text-gray-400 tracking-widest mb-2 sm:mb-3">Expira em</label>
            <input
              type="date"
              className="w-full p-3 sm:p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-[#b5820e] outline-none transition"
              value={formValidade}
              onChange={(e) => setFormValidade(e.target.value)}
            />
          </div>

          <button
            onClick={salvarPromocao}
            className="w-full py-4 sm:py-5 bg-black text-[#b5820e] rounded-2xl font-black uppercase text-xs sm:text-sm tracking-[0.3em] shadow-xl hover:opacity-90 transition-all"
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