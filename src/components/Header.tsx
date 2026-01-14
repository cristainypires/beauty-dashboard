import React from "react";
import { User } from "lucide-react";

export function Header() {
  return (
    <header className="bg-white border-b border-[#b5820ecc] shadow-sm">
      <div className="py-4 px-4 sm:px-6 md:px-12 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        {/* ===== ESQUERDA: LOGO + NEGÓCIO ===== */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Logo */}
          <div className="w-32 sm:w-40 flex-shrink-0">
            <img src="logoo.png" alt="Maddie Logo" className="w-full h-auto" />
          </div>

          {/* Separador (só desktop) */}
          <div className="h-10 w-[1px] bg-gray-200 hidden md:block"></div>

          {/* Nome + Boutique */}
          <div className="hidden sm:block">
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl font-semibold text-black">
                Maddie Tavares
              </h1>
              <span className="text-[10px] text-[#b5820e] font-bold tracking-[0.4em] uppercase mt-1">
                Beauty Boutique
              </span>
            </div>
          </div>
        </div>

        {/* ===== DIREITA: ADMIN ===== */}
        <div className="flex flex-col sm:flex-row items-center gap-4 border-t sm:border-t-0 sm:border-l  sm:pt-0 sm:pl-6 border-gray-200">
          <div className="text-center sm:text-left">
            <p className="text-sm font-semibold text-black">
              Maddie Tavares
            </p>
            <p className="text-base sm:text-[20px] text-[#b5820e] font-semibold">
              Administradora Geral
            </p>
          </div>

          {/* Avatar */}
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-full shadow-lg overflow-hidden">
            <img
              src="maddie.jpg"
              alt="Avatar Maddie Tavares"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
