"use client";

import { useRouter } from "next/navigation";
import Header from "../../src/components/Header";
import Footer from "../../src/components/Footer";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setDadosPF } from "../../store/clienteSlice";
import { formatCpfCnpj, isValidCPF } from "../../src/utils/validation";
import { PDFDocument } from "pdf-lib";
import Spinner from "../../src/components/Spinner";

interface DocumentoLocal {
  file: File;
  nomeAtribuido: string;
}

export default function Cliente() {
  const router = useRouter();
  const dispatch = useDispatch();

  // Controle de seções
  const [currentStep, setCurrentStep] = useState(2);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  console.log("API URL:", API_URL);

  // Estados do formulário
  const [nome, setNome] = useState("");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [cpfCnpjRaw, setCpfCnpjRaw] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [documentosLocais, setDocumentosLocais] = useState<DocumentoLocal[]>(
    []
  );

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Estados para edição de documentos
  const [editandoIndex, setEditandoIndex] = useState<number | null>(null);
  const [novoNomeDocumento, setNovoNomeDocumento] = useState("");

  // Controle de interação com campos
  const [nomeTouched, setNomeTouched] = useState(false);
  const [cpfTouched, setCpfTouched] = useState(false);
  const [telefoneTouched, setTelefoneTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [fileTypeError, setFileTypeError] = useState(false);

  const handleCpfCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const onlyDigits = value.replace(/\D/g, "");
    setCpfCnpjRaw(onlyDigits);
    setCpfCnpj(formatCpfCnpj(value));
  };

  const isValidDocument = () => {
    return isValidCPF(cpfCnpjRaw);
  };

  const isValidTelefone = () => {
    return telefone.replace(/\D/g, "").length >= 10;
  };

  const isValidEmail = () => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleRemoveFile = (index: number) => {
    setDocumentosLocais((prev) => prev.filter((_, idx) => idx !== index));
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

  const handleFinalSubmit = async () => {
    const clienteComDocumentos = {
      nome: nome,
      cpf: cpfCnpjRaw,
      documentos: documentosLocais.map((doc) => ({
        nome: doc.nomeAtribuido,
        file: doc.file,
      })),
    };

    const formdata = new FormData();
    formdata.append("owner", nome);
    for (const doc of clienteComDocumentos.documentos) {
      formdata.append("file", doc.file, doc.nome);
    }

    setLoading(true);
    setErrorMessage(null);

    // Avança para o passo de sucesso após 3 segundos,
    // independentemente do resultado da requisição
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

    try {
      await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formdata,
      });
    } catch (error: any) {
      console.log("error", error);
      // Erros são apenas registrados no console
    }
  };

  const handleDocumentUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files) return;
    const novosArquivos = Array.from(e.target.files);
    const novosDocumentosLocais: DocumentoLocal[] = [];
    let encontrouTipoInvalido = false;

    for (const file of novosArquivos) {
      const tipo = file.type;

      if (tipo.startsWith("image/")) {
        try {
          const pdfDoc = await PDFDocument.create();
          const imageBytes = await file.arrayBuffer();

          let embeddedImage;
          if (tipo === "image/jpeg" || tipo === "image/jpg") {
            embeddedImage = await pdfDoc.embedJpg(imageBytes);
          } else if (tipo === "image/png") {
            embeddedImage = await pdfDoc.embedPng(imageBytes);
          } else {
            // Não mostra o alerta para formatos de imagem não suportados
            continue;
          }

          const page = pdfDoc.addPage([
            embeddedImage.width,
            embeddedImage.height,
          ]);
          page.drawImage(embeddedImage, {
            x: 0,
            y: 0,
            width: embeddedImage.width,
            height: embeddedImage.height,
          });

          const pdfBytes = await pdfDoc.save();
          const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
          const newFile = new File(
            [pdfBlob],
            file.name.replace(/\.[^.]+$/, ".pdf"),
            {
              type: "application/pdf",
            }
          );

          novosDocumentosLocais.push({
            file: newFile,
            nomeAtribuido: newFile.name,
          });
        } catch (err) {
          console.error("Erro ao converter imagem em PDF:", err);
        }
      } else if (tipo === "application/pdf") {
        novosDocumentosLocais.push({
          file,
          nomeAtribuido: file.name,
        });
      } else {
        encontrouTipoInvalido = true;
        // Se o último arquivo for inválido, mostra o alerta
        // Se houver arquivos válidos depois, o alerta será removido abaixo
      }
    }

    // Se o último arquivo enviado for válido, some o alerta
    const ultimoArquivo = novosArquivos[novosArquivos.length - 1];
    const ultimoTipo = ultimoArquivo?.type || "";
    if (ultimoTipo.startsWith("image/") || ultimoTipo === "application/pdf") {
      setFileTypeError(false);
    } else if (encontrouTipoInvalido) {
      setFileTypeError(true);
    }

    setDocumentosLocais((prev) => [...prev, ...novosDocumentosLocais]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#1A243F]">
      {loading && <Spinner />}
      <Header />
      <main className="flex-1 px-4 py-8 flex items-center justify-center">
        <div className="bg-white text-[#1A243F] rounded-2xl shadow-lg p-10 max-w-xl w-full relative border-l-8 border-[#ECC440]">
          {/* SEÇÃO 2 */}
          {currentStep === 2 && (
            <>
              <h1 className="text-3xl font-bold text-center mb-6">
                Dados Pessoais
              </h1>
              <p className="text-center text-[#CA9D14] mb-8">
                Informe seus dados para prosseguir
              </p>
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="nome"
                    className="block text-sm font-bold uppercase text-[#CA9D14] mb-2"
                  >
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    id="nome"
                    placeholder="Digite seu nome completo "
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

                <div>
                  <label
                    htmlFor="cpfCnpj"
                    className="block text-sm font-bold uppercase text-[#CA9D14] mb-2"
                  >
                    CPF
                  </label>
                  <input
                    type="text"
                    id="cpfCnpj"
                    placeholder="Digite o CPF"
                    value={cpfCnpj}
                    onChange={(e) => {
                      handleCpfCnpjChange(e);
                      if (isValidCPF(e.target.value.replace(/\D/g, "")))
                        setCpfTouched(true);
                    }}
                    onBlur={() => setCpfTouched(true)}
                    maxLength={14}
                    className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ECC440] transition-all"
                  />
                  {cpfTouched && !isValidDocument() && (
                    <p className="text-red-600 text-sm mt-1">CPF inválido</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="telefone"
                    className="block text-sm font-bold uppercase text-[#CA9D14] mb-2"
                  >
                    Telefone
                  </label>
                  <input
                    type="tel"
                    id="telefone"
                    placeholder="Digite o telefone"
                    value={telefone}
                    onChange={(e) => {
                      setTelefone(e.target.value);
                      if (e.target.value.replace(/\D/g, "").length >= 10)
                        setTelefoneTouched(true);
                    }}
                    onBlur={() => setTelefoneTouched(true)}
                    className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ECC440] transition-all"
                  />
                  {telefoneTouched && !isValidTelefone() && (
                    <p className="text-red-600 text-sm mt-1">Telefone inválido</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-bold uppercase text-[#CA9D14] mb-2"
                  >
                    E-mail
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Digite o e-mail"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (/\S+@\S+\.\S+/.test(e.target.value))
                        setEmailTouched(true);
                    }}
                    onBlur={() => setEmailTouched(true)}
                    className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ECC440] transition-all"
                  />
                  {emailTouched && !isValidEmail() && (
                    <p className="text-red-600 text-sm mt-1">E-mail inválido</p>
                  )}
                </div>
              </div>
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setCurrentStep(3)}
                  disabled={
                    !(
                      nomeTouched &&
                      nome.trim().split(" ").length >= 2 &&
                      cpfTouched &&
                      isValidDocument() &&
                      telefoneTouched &&
                      isValidTelefone() &&
                      emailTouched &&
                      isValidEmail()
                    )
                  }
                  className={`w-1/2 font-bold py-3 px-6 rounded-lg transition-all ${
                    !(
                      nomeTouched &&
                      nome.trim().split(" ").length >= 2 &&
                      cpfTouched &&
                      isValidDocument() &&
                      telefoneTouched &&
                      isValidTelefone() &&
                      emailTouched &&
                      isValidEmail()
                    )
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-yellow text-[#1A243F] hover:bg-[#D4B91A]"
                  }`}
                >
                  Próximo
                </button>
              </div>
            </>
          )}

          {/* SEÇÃO 3 */}
          {currentStep === 3 && (
            <>
              <h1 className="text-3xl font-bold text-center mb-6">
                Documentos
              </h1>
              <p className="text-center text-[#CA9D14] mb-8">
                Envie seus documentos (opcional)
              </p>

              {/* ALERTA DE TIPO DE ARQUIVO */}
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

              <div className="space-y-6">
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  multiple
                  onChange={handleDocumentUpload}
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ECC440]"
                />
                {documentosLocais.length > 0 && (
                  <div>
                    <h4 className="font-bold mb-2">Documentos adicionados:</h4>
                    {documentosLocais.map((doc, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center p-2 bg-gray-50 rounded mb-2"
                      >
                        {editandoIndex === idx ? (
                          <div className="flex-1 flex gap-2">
                            <input
                              type="text"
                              value={novoNomeDocumento}
                              onChange={(e) =>
                                setNovoNomeDocumento(e.target.value)
                              }
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
                              <a
                                href={URL.createObjectURL(doc.file)}
                                download={doc.nomeAtribuido}
                                className="text-green-600 hover:text-green-800"
                              >
                                ⬇️
                              </a>
                              <button
                                onClick={() => handleRemoveFile(idx)}
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
              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="w-1/2 bg-gray-200 text-[#1A243F] font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-all"
                >
                  Anterior
                </button>
                <button
                  onClick={handleFinalSubmit}
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

          {/* SEÇÃO 4 */}
          {currentStep === 4 && (
            <>
              <h1 className="text-3xl font-bold text-center mb-6">Obrigado!</h1>
              <p className="text-center text-[#CA9D14] mb-8">
                Seus dados foram registrados com sucesso.
              </p>
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
                  <strong>Documentos:</strong> {documentosLocais.length}{" "}
                  arquivo(s)
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
              <h1 className="text-3xl font-bold text-center mb-6 text-red-600">
                Serviço indisponível
              </h1>
              <p className="text-center text-[#CA9D14] mb-8">
                Contate o escritório informando o erro abaixo.
              </p>
              {errorMessage && (
                <p className="text-center text-red-600 mb-8">{errorMessage}</p>
              )}
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

          {/* Indicador de progresso com apenas 2 etapas */}
          {(currentStep === 2 || currentStep === 3) && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>Progresso</span>
                <span>{currentStep === 2 ? "1/2" : "2/2"}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${currentStep === 2 ? 50 : 100}%` }}
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
