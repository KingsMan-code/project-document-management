import React from "react";

export default function Header() {
  return (
    <header className="w-full flex items-center justify-between py-4 px-8">
      <div className="flex gap-6">
        <button className="bg-transparent text-white font-semibold py-2 px-6 rounded underline underline-offset-4 decoration-[#7a582a] focus:outline-none border-none hover:bg-blue-500 hover:text-white transition">
          Opção 1
        </button>
        <button className="bg-transparent text-white font-semibold py-2 px-6 rounded underline underline-offset-4 decoration-[#7a582a] focus:outline-none border-none hover:bg-blue-500 hover:text-white transition">
          Opção 2
        </button>
      </div>
      <h1 className="text-2xl font-bold text-white text-center underline underline-offset-8 decoration-[#7a582a]">
        Alcides e Mosinho
      </h1>
      <div className="flex gap-6">
        <button className="bg-transparent text-white font-semibold py-2 px-6 rounded underline underline-offset-4 decoration-[#7a582a] focus:outline-none border-none hover:bg-blue-500 hover:text-white transition">
          Opção 3
        </button>
        <button className="bg-transparent text-white font-semibold py-2 px-6 rounded underline underline-offset-4 decoration-[#7a582a] focus:outline-none border-none hover:bg-blue-500 hover:text-white transition">
          Opção 4
        </button>
      </div>
    </header>
  );
}