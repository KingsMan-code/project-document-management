// src/components/FluxoCPF.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setDadosPF, adicionarDocumento, setProblema } from "../../store/clienteSlice";
import { RootState } from "../../store/store";
import { formatCpfCnpj, isValidCPF, isValidDate } from "../utils/validation";

interface FluxoCPFProps {
  currentStep: number;
  setStep: (step: number) => void;
}

interface DocumentoLocal {
  file: File;
  nomeAtribuido: string;
}

export default function FluxoCPF({ currentStep, setStep }: FluxoCPFProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const clienteState = useSelector((state: RootState) => state.cliente);

  // Estados locais para o formulário de PF
  const [nome, setNome] = useState(clienteState.nomePF);
  const [cpf, setCpf] = useState(formatCpfCnpj(clienteState.cpfPF));
  const [cpfRaw, setCpfRaw] = useState(clienteState.cpfPF);
  const [dataNascimento, setDataNascimento] = useState(clienteState.dataNascimentoPF);
  const [documentosLocais, setDocumentosLocais] = useState<DocumentoLocal[]>([]);
  const [problema, setProblemaLocal] = useState(clienteState.problema);

  const [editandoIndex, setEditandoIndex] = useState<number | null>(null);
  const [novoNomeDocumento, setNovoNomeDocumento] = useState("");
  const [confirmandoExclusaoIndex, setConfirmandoExclusaoIndex] = useState<number | null>(null);

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const onlyDigits = value.replace(/\D/g, "");
    setCpfRaw(onlyDigits);
    setCpf(formatCpfCnpj(value));
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const novosArquivos = Array.from(e.target.files);
      const novosDocumentosLocais: DocumentoLocal[] = novosArquivos.map(file => ({
        file,
        nomeAtribuido: file.name,
      }));
      setDocumentosLocais((prev) => [...prev, ...novosDocumentosLocais]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setDocumentosLocais((prev) => prev.filter((_, idx) => idx !== index));
    setConfirmandoExclusaoIndex(null);
  };

  const abrirEdicao = (idx: number) => {
    setEditandoIndex(idx);
    setNovoNomeDocumento(documentosLocais[idx].nomeAtribuido);
  };

  const salvarEdicao = () => {
    if (editandoIndex !== null) {
      const atualizados = [...documentosLocais];
      atualizados[editandoIndex].nomeAtribuido = novoNomeDocumento;
      setDocumentosLocais(atualizados);
      setEditandoIndex(null);
      setNovoNomeDocumento("");
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Dispatch dos dados para o Redux
    dispatch(setDadosPF({ nome, cpf: cpfRaw, dataNascimento }));
    dispatch(setProblema(problema));

    // Dispatch dos documentos
    documentosLocais.forEach(doc => {
      dispatch(adicionarDocumento({ nome: doc.nomeAtribuido, arquivos: [doc.file] }));
    });

    // Log para verificação
    console.log({
      tipo: 'pf',
      nome,
      cpf: cpfRaw,
      dataNascimento,
      documentos: documentosLocais.map(d => ({ name: d.nomeAtribuido, size: d.file.size })),
      problema,
    });

    // Move para o próximo passo ou completa
    if (currentStep === 8) {
      router.push("/");
    } else {
      setStep(currentStep + 1);
    }
  };

  // Renderização baseada no step atual
  switch (currentStep) {
    case 3: // Nome completo
      return (
        <>
          <p className="text-center text-[#CA9D14] mb-8">
            Qual seu nome completo?
          </p>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ECC440]"
            placeholder="Seu nome completo"
            required
          />
          {!nome.trim() && (
            <p className="text-red-600 text-sm mt-2">
              Preencha o nome para continuar.
            </p>
          )}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setStep(2)}
              className="w-1/2 bg-gray-200 text-[#1A243F] font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-all"
            >
              Anterior
            </button>
            <button
              onClick={() => nome.trim() && setStep(4)}
              className="w-1/2 bg-yellow text-[#1A243F] font-bold py-3 px-6 rounded-lg"
              disabled={!nome.trim()}
            >
              Próximo
            </button>
          </div>
        </>
      );

    case 4: // CPF
      return (
        <>
          <p className="text-center text-[#CA9D14] mb-8">Qual seu CPF?</p>
          <input
            type="text"
            value={cpf}
            onChange={handleCpfChange}
            className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ECC440]"
            placeholder="Digite seu CPF"
            required
            maxLength={14}
          />
          {!isValidCPF(cpfRaw) && (
            <p className="text-red-600 text-sm mt-2">
              Digite um CPF válido para continuar.
            </p>
          )}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setStep(3)}
              className="w-1/2 bg-gray-200 text-[#1A243F] font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-all"
            >
              Anterior
            </button>
            <button
              onClick={() => isValidCPF(cpfRaw) && setStep(5)}
              className="w-1/2 bg-yellow text-[#1A243F] font-bold py-3 px-6 rounded-lg"
              disabled={!isValidCPF(cpfRaw)}
            >
              Próximo
            </button>
          </div>
        </>
      );

    case 5: // Data de Nascimento
      return (
        <>
          <p className="text-center text-[#CA9D14] mb-8">
            Qual sua data de nascimento?
          </p>
          <input
            type="date"
            value={dataNascimento}
            onChange={(e) => setDataNascimento(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ECC440]"
            required
          />
          {!isValidDate(dataNascimento) && (
            <p className="text-red-600 text-sm mt-2">
              Informe uma data de nascimento válida para continuar.
            </p>
          )}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setStep(4)}
              className="w-1/2 bg-gray-200 text-[#1A243F] font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-all"
            >
              Anterior
            </button>
            <button
              onClick={() => isValidDate(dataNascimento) && setStep(6)}
              className="w-1/2 bg-yellow text-[#1A243F] font-bold py-3 px-6 rounded-lg"
              disabled={!isValidDate(dataNascimento)}
            >
              Próximo
            </button>
          </div>
        </>
      );

    case 6: // Upload de Documentos
      return (
        <>
          <p className="text-center text-[#CA9D14] mb-8">
            Envie seus documentos de identidade
          </p>
          <input
            type="file"
            accept="application/pdf,image/*"
            multiple
            onChange={handleDocumentUpload}
            className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ECC440]"
          />
          
          {documentosLocais.length > 0 && (
            <div className="mt-4">
              <h4 className="font-bold mb-2">Documentos adicionados:</h4>
              {documentosLocais.map((doc, idx) => (
                <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded mb-2">
                  {editandoIndex === idx ? (
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={novoNomeDocumento}
                        onChange={(e) => setNovoNomeDocumento(e.target.value)}
                        className="flex-1 px-2 py-1 border rounded"
                      />
                      <button
                        onClick={salvarEdicao}
                        className="px-3 py-1 bg-green-500 text-white rounded text-sm"
                      >
                        Salvar
                      </button>
                      <button
                        onClick={() => setEditandoIndex(null)}
                        className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="flex-1">{doc.nomeAtribuido}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => abrirEdicao(idx)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          ✎
                        </button>
                        <button
                          onClick={() => setConfirmandoExclusaoIndex(idx)}
                          className="text-red-600 hover:text-red-800"
                        >
                          🗑️
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          {confirmandoExclusaoIndex !== null && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg">
                <p className="mb-4">Tem certeza que deseja remover este documento?</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRemoveFile(confirmandoExclusaoIndex)}
                    className="px-4 py-2 bg-red-500 text-white rounded"
                  >
                    Sim, remover
                  </button>
                  <button
                    onClick={() => setConfirmandoExclusaoIndex(null)}
                    className="px-4 py-2 bg-gray-300 rounded"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setStep(5)}
              className="w-1/2 bg-gray-200 text-[#1A243F] font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-all"
            >
              Anterior
            </button>
            <button
              onClick={() => setStep(7)}
              className="w-1/2 bg-yellow text-[#1A243F] font-bold py-3 px-6 rounded-lg"
            >
              Próximo
            </button>
          </div>
        </>
      );

    case 7: // Problema
      return (
        <>
          <p className="text-center text-[#CA9D14] mb-8">
            Descreva brevemente seu problema ou necessidade
          </p>
          <textarea
            value={problema}
            onChange={(e) => setProblemaLocal(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ECC440]"
            placeholder="Descreva seu problema..."
            rows={4}
          />
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setStep(6)}
              className="w-1/2 bg-gray-200 text-[#1A243F] font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-all"
            >
              Anterior
            </button>
            <button
              onClick={() => setStep(8)}
              className="w-1/2 bg-yellow text-[#1A243F] font-bold py-3 px-6 rounded-lg"
            >
              Próximo
            </button>
          </div>
        </>
      );

    case 8: // Finalização
      return (
        <>
          <p className="text-center text-[#CA9D14] mb-8">
            Obrigado! Seus dados foram registrados com sucesso.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h4 className="font-bold mb-2">Resumo dos dados:</h4>
            <p><strong>Nome:</strong> {nome}</p>
            <p><strong>CPF:</strong> {cpf}</p>
            <p><strong>Data de Nascimento:</strong> {dataNascimento}</p>
            <p><strong>Documentos:</strong> {documentosLocais.length} arquivo(s)</p>
            {problema && <p><strong>Problema:</strong> {problema}</p>}
          </div>
          <button
            onClick={handleSubmit}
            className="w-full bg-yellow text-[#1A243F] font-bold py-3 px-6 rounded-lg"
          >
            Finalizar Cadastro
          </button>
        </>
      );

    default:
      return null;
  }
}

