"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../src/components/Header";
import Footer from "../../src/components/Footer";

import { useDispatch } from "react-redux";
import { setDadosPF } from "../../store/clienteSlice";
import Spinner from "../../src/components/Spinner";
import {
  handleDocumentUploadHelper,
  UploadDocumentoLocal,
  formatFileSize,
} from "../../src/utils/upload";

type DocumentoLocal = UploadDocumentoLocal;

export default function NovoCliente() {
  const router = useRouter();
  const dispatch = useDispatch();

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const CONTRATO_API_URL = process.env.NEXT_PUBLIC_CONTRATO_API_URL;

  // Controle de steps
  const [currentStep, setCurrentStep] = useState(1);

  // Estados do formulário
  const [nome, setNome] = useState("");

  // Estados para documentos por categoria
  const [documentosIdentidade, setDocumentosIdentidade] = useState<DocumentoLocal[]>([]);
  const [documentosResidencia, setDocumentosResidencia] = useState<DocumentoLocal[]>([]);
  const [documentosProcuracao, setDocumentosProcuracao] = useState<DocumentoLocal[]>([]);
  const [documentosContrato, setDocumentosContrato] = useState<DocumentoLocal[]>([]);

  // Estados para edição de documentos
  const [editandoIndex, setEditandoIndex] = useState<number | null>(null);
  const [novoNomeDocumento, setNovoNomeDocumento] = useState("");
  const [editandoCategoria, setEditandoCategoria] = useState<string>("");

  // Controle de interação com campos
  const [nomeTouched, setNomeTouched] = useState(false);
  const [fileTypeError, setFileTypeError] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const TOTAL_STEPS = 6;
  const effectiveStep = Math.min(currentStep, TOTAL_STEPS);
  const progressPercent = (effectiveStep / TOTAL_STEPS) * 100;



  const canAdvanceFromStep1 = () => {
    return nome.trim().split(" ").length >= 2;
  };

  const handleDocumentUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setDocumentos: React.Dispatch<React.SetStateAction<DocumentoLocal[]>>,
    categoria: string
  ) => {
    await handleDocumentUploadHelper({
      event: e,
      setDocumentos,
      setFileTypeError,
      setLoading,
      category: categoria,
    });
  };

  const handleRemoveFile = (
    index: number,
    setDocumentos: React.Dispatch<React.SetStateAction<DocumentoLocal[]>>
  ) => {
    setDocumentos((prev) => prev.filter((_, idx) => idx !== index));
  };

  const abrirEdicao = (idx: number, nomeAtual: string, categoria: string) => {
    setEditandoIndex(idx);
    setNovoNomeDocumento(nomeAtual);
    setEditandoCategoria(categoria);
  };

  const salvarEdicao = () => {
    if (editandoIndex !== null && editandoCategoria) {
      const setDocumentos =
        editandoCategoria === "identidade"
          ? setDocumentosIdentidade
          : editandoCategoria === "residencia"
          ? setDocumentosResidencia
          : editandoCategoria === "procuracao"
          ? setDocumentosProcuracao
          : setDocumentosContrato;

      setDocumentos((prev) => {
        const atualizados = [...prev];
        atualizados[editandoIndex].nomeAtribuido = novoNomeDocumento;
        return atualizados;
      });
      
      setEditandoIndex(null);
      setNovoNomeDocumento("");
      setEditandoCategoria("");
    }
  };

  const renderDocumentSection = (
    titulo: string,
    documentos: DocumentoLocal[],
    setDocumentos: React.Dispatch<React.SetStateAction<DocumentoLocal[]>>,
    categoria: string
  ) => (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-center ">{titulo}</h3>

      {fileTypeError && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Atenção! </strong>
          <span className="block sm:inline">
            Só é permitido enviar imagens ou arquivos PDF.
          </span>
          <span
            className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer"
            onClick={() => setFileTypeError(false)}
          >
            <svg
              className="fill-current h-6 w-6 text-red-500"
              role="button"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <title>Fechar</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
            </svg>
          </span>
        </div>
      )}

      <input
        type="file"
        accept="application/pdf,image/*"
        multiple
        onChange={(e) => handleDocumentUpload(e, setDocumentos, categoria)}
        className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-pointer hover:border-[#ECC440] focus:outline-none"
      />

      <p className="text-xs text-gray-500 text-center">
        Formatos aceitos: PDF, JPG, PNG. Tamanho máximo por arquivo: 10MB.
      </p>

      {documentos.length > 0 && (
        <div>
          <h4 className="font-bold mb-2">Documentos adicionados:</h4>
          {documentos.map((doc, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center p-2 bg-gray-50 rounded mb-2"
            >
              {editandoIndex === idx && editandoCategoria === categoria ? (
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
                    onClick={() => {
                      setEditandoIndex(null);
                      setEditandoCategoria("");
                    }}
                    className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <>
                  <span className="flex-1">
                    {doc.nomeAtribuido}
                    <span className="ml-2 text-xs text-gray-500">{formatFileSize(doc.file.size)}</span>
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => abrirEdicao(idx, doc.nomeAtribuido, categoria)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ✎
                    </button>
                    <a
                      href={URL.createObjectURL(doc.file)}
                      download={doc.nomeAtribuido}
                      className="text-green-600 hover:text-green-800"
                    >
                      ⬇️
                    </a>
                    <button
                      onClick={() => handleRemoveFile(idx, setDocumentos)}
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
    </div>
  );

  const enviarContratos = async () => {
    if (documentosContrato.length === 0) return;

    const contratoFormData = new FormData();
    contratoFormData.append("cliente", nome);

    documentosContrato.forEach((doc) => {
      contratoFormData.append("arquivo", doc.file, doc.nomeAtribuido);
    });

    const endpoint = CONTRATO_API_URL || (API_URL ? `${API_URL}/upload/documents/contract` : null);

    if (!endpoint) {
      console.warn("Endpoint de contrato não configurado.");
      return;
    }

    try {
      await fetch(endpoint, {
        method: "POST",
        body: contratoFormData,
      });
    } catch (error) {
      console.error("Erro ao enviar contrato:", error);
    }
  };

  const handleFinalSubmit = async () => {
    const formdata = new FormData();
    formdata.append("cliente", nome);

    [...documentosIdentidade, ...documentosResidencia, ...documentosProcuracao].forEach(
      (doc) => {
        formdata.append("arquivos", doc.file, doc.nomeAtribuido);
      }
    );

    setLoading(true);
    setErrorMessage(null);

    setTimeout(() => {
      dispatch(
        setDadosPF({
          nome,
        })
      );
      setCurrentStep(6);
      setLoading(false);
    }, 3000);

    if (API_URL) {
      console.log(FormData);
      try {
        await fetch(`${API_URL}/upload/documents`, {
          method: "POST",
            body: formdata,
        });
      } catch (error: any) {
        console.log("error", error);
        // Erros são apenas registrados no console
      }
    } else {
      console.warn("API_URL não configurada para envio de documentos gerais.");
    }

    await enviarContratos();
  };

  const getTotalDocumentos = () => {
    return (
      documentosIdentidade.length +
      documentosResidencia.length +
      documentosProcuracao.length +
      documentosContrato.length
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      {loading && <Spinner />}
      <Header />
      <main className="flex-1 px-3 py-6 flex items-center justify-center">
        <div className="bg-white text-[#1A243F] rounded-2xl shadow-xl p-8 max-w-lg w-full relative border-l-4 border-[#ECC440]">
          
          {/* STEP 1 - DADOS PESSOAIS */}
          {currentStep === 1 && (
            <>
              <h1 className="text-2xl font-bold text-center mb-5">
                Dados Pessoais
              </h1>
              <p className="text-center  mb-6">
                Informe seus dados para prosseguir
              </p>
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="nome"
                    className="block text-sm font-bold uppercase  mb-2"
                  >
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    id="nome"
                    placeholder="Digite seu nome completo"
                    value={nome}
                    onChange={(e) => {
                      setNome(e.target.value);
                      if (e.target.value.trim().split(" ").length >= 2)
                        setNomeTouched(true);
                    }}
                    onBlur={() => setNomeTouched(true)}
                    className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ECC440] transition-all"
                  />
                  {nomeTouched && nome.trim().split(" ").length < 2 && (
                    <p className="text-red-600 text-sm mt-1">
                      Digite seu nome completo
                    </p>
                  )}
                </div>
              </div>
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setCurrentStep(2)}
                  disabled={!(nomeTouched && nome.trim().split(" ").length >= 2)}
                  className={`w-1/2 font-bold py-3 px-6 rounded-lg transition-all ${
                    !(nomeTouched && nome.trim().split(" ").length >= 2)
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-yellow text-[#1A243F] hover:bg-[#D4B91A]"
                  }`}
                >
                  Próximo
                </button>
              </div>
            </>
          )}

          {/* STEP 2 - DOCUMENTOS DE IDENTIDADE */}
          {currentStep === 2 && (
            <>
              <h1 className="text-2xl font-bold text-center mb-5">
                Documentos de Identidade
              </h1>
              <p className="text-center  mb-6">
                Envie seus documentos de identidade
              </p>
              
              {renderDocumentSection(
                "RG, CNH ou Passaporte",
                documentosIdentidade,
                setDocumentosIdentidade,
                "identidade"
              )}

              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="w-1/2 bg-gray-200 text-[#1A243F] font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-all"
                >
                  Anterior
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  disabled={documentosIdentidade.length === 0}
                  className={`w-1/2 font-bold py-3 px-6 rounded-lg transition-all ${
                    documentosIdentidade.length === 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-yellow text-[#1A243F] hover:bg-[#D4B91A]"
                  }`}
                >
                  Próximo
                </button>
              </div>
            </>
          )}

          {/* STEP 3 - DOCUMENTOS DE RESIDÊNCIA */}
          {currentStep === 3 && (
            <>
              <h1 className="text-2xl font-bold text-center mb-5">
                Comprovante de Residência
              </h1>
              <p className="text-center  mb-6">
                Envie seu comprovante de residência
              </p>
              
              {renderDocumentSection(
                "Conta de luz, água, telefone ou extrato bancário",
                documentosResidencia,
                setDocumentosResidencia,
                "residencia"
              )}

              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="w-1/2 bg-gray-200 text-[#1A243F] font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-all"
                >
                  Anterior
                </button>
                <button
                  onClick={() => setCurrentStep(4)}
                  disabled={documentosResidencia.length === 0}
                  className={`w-1/2 font-bold py-3 px-6 rounded-lg transition-all ${
                    documentosResidencia.length === 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-yellow text-[#1A243F] hover:bg-[#D4B91A]"
                  }`}
                >
                  Próximo
                </button>
              </div>
            </>
          )}

          {/* STEP 4 - PROCURAÇÃO */}
          {currentStep === 4 && (
            <>
              <h1 className="text-2xl font-bold text-center mb-5">
                Procuração
              </h1>
              <p className="text-center  mb-6">
                Envie sua procuração (opcional)
              </p>
              
              {renderDocumentSection(
                "Procuração pública ou particular",
                documentosProcuracao,
                setDocumentosProcuracao,
                "procuracao"
              )}

              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="w-1/2 bg-gray-200 text-[#1A243F] font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-all"
                >
                  Anterior
                </button>
                <button
                  onClick={() => setCurrentStep(5)}
                  className="w-1/2 bg-yellow text-[#1A243F] font-bold py-3 px-6 rounded-lg hover:bg-[#D4B91A] transition-all"
                >
                  Próximo
                </button>
              </div>
            </>
          )}

          {/* STEP 5 - CONTRATO */}
          {currentStep === 5 && (
            <>
              <h1 className="text-2xl font-bold text-center mb-5">Contrato</h1>
              <p className="text-center  mb-6">
                Envie o contrato referente à prestação do serviço
              </p>

              {renderDocumentSection(
                "Contrato",
                documentosContrato,
                setDocumentosContrato,
                "contrato"
              )}

              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => setCurrentStep(4)}
                  className="w-1/2 bg-gray-200 text-[#1A243F] font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-all"
                >
                  Anterior
                </button>
                <button
                  onClick={handleFinalSubmit}
                  disabled={documentosContrato.length === 0}
                  className={`w-1/2 font-bold py-3 px-6 rounded-lg transition-all ${
                    documentosContrato.length === 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-yellow text-[#1A243F] hover:bg-[#D4B91A]"
                  }`}
                >
                  Finalizar
                </button>
              </div>
            </>
          )}

          {/* STEP 6 - CONFIRMAÇÃO */}
          {currentStep === 6 && (
            <>
              <h1 className="text-2xl font-bold text-center mb-5">Obrigado!</h1>
              <p className="text-center  mb-6">
                Seus dados foram registrados com sucesso.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h4 className="font-bold mb-2">Resumo dos dados:</h4>
                <p>
                  <strong>Nome:</strong> {nome}
                </p>

                <p>
                  <strong>Documentos de Identidade:</strong> {documentosIdentidade.length} arquivo(s)
                </p>
                <p>
                  <strong>Documentos de Residência:</strong> {documentosResidencia.length} arquivo(s)
                </p>
                <p>
                  <strong>Procurações:</strong> {documentosProcuracao.length} arquivo(s)
                </p>
                <p>
                  <strong>Contratos:</strong> {documentosContrato.length} arquivo(s)
                </p>
                <p>
                  <strong>Total de documentos:</strong> {getTotalDocumentos()} arquivo(s)
                </p>
              </div>
              <div className="flex justify-center">
                <button
                  onClick={() => router.push("/")}
                  className="w-1/2 bg-yellow text-[#1A243F] font-bold py-3 px-6 rounded-lg hover:bg-[#D4B91A] transition-all"
                >
                  Voltar ao Início
                </button>
              </div>
            </>
          )}

          {currentStep === 7 && (
            <>
              <h1 className="text-2xl font-bold text-center mb-5 text-red-600">Serviço indisponível</h1>
              <p className="text-center  mb-6">
                Contate o escritório informando o erro abaixo.
              </p>
              {errorMessage && (
                <p className="text-center text-red-600 mb-8">{errorMessage}</p>
              )}
              <div className="flex justify-center">
                <button
                  onClick={() => router.push("/")}
                  className="w-1/2 bg-yellow text-[#1A243F] font-bold py-3 px-6 rounded-lg hover:bg-[#D4B91A] transition-all"
                >
                  Voltar ao Início
                </button>
              </div>
            </>
          )}

          {/* Indicador de progresso */}
          {currentStep >= 1 && currentStep <= TOTAL_STEPS && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>Progresso</span>
                <span>{effectiveStep}/{TOTAL_STEPS}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
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

