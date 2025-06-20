// app/novoCliente/page.tsx
"use client";

import { useRouter } from "next/navigation";
import Header from "../../src/components/Header";
import Footer from "../../src/components/Footer";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTipoCliente, limparCliente } from "../../store/clienteSlice";
import FluxoCPF from "../../src/components/FluxoCPF";
import FluxoCNPJ from "../../src/components/FluxoCNPJ";
import { RootState } from "../../store/store";

export default function NovoCliente() {
  const router = useRouter();
  const dispatch = useDispatch();
  const tipoCliente = useSelector((state: RootState) => state.cliente.tipoCliente);

  const [step, setStep] = useState(1);

  const handleSelectTipoCliente = (type: 'pf' | 'pj') => {
    dispatch(setTipoCliente(type));
    setStep(3); // Avança para o próximo passo após selecionar o tipo
  };

  const handleReset = () => {
    dispatch(limparCliente());
    setStep(1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#1A243F]">
      <Header />
      <main className="flex-1 px-4 py-8 flex items-center justify-center">
        <div className="bg-white text-[#1A243F] rounded-2xl shadow-lg p-10 max-w-xl w-full relative border-l-8 border-[#ECC440]">
          
          {/* Step 1 - Bem-vindo */}
          {step === 1 && (
            <>
              <p className="text-center text-[#CA9D14] mb-8">
                Bem-vindo! É um prazer ter você como cliente. A partir de agora, vamos iniciar seu cadastro. Iremos precisar de algumas informações.
              </p>
              <button
                onClick={() => setStep(2)}
                className="w-full bg-yellow text-[#1A243F] font-bold py-3 px-6 rounded-lg hover:bg-[#D4B91A] transition-all"
              >
                Começar
              </button>
            </>
          )}

          {/* Step 2 - Tipo de Cliente */}
          {step === 2 && (
            <>
              <p className="text-center text-[#CA9D14] mb-8">
                Você é cliente pessoa física ou cliente empresa?
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
                <button
                  onClick={() => handleSelectTipoCliente("pf")}
                  className="flex-1 bg-white border-2 border-[#ECC440] rounded-xl shadow-md p-6 flex flex-col items-center hover:bg-[#FFF8E1] transition-all"
                >
                  <span className="text-3xl mb-2">👤</span>
                  <span className="font-bold text-lg text-[#1A243F]">
                    Pessoa Física
                  </span>
                </button>
                <button
                  onClick={() => handleSelectTipoCliente("pj")}
                  className="flex-1 bg-white border-2 border-[#ECC440] rounded-xl shadow-md p-6 flex flex-col items-center hover:bg-[#FFF8E1] transition-all"
                >
                  <span className="text-3xl mb-2">🏢</span>
                  <span className="font-bold text-lg text-[#1A243F]">
                    Empresa
                  </span>
                </button>
              </div>
              <button
                onClick={() => setStep(1)}
                className="w-full bg-gray-200 text-[#1A243F] font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-all"
              >
                Voltar
              </button>
            </>
          )}

          {/* Renderiza o fluxo específico com base no tipo de cliente */}
          {step >= 3 && tipoCliente === "pf" && (
            <FluxoCPF currentStep={step} setStep={setStep} />
          )}
          {step >= 3 && tipoCliente === "pj" && (
            <FluxoCNPJ currentStep={step} setStep={setStep} />
          )}

          {/* Botões de ação sempre visíveis (exceto na tela de agradecimento) */}
          {step < 8 && tipoCliente === "pf" && (
            <div className="mt-4 space-y-2">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="w-full bg-gray-200 text-[#1A243F] font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-all"
              >
                Deixar para depois
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="w-full bg-red-100 text-red-600 font-bold py-2 px-6 rounded-lg hover:bg-red-200 transition-all text-sm"
              >
                Recomeçar cadastro
              </button>
            </div>
          )}
          
          {step < 9 && tipoCliente === "pj" && (
            <div className="mt-4 space-y-2">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="w-full bg-gray-200 text-[#1A243F] font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-all"
              >
                Deixar para depois
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="w-full bg-red-100 text-red-600 font-bold py-2 px-6 rounded-lg hover:bg-red-200 transition-all text-sm"
              >
                Recomeçar cadastro
              </button>
            </div>
          )}

          {/* Indicador de progresso */}
          {step > 2 && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>Progresso</span>
                <span>
                  {tipoCliente === "pf" 
                    ? `${Math.max(0, step - 2)}/6` 
                    : `${Math.max(0, step - 2)}/7`
                  }
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-[#ECC440] h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: tipoCliente === "pf" 
                      ? `${(Math.max(0, step - 2) / 6) * 100}%`
                      : `${(Math.max(0, step - 2) / 7) * 100}%`
                  }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

