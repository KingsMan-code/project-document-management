"use client";

import Header from "../../src/components/Header";
import Footer from "../../src/components/Footer";
import { useState } from "react";

export default function EnvioDocumentos() {
  const [nomeArquivo, setNomeArquivo] = useState("");
  const [arquivos, setArquivos] = useState<File[]>([]);
  const [nomeTouched, setNomeTouched] = useState(false);
  const [arquivoTouched, setArquivoTouched] = useState(false);

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setArquivoTouched(true);
  const files = e.target.files;

  if (files) {
    setArquivos((prev) => [...prev, ...Array.from(files)]);
  }
};

  const handleNomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNomeTouched(true);
    setNomeArquivo(e.target.value);
  };

  const handleRemoveFile = (index: number) => {
    setArquivos((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      `Arquivos (${arquivos.map((arq) => arq.name).join(", ")}) enviados com sucesso!`
    );
    setNomeArquivo("");
    setArquivos([]);
    setNomeTouched(false);
    setArquivoTouched(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#1A243F]">
      <Header />

      <main className="flex-1 px-4 py-8 flex items-center justify-center">
        <div className="bg-white text-[#1A243F] rounded-2xl shadow-lg p-10 max-w-xl w-full relative border-l-8 border-[#ECC440] transition-transform transform hover:scale-[1.01] hover:shadow-[0_0_20px_#ECC44050]">
          <h1 className="text-3xl font-bold text-center mb-6">
            Envio de Documentos
          </h1>
          <p className="text-center text-[#CA9D14] mb-8">
            Preencha o nome do arquivo e selecione os documentos para enviar.
          </p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="nomeArquivo"
                className="block text-sm font-bold uppercase text-[#CA9D14] mb-2"
              >
                Nome do Arquivo
                {!nomeArquivo && !nomeTouched && (
                  <span className="text-red-600 ml-1">*</span>
                )}
              </label>
              <input
                type="text"
                id="nomeArquivo"
                placeholder="Ex: RG, Contrato, Procuração..."
                value={nomeArquivo}
                onChange={handleNomeChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ECC440] transition-all"
                required
              />
            </div>

            <div>
              <label
                htmlFor="arquivo"
                className="block text-sm font-bold uppercase text-[#CA9D14] mb-2"
              >
                Selecionar Arquivos
                {arquivos.length === 0 && !arquivoTouched && (
                  <span className="text-red-600 ml-1">*</span>
                )}
              </label>
              <input
                type="file"
                id="arquivo"
                multiple
                onChange={handleFileChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ECC440] transition-all"
                required
              />
              {arquivos.length > 0 && (
                <div>
                  <ul className="mt-2 text-xs text-gray-600">
                    {arquivos.map((file, idx) => (
                      <li key={idx} className="flex items-center justify-between">
                        <span>{file.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(idx)}
                          className="ml-3 text-red-600 font-extrabold text-xl hover:text-red-800 transition-colors duration-150 rounded-full w-8 h-8 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-red-400"
                          aria-label={`Remover ${file.name}`}
                          title="Remover arquivo"
                        >
                          <span
                            style={{
                              fontFamily: "monospace",
                              fontWeight: 900,
                              fontSize: "1.5rem",
                              lineHeight: 1,
                            }}
                          >
                            ×
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-end mt-2">
                    <button
                      type="button"
                      onClick={() => setArquivos([])}
                      className="flex items-center gap-2 bg-red-100 text-red-700 font-bold px-4 py-2 rounded-lg hover:bg-red-200 transition-all text-sm shadow"
                      title="Remover todos os arquivos"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      Remover todos
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-yellow text-[#1A243F] font-bold py-3 px-6 rounded-lg transition-all duration-200 hover:bg-[#DDAC17] shadow-lg"
            >
              Enviar Documentos
            </button>
          </form>

          <div className="text-center mt-6">
            <button
              onClick={() => (window.location.href = "/")}
              className="text-sm text-[#CA9D14] hover:underline"
            >
              Voltar ao Início
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
