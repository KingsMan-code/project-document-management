"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../src/components/Header";
import Footer from "../src/components/Footer";

export default function Inicio() {
  const [showLayout, setShowLayout] = useState(false);
  const router = useRouter();

  const handleButtonClick = () => {
    setShowLayout(true);
    router.push("/changeWAY"); // Redireciona imediatamente ao clicar
  };

  if (!showLayout) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <h1 className="text-4xl font-bold text-white animate-bounce-slow transition transform hover:-translate-y-3 hover:scale-110 duration-500 underline underline-offset-8 decoration-secondary">
          Alcides e Mosinho
        </h1>

        <p className="text-xs text-lightGray mt-4 font-extralight max-w-xl">
          "Nós somos o que repetidamente fazemos. A excelência, portanto, não é um
          feito, mas um hábito."
        </p>

        <button
          onClick={handleButtonClick}
          className="mt-8 bg-yellow hover:bg-darkYellow text-primary font-bold py-3 px-6 border-b-4 border-goldYellow hover:border-darkYellow rounded transition-all duration-200 shadow-lg"
        >
          Entrar
        </button>
      </div>
    );
  }

  // Página apenas com o background (sem conteúdo central)
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1" />
      <Footer />
    </div>
  );
}

