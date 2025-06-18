"use client";

import Header from "../../src/components/Header";
import Footer from "../../src/components/Footer";
import { useState } from "react";
import { useAppSelector } from "../../store/hooks";
import { useRouter } from "next/navigation";

export default function EnvioDocumentos() {
  const router = useRouter();
  const { nome, cpf } = useAppSelector((state) => state.cliente);
  const [arquivos, setArquivos] = useState<File[]>([]);
  const [nomesAtribuidos, setNomesAtribuidos] = useState<string[]>([]);
  const [editandoIndex, setEditandoIndex] = useState<number | null>(null);
  const [novoNome, setNovoNome] = useState("");
  const [confirmandoExclusaoIndex, setConfirmandoExclusaoIndex] = useState<number | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const novosArquivos = Array.from(files);
      setArquivos((prev) => [...prev, ...novosArquivos]);
      setNomesAtribuidos((prev) => [
        ...prev,
        ...novosArquivos.map((file) => file.name),
      ]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setArquivos((prev) => prev.filter((_, idx) => idx !== index));
    setNomesAtribuidos((prev) => prev.filter((_, idx) => idx !== index));
    setConfirmandoExclusaoIndex(null);
  };

  const handleSubmitFinal = (e: React.FormEvent) => {
    e.preventDefault();
    const documentos = arquivos.map((file, idx) => ({
      nomeArquivo: nomesAtribuidos[idx],
      arquivo: file.name,
    }));

    const payload = {
      nomeCliente: nome,
      cpf,
      documentos,
    };

    console.log("Payload pronto para API:", payload);
  };

  const abrirEdicao = (idx: number) => {
    setEditandoIndex(idx);
    setNovoNome(nomesAtribuidos[idx]);
  };

  const salvarEdicao = () => {
    if (editandoIndex !== null) {
      const atualizados = [...nomesAtribuidos];
      atualizados[editandoIndex] = novoNome;
      setNomesAtribuidos(atualizados);
      setEditandoIndex(null);
      setNovoNome("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#1A243F]">
      <Header />

      <main className="flex-1 px-4 py-8 flex items-center justify-center">
        <div className="bg-white text-[#1A243F] rounded-2xl shadow-lg p-10 max-w-xl w-full relative border-l-8 border-[#ECC440]">
          <h1 className="text-3xl font-bold text-center mb-6">Envio de Documentos</h1>
          <p className="text-center text-[#CA9D14] mb-8">
            Selecione os documentos para enviar.
          </p>

          <form className="space-y-6" onSubmit={handleSubmitFinal}>
            <div>
              <label htmlFor="arquivo" className="block text-sm font-bold uppercase text-[#CA9D14] mb-2">
                Selecionar Arquivos
              </label>
              <input
                type="file"
                id="arquivo"
                multiple
                onChange={handleFileChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300"
                required
              />
            </div>

            {arquivos.length > 0 && (
              <table className="mt-4 w-full text-sm text-left">
                <thead className="text-[#CA9D14]">
                  <tr>
                    <th className="py-2">Nome Atribuído</th>
                    <th className="py-2 text-center">Editar</th>
                    <th className="py-2 text-center">Excluir</th>
                  </tr>
                </thead>
                <tbody>
                  {arquivos.map((file, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="py-2">{nomesAtribuidos[idx]}</td>
                      <td className="text-center">
                        <button
                          type="button"
                          onClick={() => abrirEdicao(idx)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          ✎
                        </button>
                      </td>
                      <td className="text-center">
                        <button
                          type="button"
                          onClick={() => setConfirmandoExclusaoIndex(idx)}
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
              className="w-full bg-yellow text-[#1A243F] font-bold py-3 px-6 rounded-lg hover:bg-[#DDAC17]"
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

      {editandoIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4 text-[#1A243F]">Editar Nome do Arquivo</h2>
            <input
              type="text"
              value={novoNome}
              onChange={(e) => setNovoNome(e.target.value)}
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditandoIndex(null)}
                className="px-4 py-2 text-sm rounded-md bg-gray-200 hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={salvarEdicao}
                className="px-4 py-2 text-sm rounded-md bg-yellow text-[#1A243F] hover:bg-[#DDAC17]"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmandoExclusaoIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4 text-[#1A243F]">Confirmar Exclusão</h2>
            <p className="mb-6 text-gray-700">Deseja realmente excluir o arquivo "{nomesAtribuidos[confirmandoExclusaoIndex]}"?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmandoExclusaoIndex(null)}
                className="px-4 py-2 text-sm rounded-md bg-gray-200 hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleRemoveFile(confirmandoExclusaoIndex)}
                className="px-4 py-2 text-sm rounded-md bg-yellow text-[#1A243F] hover:bg-[#DDAC17]"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
