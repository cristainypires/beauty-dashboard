import React from "react";
import { User } from "lucide-react";

export function Header() {
  return (
    <header className="bg-white border-b border-[#b5820ecc] py-4 px-6 md:px-12 flex justify-between items-center shadow-sm">
      <div className="flex items-center">
        <div className="w-40">
          <img src="logoo.png" alt="Maddie Logo" className="w-full h-auto" />
        </div>
         <div className="h-10 w-[1px] bg-gray-200 mx-6 hidden md:block"></div>

        <div className="flex flex-col justify-center">
          <h1 className="text-2xl font-semibold  text-[#5D2E46]">
            Maddie Tavares
          </h1>
          <span className="text-[10px] text-[#b5820e] font-bold tracking-[0.4em] uppercase mt-1">
            Beauty Boutique
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 border-l pl-6 border-gray-200">
        <div className="text-lg font-semibold  text-[#5D2E46]">
          <p className="text-sm ">Maddie Tavares</p>
          <p className="text-[20px] text-[#b5820e] ">Administradora Geral</p>
        </div>

        {/* Avatar com Borda Gold */}
        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
          <img
            src="maddie.jpg"
            alt="Avatar Maddie Tavares"
            className="w-full h-full rounded-md object-cover"
          />
        </div>
      </div>
    </header>
  );
}
