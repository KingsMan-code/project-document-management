"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { PDFDocument } from "pdf-lib";
import Header from "../../src/components/Header";
import Footer from "../../src/components/Footer";
import Spinner from "../../src/components/Spinner";
import { formatCpfCnpj, isValidCPF } from "../../src/utils/validation";
import { setDadosPF } from "../../store/clienteSlice";

interface DocumentoLocal {
  file: File;
  nomeAtribuido: string;
}

export default function ClienteNovoProcesso() {
  const router = useRouter();
  const dispatch = useDispatch();

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const CONTRATO_API_URL = process.env.NEXT_PUBLIC_CONTRATO_API_URL;

  const [currentStep, setCurrentStep] = useState(1);

  const [nome, setNome] = useState("");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [cpfCnpjRaw, setCpfCnpjRaw] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");

  const [documentosLocais, setDocumentosLocais] = useState<DocumentoLocal[]>([]);
  const [documentosContrato, setDocumentosContrato] = useState<DocumentoLocal[]>([]);

  const [editandoIndex, setEditandoIndex] = useState<number | null>(null);
  const [novoNomeDocumento, setNovoNomeDocumento] = useState("");
  const [editandoCategoria, setEditandoCategoria] = useState<"geral" | "contrato" | null>(null);

  const [nomeTouched, setNomeTouched] = useState(false);
  const [cpfTouched, setCpfTouched] = useState(false);
  const [telefoneTouched, setTelefoneTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [fileTypeError, setFileTypeError] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const TOTAL_STEPS = 3;
  const effectiveStep = Math.min(currentStep, TOTAL_STEPS);
  const progressPercent = (effectiveStep / TOTAL_STEPS) * 100;

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const onlyDigits = value.replace(/\D/g, "");
    setCpfCnpjRaw(onlyDigits);
    setCpfCnpj(formatCpfCnpj(value));
  };

  const isValidDocument = () => isValidCPF(cpfCnpjRaw);
  const isValidTelefone = () => telefone.replace(/\D/g, "").length >= 10;
  const isValidEmail = () => /\S+@\S+\.\S+/.test(email);

  const converterImagemParaPDF = async (file: File): Promise<File | null> => {
    try {
      const pdfDoc = await PDFDocument.create();
      const imageBytes = await file.arrayBuffer();

      let embeddedImage;
      if (file.type === "image/jpeg" || file.type === "image/jpg") {
        embeddedImage = await pdfDoc.embedJpg(imageBytes);
      } else if (file.type === "image/png") {
        embeddedImage = await pdfDoc.embedPng(imageBytes);
      } else {
        return null;
      }

      const page = pdfDoc.addPage([embeddedImage.width, embeddedImage.height]);
      page.drawImage(embeddedImage, {
        x: 0,
        y: 0,
        width: embeddedImage.width,
        height: embeddedImage.height,
      });

      const pdfBytes = await pdfDoc.save();
      const arrayBuffer = pdfBytes.buffer.slice(
        pdfBytes.byteOffset,
        pdfBytes.byteOffset + pdfBytes.byteLength
      ) as ArrayBuffer;
      const pdfBlob = new Blob([arrayBuffer], { type: "application/pdf" });
      const newFile = new File(
        [pdfBlob],
        file.name.replace(/\.[^.]+$/, ".pdf"),
        { type: "application/pdf" }
      );

      return newFile;
    } catch (err) {
      console.error("Erro ao converter imagem em PDF:", err);
      return null;
    }
  };

  const handleDocumentUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setDocumentos: React.Dispatch<React.SetStateAction<DocumentoLocal[]>>,
    categoria: "geral" | "contrato"
  ) => {
    if (!e.target.files) return;
    const novosArquivos = Array.from(e.target.files);
    const novosDocumentosLocais: DocumentoLocal[] = [];
    let encontrouTipoInvalido = false;

    for (const file of novosArquivos) {
      const tipo = file.type;

      if (tipo.startsWith("image/")) {
        const pdfConvertido = await converterImagemParaPDF(file);
        if (pdfConvertido) {
          novosDocumentosLocais.push({
            file: pdfConvertido,
            nomeAtribuido: pdfConvertido.name,
          });
        }
      } else if (tipo === "application/pdf") {
        novosDocumentosLocais.push({
          file,
          nomeAtribuido: file.name,
        });
      } else {
        encontrouTipoInvalido = true;
      }
    }

    const ultimoArquivo = novosArquivos[novosArquivos.length - 1];
    const ultimoTipo = ultimoArquivo?.type || "";
    if (ultimoTipo.startsWith("image/") || ultimoTipo === "application/pdf") {
      setFileTypeError(false);
    } else if (encontrouTipoInvalido) {
      setFileTypeError(true);
    }

    setDocumentos((prev) => [...prev, ...novosDocumentosLocais]);
    setEditandoCategoria(categoria);
  };

  const handleRemoveFile = (
    index: number,
    setDocumentos: React.Dispatch<React.SetStateAction<DocumentoLocal[]>>
  ) => {
    setDocumentos((prev) => prev.filter((_, idx) => idx !== index));
  };

  const abrirEdicao = (
    idx: number,
    nomeAtual: string,
    categoria: "geral" | "contrato"
  ) => {
    setEditandoIndex(idx);
    setNovoNomeDocumento(nomeAtual);
    setEditandoCategoria(categoria);
  };

  const salvarEdicao = () => {
    if (editandoIndex === null || !editandoCategoria) return;

    const setDocumentos =
      editandoCategoria === "geral"
        ? setDocumentosLocais
        : setDocumentosContrato;

    setDocumentos((prev) => {
      const atualizados = [...prev];
      atualizados[editandoIndex].nomeAtribuido = novoNomeDocumento;
      return atualizados;
    });

    setEditandoIndex(null);
    setNovoNomeDocumento("");
    setEditandoCategoria(null);
  };

  const enviarContratos = async () => {
    if (documentosContrato.length === 0) return;

    const contratoFormData = new FormData();
    contratoFormData.append("nome", nome);
    contratoFormData.append("cpf", cpfCnpj);
    contratoFormData.append("telefone", telefone);
    contratoFormData.append("email", email);

    documentosContrato.forEach((doc) => {
      contratoFormData.append("file", doc.file, doc.nomeAtribuido);
    });

    const endpoint = CONTRATO_API_URL || (API_URL ? `${API_URL}/contrato` : null);

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
    formdata.append("owner", nome);

    documentosLocais.forEach((doc) => {
      formdata.append("file", doc.file, doc.nomeAtribuido);
    });

    setLoading(true);
    setErrorMessage(null);

    setTimeout(() => {
      dispatch(
        setDadosPF({
          nome,
          cpf: cpfCnpjRaw,
          telefone,
          email,
        })
      );
      setCurrentStep(4);
      setLoading(false);
    }, 3000);

    if (API_URL) {
      try {
        await fetch(`${API_URL}/upload`, {
          method: "POST",
          body: formdata,
        });
      } catch (error: any) {
        console.log("error", error);
      }
    } else {
      console.warn("API_URL não configurada para envio de documentos gerais.");
    }

    await enviarContratos();
  };

  const renderDocumentList = (
    documentos: DocumentoLocal[],
    categoria: "geral" | "contrato",
    setDocumentos: React.Dispatch<React.SetStateAction<DocumentoLocal[]>>
  ) => (
    documentos.length > 0 && (
      <div>
        <h4 className="font-bold mb-2">Documentos adicionados:</h4>
        {documentos.map((doc, idx) => (
          <div
            key={`${categoria}-${idx}`}
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
                    setEditandoCategoria(null);
                  }}
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
    )
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#1A243F]">
      {loading && <Spinner />}
      <Header />
      <main className="flex-1 px-4 py-8 flex items-center justify-center">
        <div className="bg-white text-[#1A243F] rounded-2xl shadow-lg p-10 max-w-xl w-full relative border-l-8 border-[#ECC440]">
          {currentStep === 1 && (
            <>
              <h1 className="text-3xl font-bold text-center mb-6">Dados Pessoais</h1>
              <p className="text-center text-[#CA9D14] mb-8">Informe seus dados para prosseguir</p>
              <div className="space-y-6">
                <div>
                  <label htmlFor="nome" className="block text-sm font-bold uppercase text-[#CA9D14] mb-2">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    id="nome"
                    placeholder="Digite seu nome completo"
                    value={nome}
                    onChange={(e) => {
                      setNome(e.target.value);
                      if (e.target.value.trim().split(" ").length >= 2) setNomeTouched(true);
                    }}
                    onBlur={() => setNomeTouched(true)}
                    className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ECC440] transition-all"
                  />
                  {nomeTouched && nome.trim().split(" ").length < 2 && (
                    <p className="text-red-600 text-sm mt-1">Digite seu nome completo</p>
                  )}
                </div>

                <div>
                  <label htmlFor="cpfCnpj" className="block text-sm font-bold uppercase text-[#CA9D14] mb-2">
                    CPF
                  </label>
                  <input
                    type="text"
                    id="cpfCnpj"
                    placeholder="Digite o CPF"
                    value={cpfCnpj}
                    onChange={(e) => {
                      handleCpfChange(e);
                      if (isValidCPF(e.target.value.replace(/\D/g, ""))) setCpfTouched(true);
                    }}
                    onBlur={() => setCpfTouched(true)}
                    maxLength={14}
                    className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ECC440] transition-all"
                  />
                  {cpfTouched && !isValidDocument() && <p className="text-red-600 text-sm mt-1">CPF inválido</p>}
                </div>

                <div>
                  <label htmlFor="telefone" className="block text-sm font-bold uppercase text-[#CA9D14] mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    id="telefone"
                    placeholder="Digite o telefone"
                    value={telefone}
                    onChange={(e) => {
                      setTelefone(e.target.value);
                      if (e.target.value.replace(/\D/g, "").length >= 10) setTelefoneTouched(true);
                    }}
                    onBlur={() => setTelefoneTouched(true)}
                    className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ECC440] transition-all"
                  />
                  {telefoneTouched && !isValidTelefone() && <p className="text-red-600 text-sm mt-1">Telefone inválido</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-bold uppercase text-[#CA9D14] mb-2">
                    E-mail
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Digite o e-mail"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (/\S+@\S+\.\S+/.test(e.target.value)) setEmailTouched(true);
                    }}
                    onBlur={() => setEmailTouched(true)}
                    className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ECC440] transition-all"
                  />
                  {emailTouched && !isValidEmail() && <p className="text-red-600 text-sm mt-1">E-mail inválido</p>}
                </div>
              </div>
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setCurrentStep(2)}
                  disabled={!(nomeTouched && nome.trim().split(" ").length >= 2 && cpfTouched && isValidDocument() && telefoneTouched && isValidTelefone() && emailTouched && isValidEmail())}
                  className={`w-1/2 font-bold py-3 px-6 rounded-lg transition-all ${
                    !(nomeTouched && nome.trim().split(" ").length >= 2 && cpfTouched && isValidDocument() && telefoneTouched && isValidTelefone() && emailTouched && isValidEmail())
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-yellow text-[#1A243F] hover:bg-[#D4B91A]"
                  }`}
                >
                  Próximo
                </button>
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              <h1 className="text-3xl font-bold text-center mb-6">Documentos</h1>
              <p className="text-center text-[#CA9D14] mb-8">Envie os documentos do processo</p>

              {fileTypeError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                  <strong className="font-bold">Atenção! </strong>
                  <span className="block sm:inline">Só é permitido enviar imagens ou arquivos PDF.</span>
                  <span className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer" onClick={() => setFileTypeError(false)}>
                    <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <title>Fechar</title>
                      <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                    </svg>
                  </span>
                </div>
              )}

              <div className="space-y-6">
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  multiple
                  onChange={(e) => handleDocumentUpload(e, setDocumentosLocais, "geral")}
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ECC440]"
                />
                {renderDocumentList(documentosLocais, "geral", setDocumentosLocais)}
              </div>

              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="w-1/2 bg-gray-200 text-[#1A243F] font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-all"
                >
                  Anterior
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  disabled={documentosLocais.length === 0}
                  className={`w-1/2 font-bold py-3 px-6 rounded-lg transition-all ${
                    documentosLocais.length === 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-yellow text-[#1A243F] hover:bg-[#D4B91A]"
                  }`}
                >
                  Próximo
                </button>
              </div>
            </>
          )}

          {currentStep === 3 && (
            <>
              <h1 className="text-3xl font-bold text-center mb-6">Contrato</h1>
              <p className="text-center text-[#CA9D14] mb-8">Envie o contrato referente ao processo</p>

              {fileTypeError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                  <strong className="font-bold">Atenção! </strong>
                  <span className="block sm:inline">Só é permitido enviar imagens ou arquivos PDF.</span>
                  <span className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer" onClick={() => setFileTypeError(false)}>
                    <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <title>Fechar</title>
                      <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                    </svg>
                  </span>
                </div>
              )}

              <div className="space-y-6">
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  multiple
                  onChange={(e) => handleDocumentUpload(e, setDocumentosContrato, "contrato")}
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ECC440]"
                />
                {renderDocumentList(documentosContrato, "contrato", setDocumentosContrato)}
              </div>

              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => setCurrentStep(2)}
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

          {currentStep === 4 && (
            <>
              <h1 className="text-3xl font-bold text-center mb-6">Obrigado!</h1>
              <p className="text-center text-[#CA9D14] mb-8">Seus dados foram registrados com sucesso.</p>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h4 className="font-bold mb-2">Resumo dos dados:</h4>
                <p>
                  <strong>Nome:</strong> {nome}
                </p>
                <p>
                  <strong>CPF:</strong> {cpfCnpj}
                </p>
                <p>
                  <strong>Telefone:</strong> {telefone}
                </p>
                <p>
                  <strong>Email:</strong> {email}
                </p>
                <p>
                  <strong>Documentos:</strong> {documentosLocais.length} arquivo(s)
                </p>
                <p>
                  <strong>Contratos:</strong> {documentosContrato.length} arquivo(s)
                </p>
              </div>
              <div className="flex justify-center">
                <button
                  onClick={() => router.push("/")}
                  className="w-1/2 bg-yellow text-[#1A243F] font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-all"
                >
                  Voltar ao Início
                </button>
              </div>
            </>
          )}

          {currentStep === 5 && (
            <>
              <h1 className="text-3xl font-bold text-center mb-6 text-red-600">Serviço indisponível</h1>
              <p className="text-center text-[#CA9D14] mb-8">Contate o escritório informando o erro abaixo.</p>
              {errorMessage && <p className="text-center text-red-600 mb-8">{errorMessage}</p>}
              <div className="flex justify-center">
                <button
                  onClick={() => router.push("/")}
                  className="w-1/2 bg-yellow text-[#1A243F] font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-all"
                >
                  Voltar ao Início
                </button>
              </div>
            </>
          )}

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
