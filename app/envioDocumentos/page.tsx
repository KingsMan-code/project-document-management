"use client";

import Header from "../../src/components/Header";
import Footer from "../../src/components/Footer";
import { useState } from "react";
import { useAppSelector } from "../../store/hooks";
import { useRouter } from "next/navigation";

export default function EnvioDocumentos() {
  const router = useRouter();
  const { nome, cpf } = useAppSelector((state) => state.cliente);
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

  const handleSubmitFinal = (e: React.FormEvent) => {
    e.preventDefault();
    const documentos = arquivos.map((file) => ({
      nomeArquivo,
      arquivo: file.name,
    }));

    const payload = {
      nomeCliente: nome,
      cpf,
      documentos,
    };

    console.log("Payload pronto para API:", payload);

    // Reset
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

          <form className="space-y-6" onSubmit={handleSubmitFinal}>
            <div>
              <label htmlFor="nomeArquivo" className="block text-sm font-bold uppercase text-[#CA9D14] mb-2">
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
              <label htmlFor="arquivo" className="block text-sm font-bold uppercase text-[#CA9D14] mb-2">
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
            </div>

            {arquivos.length > 0 && (
              <table className="mt-4 w-full text-left text-sm">
                <thead>
                  <tr className="text-[#CA9D14]">
                    <th className="py-2">Nome Atribuído</th>
                    <th className="py-2 text-center">Editar</th>
                    <th className="py-2 text-center">Excluir</th>
                  </tr>
                </thead>
                <tbody>
                  {arquivos.map((file, idx) => (
                    <tr key={idx} className="border-t border-gray-300">
                      <td className="py-2">{nomeArquivo}</td>
                      <td className="text-center">
                        <button
                          type="button"
                          title="Editar"
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => alert("Função de editar nome em desenvolvimento")}
                        >
                          ✎
                        </button>
                      </td>
                      <td className="text-center">
                        <button
                          type="button"
                          title="Excluir"
                          onClick={() => handleRemoveFile(idx)}
                          className="text-red-600 hover:text-red-800"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <button
              type="submit"
              className="w-full bg-yellow text-[#1A243F] font-bold py-3 px-6 rounded-lg transition-all duration-200 hover:bg-[#DDAC17] shadow-lg"
            >
              Enviar Documentos
            </button>
          </form>

          <div className="text-center mt-6">
            <button
              onClick={() => router.back()}
              className="text-sm text-[#CA9D14] hover:underline"
            >
              Voltar
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
