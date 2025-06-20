// src/components/FluxoCNPJ.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setDadosPJ, setSocios, adicionarSocio, removerSocio, atualizarSocio, adicionarDocumento, setProblema } from "../../store/clienteSlice";
import { RootState } from "../../store/store";
import { formatCpfCnpj, isValidCNPJ, isValidCPF, isValidDate } from "../utils/validation";

interface FluxoCNPJProps {
  currentStep: number;
  setStep: (step: number) => void;
}

interface DocumentoLocal {
  file: File;
  nomeAtribuido: string;
}

interface Socio {
  nome: string;
  cpf: string;
  dataNascimento: string;
}

export default function FluxoCNPJ({ currentStep, setStep }: FluxoCNPJProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const clienteState = useSelector((state: RootState) => state.cliente);

  // Estados locais para o formulário de PJ
  const [nomeEmpresa, setNomeEmpresa] = useState(clienteState.nomeEmpresa);
  const [cnpj, setCnpj] = useState(formatCpfCnpj(clienteState.cnpj));
  const [cnpjRaw, setCnpjRaw] = useState(clienteState.cnpj);
  const [dataCriacaoEmpresa, setDataCriacaoEmpresa] = useState(clienteState.dataCriacaoEmpresa);
  const [sociosLocais, setSociosLocais] = useState<Socio[]>(clienteState.socios);
  const [documentosLocais, setDocumentosLocais] = useState<DocumentoLocal[]>([]);
  const [problema, setProblemaLocal] = useState(clienteState.problema);

  // Estados para gerenciamento de sócios
  const [novoSocio, setNovoSocio] = useState<Socio>({ nome: "", cpf: "", dataNascimento: "" });
  const [editandoSocioIndex, setEditandoSocioIndex] = useState<number | null>(null);
  const [confirmandoExclusaoSocioIndex, setConfirmandoExclusaoSocioIndex] = useState<number | null>(null);

  // Estados para documentos
  const [editandoDocIndex, setEditandoDocIndex] = useState<number | null>(null);
  const [novoNomeDocumento, setNovoNomeDocumento] = useState("");
  const [confirmandoExclusaoDocIndex, setConfirmandoExclusaoDocIndex] = useState<number | null>(null);

  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const onlyDigits = value.replace(/\D/g, "");
    setCnpjRaw(onlyDigits);
    setCnpj(formatCpfCnpj(value));
  };

  const handleSocioCpfChange = (value: string) => {
    const onlyDigits = value.replace(/\D/g, "");
    setNovoSocio(prev => ({ ...prev, cpf: onlyDigits }));
  };

  const adicionarNovoSocio = () => {
    if (novoSocio.nome && isValidCPF(novoSocio.cpf) && isValidDate(novoSocio.dataNascimento)) {
      setSociosLocais(prev => [...prev, novoSocio]);
      setNovoSocio({ nome: "", cpf: "", dataNascimento: "" });
    }
  };

  const removerSocioLocal = (index: number) => {
    setSociosLocais(prev => prev.filter((_, idx) => idx !== index));
    setConfirmandoExclusaoSocioIndex(null);
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
    setConfirmandoExclusaoDocIndex(null);
  };

  const abrirEdicaoDoc = (idx: number) => {
    setEditandoDocIndex(idx);
    setNovoNomeDocumento(documentosLocais[idx].nomeAtribuido);
  };

  const salvarEdicaoDoc = () => {
    if (editandoDocIndex !== null) {
      const atualizados = [...documentosLocais];
      atualizados[editandoDocIndex].nomeAtribuido = novoNomeDocumento;
      setDocumentosLocais(atualizados);
      setEditandoDocIndex(null);
      setNovoNomeDocumento("");
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Dispatch dos dados para o Redux
    dispatch(setDadosPJ({ nomeEmpresa, cnpj: cnpjRaw, dataCriacaoEmpresa }));
    dispatch(setSocios(sociosLocais));
    dispatch(setProblema(problema));

    // Dispatch dos documentos
    documentosLocais.forEach(doc => {
      dispatch(adicionarDocumento({ nome: doc.nomeAtribuido, arquivos: [doc.file] }));
    });

    // Log para verificação
    console.log({
      tipo: 'pj',
      nomeEmpresa,
      cnpj: cnpjRaw,
      dataCriacaoEmpresa,
      socios: sociosLocais,
      documentos: documentosLocais.map(d => ({ name: d.nomeAtribuido, size: d.file.size })),
      problema,
    });

    // Move para o próximo passo ou completa
    if (currentStep === 9) {
      router.push("/");
    } else {
      setStep(currentStep + 1);
    }
  };

  // Renderização baseada no step atual
  switch (currentStep) {
    case 3: // Nome da Empresa
      return (
        <>
          <p className="text-center text-[#CA9D14] mb-8">
            Qual o nome da sua empresa?
          </p>
          <input
            type="text"
            value={nomeEmpresa}
            onChange={(e) => setNomeEmpresa(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ECC440]"
            placeholder="Nome da empresa"
            required
          />
          {!nomeEmpresa.trim() && (
            <p className="text-red-600 text-sm mt-2">
              Preencha o nome da empresa para continuar.
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
              onClick={() => nomeEmpresa.trim() && setStep(4)}
              className="w-1/2 bg-yellow text-[#1A243F] font-bold py-3 px-6 rounded-lg"
              disabled={!nomeEmpresa.trim()}
            >
              Próximo
            </button>
          </div>
        </>
      );

    case 4: // CNPJ
      return (
        <>
          <p className="text-center text-[#CA9D14] mb-8">Qual o CNPJ da empresa?</p>
          <input
            type="text"
            value={cnpj}
            onChange={handleCnpjChange}
            className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ECC440]"
            placeholder="Digite o CNPJ"
            required
            maxLength={18}
          />
          {!isValidCNPJ(cnpjRaw) && (
            <p className="text-red-600 text-sm mt-2">
              Digite um CNPJ válido para continuar.
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
              onClick={() => isValidCNPJ(cnpjRaw) && setStep(5)}
              className="w-1/2 bg-yellow text-[#1A243F] font-bold py-3 px-6 rounded-lg"
              disabled={!isValidCNPJ(cnpjRaw)}
            >
              Próximo
            </button>
          </div>
        </>
      );

    case 5: // Data de Criação da Empresa
      return (
        <>
          <p className="text-center text-[#CA9D14] mb-8">
            Qual a data de criação da empresa?
          </p>
          <input
            type="date"
            value={dataCriacaoEmpresa}
            onChange={(e) => setDataCriacaoEmpresa(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ECC440]"
            required
          />
          {!isValidDate(dataCriacaoEmpresa) && (
            <p className="text-red-600 text-sm mt-2">
              Informe uma data válida para continuar.
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
              onClick={() => isValidDate(dataCriacaoEmpresa) && setStep(6)}
              className="w-1/2 bg-yellow text-[#1A243F] font-bold py-3 px-6 rounded-lg"
              disabled={!isValidDate(dataCriacaoEmpresa)}
            >
              Próximo
            </button>
          </div>
        </>
      );

    case 6: // Sócios
      return (
        <>
          <p className="text-center text-[#CA9D14] mb-8">
            Adicione os sócios da empresa
          </p>
          
          {/* Formulário para adicionar novo sócio */}
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h4 className="font-bold mb-3">Adicionar Sócio</h4>
            <div className="space-y-3">
              <input
                type="text"
                value={novoSocio.nome}
                onChange={(e) => setNovoSocio(prev => ({ ...prev, nome: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Nome do sócio"
              />
              <input
                type="text"
                value={formatCpfCnpj(novoSocio.cpf)}
                onChange={(e) => handleSocioCpfChange(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="CPF do sócio"
                maxLength={14}
              />
              <input
                type="date"
                value={novoSocio.dataNascimento}
                onChange={(e) => setNovoSocio(prev => ({ ...prev, dataNascimento: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <button
                onClick={adicionarNovoSocio}
                disabled={!novoSocio.nome || !isValidCPF(novoSocio.cpf) || !isValidDate(novoSocio.dataNascimento)}
                className="w-full bg-blue-500 text-white py-2 rounded-lg disabled:bg-gray-300"
              >
                Adicionar Sócio
              </button>
            </div>
          </div>

          {/* Lista de sócios */}
          {sociosLocais.length > 0 && (
            <div className="mb-4">
              <h4 className="font-bold mb-2">Sócios adicionados:</h4>
              {sociosLocais.map((socio, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded mb-2">
                  <div>
                    <p className="font-medium">{socio.nome}</p>
                    <p className="text-sm text-gray-600">CPF: {formatCpfCnpj(socio.cpf)}</p>
                    <p className="text-sm text-gray-600">Nascimento: {socio.dataNascimento}</p>
                  </div>
                  <button
                    onClick={() => setConfirmandoExclusaoSocioIndex(idx)}
                    className="text-red-600 hover:text-red-800"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}

          {confirmandoExclusaoSocioIndex !== null && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg">
                <p className="mb-4">Tem certeza que deseja remover este sócio?</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => removerSocioLocal(confirmandoExclusaoSocioIndex)}
                    className="px-4 py-2 bg-red-500 text-white rounded"
                  >
                    Sim, remover
                  </button>
                  <button
                    onClick={() => setConfirmandoExclusaoSocioIndex(null)}
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

    case 7: // Upload de Documentos
      return (
        <>
          <p className="text-center text-[#CA9D14] mb-8">
            Envie os documentos da empresa
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
                  {editandoDocIndex === idx ? (
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={novoNomeDocumento}
                        onChange={(e) => setNovoNomeDocumento(e.target.value)}
                        className="flex-1 px-2 py-1 border rounded"
                      />
                      <button
                        onClick={salvarEdicaoDoc}
                        className="px-3 py-1 bg-green-500 text-white rounded text-sm"
                      >
                        Salvar
                      </button>
                      <button
                        onClick={() => setEditandoDocIndex(null)}
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
                          onClick={() => abrirEdicaoDoc(idx)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          ✎
                        </button>
                        <button
                          onClick={() => setConfirmandoExclusaoDocIndex(idx)}
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

          {confirmandoExclusaoDocIndex !== null && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg">
                <p className="mb-4">Tem certeza que deseja remover este documento?</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRemoveFile(confirmandoExclusaoDocIndex)}
                    className="px-4 py-2 bg-red-500 text-white rounded"
                  >
                    Sim, remover
                  </button>
                  <button
                    onClick={() => setConfirmandoExclusaoDocIndex(null)}
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

    case 8: // Problema
      return (
        <>
          <p className="text-center text-[#CA9D14] mb-8">
            Descreva brevemente o problema ou necessidade da empresa
          </p>
          <textarea
            value={problema}
            onChange={(e) => setProblemaLocal(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ECC440]"
            placeholder="Descreva o problema da empresa..."
            rows={4}
          />
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setStep(7)}
              className="w-1/2 bg-gray-200 text-[#1A243F] font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-all"
            >
              Anterior
            </button>
            <button
              onClick={() => setStep(9)}
              className="w-1/2 bg-yellow text-[#1A243F] font-bold py-3 px-6 rounded-lg"
            >
              Próximo
            </button>
          </div>
        </>
      );

    case 9: // Finalização
      return (
        <>
          <p className="text-center text-[#CA9D14] mb-8">
            Obrigado! Os dados da empresa foram registrados com sucesso.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h4 className="font-bold mb-2">Resumo dos dados:</h4>
            <p><strong>Empresa:</strong> {nomeEmpresa}</p>
            <p><strong>CNPJ:</strong> {cnpj}</p>
            <p><strong>Data de Criação:</strong> {dataCriacaoEmpresa}</p>
            <p><strong>Sócios:</strong> {sociosLocais.length} sócio(s)</p>
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

