import React from 'react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-[#b5820ecc] py-6 mt-10">
      <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-col items-center justify-between gap-4">
        {/* Texto */}
        <p className="text-gray-500 text-sm text-center md:text-left">
          © {new Date().getFullYear()} <span className="text-[#b5820ecc] font-medium">Maddie Beauty Boutique</span>, 
          Todos os direitos reservados
        </p>

        
        <div className="flex flex-wrap justify-center md:justify-end items-center gap-6 text-sm text-gray-500">
          <a href="#" className="hover:text-[#b5820ecc] transition">Privacidade</a>
          <a href="#" className="hover:text-[#b5820ecc] transition">Termos de Uso</a>
          <a href="#" className="hover:text-[#b5820ecc] transition">Suporte</a>
        </div>
      </div>
    </footer>
  );
}
