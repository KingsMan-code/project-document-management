"use client";

import { useRouter } from "next/navigation";
import Header from "../../src/components/Header";
import Footer from "../../src/components/Footer";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setCliente, adicionarDocumento } from "../../store/clienteSlice";

function formatCpfCnpj(value: string) {
  const digits = value.replace(/\D/g, "");

  if (digits.length <= 11) {
    return digits
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1-$2")
      .slice(0, 14);
  } else {
    return digits
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .slice(0, 18);
  }
}

export default function NovoCliente() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [step, setStep] = useState(1);
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [cpfRaw, setCpfRaw] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [documentos, setDocumentos] = useState<File[]>([]);
  const [nomesAtribuidos, setNomesAtribuidos] = useState<string[]>([]);
  const [editandoIndex, setEditandoIndex] = useState<number | null>(null);
  const [novoNome, setNovoNome] = useState("");
  const [confirmandoExclusaoIndex, setConfirmandoExclusaoIndex] = useState<
    number | null
  >(null);
  const [problema, setProblema] = useState("");
  const [tipoCliente, setTipoCliente] = useState<"pf" | "pj" | null>(null);
  const [nomeEmpresa, setNomeEmpresa] = useState("");
  const [nomesProprietarios, setNomesProprietarios] = useState<string[]>([""]);
  const [cnpjEmpresa, setCnpjEmpresa] = useState("");
  const [cpfsProprietarios, setCpfsProprietarios] = useState<string[]>([""]);
  const [cpfsProprietariosDatas, setCpfsProprietariosDatas] = useState<string[]>([""]);

  // Step handlers
  const handleNomeChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setNome(e.target.value);
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const onlyDigits = value.replace(/\D/g, "");
    setCpfRaw(onlyDigits);
    setCpf(formatCpfCnpj(value));
  };
  const handleDataNascimentoChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setDataNascimento(e.target.value);
  const handleProblemaChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setProblema(e.target.value);

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const novosArquivos = Array.from(e.target.files);
      setDocumentos((prev) => [...prev, ...novosArquivos]);
      setNomesAtribuidos((prev) => [
        ...prev,
        ...novosArquivos.map((file) => file.name),
      ]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setDocumentos((prev) => prev.filter((_, idx) => idx !== index));
    setNomesAtribuidos((prev) => prev.filter((_, idx) => idx !== index));
    setConfirmandoExclusaoIndex(null);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    // Dispatch data to Redux
    dispatch(setCliente({ nome, cpf: cpfRaw }));
    // Log collected information (this will be replaced by the backend logic later)
    console.log({ nome, cpf, dataNascimento, documentos, problema });

    // Move to the next step or complete
    if (step === 8) {
      router.push("/");
    } else {
      setStep(step + 1);
    }
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

  // Funções auxiliares para adicionar/remover sócios/proprietários:
  const adicionarProprietario = () => {
    setNomesProprietarios([...nomesProprietarios, ""]);
    setCpfsProprietarios([...cpfsProprietarios, ""]);
    setCpfsProprietariosDatas([...cpfsProprietariosDatas, ""]);
  };
  const removerProprietario = (idx: number) => {
    setNomesProprietarios(nomesProprietarios.filter((_, i) => i !== idx));
    setCpfsProprietarios(cpfsProprietarios.filter((_, i) => i !== idx));
    setCpfsProprietariosDatas(cpfsProprietariosDatas.filter((_, i) => i !== idx));
  };
  const handleNomeProprietarioChange = (idx: number, value: string) => {
    const novos = [...nomesProprietarios];
    novos[idx] = value;
    setNomesProprietarios(novos);
  };
  const handleCpfProprietarioChange = (idx: number, value: string) => {
    const novos = [...cpfsProprietarios];
    novos[idx] = value.replace(/\D/g, "").slice(0, 11);
    setCpfsProprietarios(novos);
  };
  const handleDataNascimentoProprietarioChange = (idx: number, value: string) => {
    const novos = [...cpfsProprietariosDatas];
    novos[idx] = value;
    setCpfsProprietariosDatas(novos);
  };

  const removerProprietarioComData = (idx: number) => {
    if (nomesProprietarios.length > 1) {
      setNomesProprietarios(nomesProprietarios.filter((_, i) => i !== idx));
      setCpfsProprietarios(cpfsProprietarios.filter((_, i) => i !== idx));
      setCpfsProprietariosDatas(cpfsProprietariosDatas.filter((_, i) => i !== idx));
    }
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
                className="w-full bg-yellow text-[#1A243F] font-bold py-3 px-6 rounded-lg"
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
                  onClick={() => {
                    setTipoCliente("pf");
                    setStep(3);
                  }}
                  className="flex-1 bg-white border-2 border-[#ECC440] rounded-xl shadow-md p-6 flex flex-col items-center hover:bg-[#FFF8E1] transition-all"
                >
                  <span className="text-3xl mb-2">👤</span>
                  <span className="font-bold text-lg text-[#1A243F]">
                    Pessoa Física
                  </span>
                </button>
                <button
                  onClick={() => {
                    setTipoCliente("pj");
                    setStep(3);
                  }}
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

          {/* Step 3 - Nome */}
          {step === 3 && (
            <>
              {tipoCliente === "pf" ? (
                <>
                  <p className="text-center text-[#CA9D14] mb-8">
                    Qual seu nome completo?
                  </p>
                  <input
                    type="text"
                    value={nome}
                    onChange={handleNomeChange}
                    className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ECC440]"
                    placeholder="Seu nome completo"
                    required
                  />
                  {!nome.trim() && (
                    <p className="text-red-600 text-sm mt-2">
                      Preencha o nome para continuar.
                    </p>
                  )}
                </>
              ) : (
                <>
                  <p className="text-center text-[#CA9D14] mb-8">
                    Qual o nome da empresa?
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
                  <p className="text-center text-[#CA9D14] mt-6 mb-2">
                    Nome do proprietário{nomesProprietarios.length > 1 ? " (ou sócios)" : ""}
                  </p>
                  {nomesProprietarios.map((nomeProp, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={nomeProp}
                        onChange={(e) => handleNomeProprietarioChange(idx, e.target.value)}
                        className="flex-1 px-4 py-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-300"
                        placeholder={`Nome do proprietário${nomesProprietarios.length > 1 ? ` #${idx + 1}` : ""}`}
                        required
                      />
                      {nomesProprietarios.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removerProprietario(idx)}
                          className="text-red-600 font-bold px-2"
                          title="Remover proprietário"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={adicionarProprietario}
                    className="text-[#1A243F] bg-gray-100 border border-[#ECC440] rounded px-4 py-2 mt-2 hover:bg-[#FFF8E1] transition-all"
                  >
                    + Adicionar proprietário
                  </button>
                </>
              )}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setStep(2)}
                  className="w-1/2 bg-gray-200 text-[#1A243F] font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-all"
                >
                  Anterior
                </button>
                <button
                  onClick={() => {
                    if (tipoCliente === "pf" ? nome.trim() : nomeEmpresa.trim() && nomesProprietarios.every(n => n.trim())) setStep(4);
                  }}
                  className="w-1/2 bg-yellow text-[#1A243F] font-bold py-3 px-6 rounded-lg"
                  disabled={
                    tipoCliente === "pf"
                      ? !nome.trim()
                      : !nomeEmpresa.trim() || nomesProprietarios.some(n => !n.trim())
                  }
                >
                  Próximo
                </button>
              </div>
            </>
          )}

          {/* Step 4 - CPF/CNPJ */}
          {step === 4 && (
            <>
              {tipoCliente === "pf" ? (
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
                </>
              ) : (
                <>
                  <p className="text-center text-[#CA9D14] mb-8">Qual o CNPJ da empresa?</p>
                  <input
                    type="text"
                    value={formatCpfCnpj(cnpjEmpresa)}
                    onChange={e => setCnpjEmpresa(e.target.value.replace(/\D/g, "").slice(0, 14))}
                    className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ECC440]"
                    placeholder="CNPJ da empresa"
                    required
                    maxLength={18}
                  />
                  {!isValidCNPJ(cnpjEmpresa) && (
                    <p className="text-red-600 text-sm mt-2">
                      Digite um CNPJ válido para continuar.
                    </p>
                  )}
                  <p className="text-center text-[#CA9D14] mt-6 mb-2">
                    CPF dos proprietário(s)
                  </p>
                  {cpfsProprietarios.map((cpfProp, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={formatCpfCnpj(cpfProp)}
                        onChange={e => handleCpfProprietarioChange(idx, e.target.value)}
                        className="flex-1 px-4 py-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-300"
                        placeholder={`CPF do proprietário${cpfsProprietarios.length > 1 ? ` #${idx + 1}` : ""}`}
                        required
                        maxLength={14}
                      />
                    </div>
                  ))}
                  {cpfsProprietarios.some(c => !isValidCPF(c)) && (
                    <p className="text-red-600 text-sm mt-2">
                      Todos os CPFs dos proprietários devem ser válidos.
                    </p>
                  )}
                </>
              )}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setStep(3)}
                  className="w-1/2 bg-gray-200 text-[#1A243F] font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-all"
                >
                  Anterior
                </button>
                <button
                  onClick={() => setStep(5)}
                  className="w-1/2 bg-yellow text-[#1A243F] font-bold py-3 px-6 rounded-lg"
                  disabled={
                    tipoCliente === "pf"
                      ? !isValidCPF(cpfRaw)
                      : !isValidCNPJ(cnpjEmpresa) || cpfsProprietarios.some(c => !isValidCPF(c))
                  }
                >
                  Próximo
                </button>
              </div>
            </>
          )}

          {/* Step 5 - Data de Nascimento */}
          {step === 5 && (
            <>
              <p className="text-center text-[#CA9D14] mb-8">
                {tipoCliente === "pf"
                  ? "Qual sua data de nascimento?"
                  : "Informe a data de nascimento dos proprietário(s)"}
              </p>

              {/* Campo para data de criação da empresa */}
              {tipoCliente === "pj" && (
                <div className="mb-6">
                  <label className="block text-[#1A243F] font-semibold mb-2">
                    Data de criação da empresa
                  </label>
                  <input
                    type="date"
                    value={dataNascimento}
                    onChange={handleDataNascimentoChange}
                    className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ECC440]"
                    required
                  />
                  {!isValidDate(dataNascimento) && (
                    <p className="text-red-600 text-sm mt-2">
                      Informe uma data válida para a criação da empresa.
                    </p>
                  )}
                </div>
              )}

              {/* Tabela de proprietários (apenas para empresa) */}
              {tipoCliente === "pj" && (
                <table className="w-full mb-4 text-sm text-left border">
                  <thead className="bg-gray-100 text-[#CA9D14]">
                    <tr>
                      <th className="py-2 px-2">Nome</th>
                      <th className="py-2 px-2">CPF</th>
                      <th className="py-2 px-2">Data de Nascimento</th>
                      <th className="py-2 px-2 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nomesProprietarios.map((nomeProp, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="py-2 px-2">{nomeProp}</td>
                        <td className="py-2 px-2">{formatCpfCnpj(cpfsProprietarios[idx] || "")}</td>
                        <td className="py-2 px-2">
                          <input
                            type="date"
                            value={cpfsProprietariosDatas?.[idx] || ""}
                            onChange={e => handleDataNascimentoProprietarioChange(idx, e.target.value)}
                            className="px-2 py-1 rounded bg-gray-100 border border-gray-300"
                            required
                          />
                        </td>
                        <td className="py-2 px-2 text-center">
                          {nomesProprietarios.length > 1 ? (
                            <button
                              type="button"
                              onClick={() => removerProprietarioComData(idx)}
                              className="text-red-600 hover:text-red-800 font-bold"
                            >
                              🗑️
                            </button>
                          ) : (
                            <span className="text-gray-400" title="Deve haver pelo menos um proprietário">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* Alerta se tentar remover todos os proprietários */}
              {tipoCliente === "pj" && nomesProprietarios.length === 0 && (
                <p className="text-red-600 text-sm mb-2">
                  É necessário ter pelo menos um proprietário preenchido.
                </p>
              )}

              {/* Para pessoa física, campo único */}
              {tipoCliente === "pf" && (
                <>
                  <input
                    type="date"
                    value={dataNascimento}
                    onChange={handleDataNascimentoChange}
                    className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ECC440]"
                    required
                  />
                  {!isValidDate(dataNascimento) && (
                    <p className="text-red-600 text-sm mt-2">
                      Informe uma data de nascimento válida para continuar.
                    </p>
                  )}
                </>
              )}

              {/* Para empresa, validação das datas */}
              {tipoCliente === "pj" && cpfsProprietariosDatas?.some(date => !isValidDate(date)) && (
                <p className="text-red-600 text-sm mt-2">
                  Preencha todas as datas de nascimento dos proprietários corretamente.
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
                  onClick={() => setStep(6)}
                  className="w-1/2 bg-yellow text-[#1A243F] font-bold py-3 px-6 rounded-lg"
                  disabled={
                    tipoCliente === "pf"
                      ? !isValidDate(dataNascimento)
                      : nomesProprietarios.length === 0 ||
                        cpfsProprietariosDatas?.some(date => !isValidDate(date)) ||
                        !isValidDate(dataNascimento)
                  }
                >
                  Próximo
                </button>
              </div>
            </>
          )}

          {/* Step 6 - Identidade */}
          {step === 6 && (
            <>
              <p className="text-center text-[#CA9D14] mb-8">
                Envie o documento de{" "}
                <span className="font-bold">Identidade</span>{" "}
                <span className="text-red-600">*</span>
              </p>
              <input
                type="file"
                accept="application/pdf,image/*"
                multiple
                onChange={handleDocumentUpload}
                className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ECC440]"
                required
              />
              {documentos.length === 0 && (
                <p className="text-red-600 text-sm mt-2">
                  Adicione pelo menos um documento para continuar.
                </p>
              )}
              {documentos.length > 0 && (
                <table className="mt-4 w-full text-sm text-left">
                  <thead className="text-[#CA9D14]">
                    <tr>
                      <th className="py-2">Nome Atribuído</th>
                      <th className="py-2 text-center">Editar</th>
                      <th className="py-2 text-center">Excluir</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documentos.map((file, idx) => (
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
              {documentos.length < 1 && (
                <p className="text-red-600 text-sm mt-2">
                  Parece que ficou faltando algum documento, confira se você
                  anexou a Identidade.
                </p>
              )}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setStep(5)}
                  className="w-1/2 bg-gray-200 text-[#1A243F] font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-all"
                >
                  Anterior
                </button>
                <button
                  onClick={() => documentos.length >= 1 && setStep(7)}
                  className="w-1/2 bg-yellow text-[#1A243F] font-bold py-3 px-6 rounded-lg"
                  disabled={documentos.length < 1}
                >
                  Próximo
                </button>
              </div>
            </>
          )}

          {/* Step 7 - Comprovante de Residência */}
          {step === 7 && (
            <>
              <p className="text-center text-[#CA9D14] mb-8">
                Envie o{" "}
                <span className="font-bold">Comprovante de residência</span>{" "}
                <span className="text-red-600">*</span>
              </p>
              <input
                type="file"
                accept="application/pdf,image/*"
                multiple
                onChange={handleDocumentUpload}
                className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ECC440]"
                required
              />
              {documentos.length === 0 && (
                <p className="text-red-600 text-sm mt-2">
                  Adicione pelo menos um documento para continuar.
                </p>
              )}
              {documentos.length > 0 && (
                <table className="mt-4 w-full text-sm text-left">
                  <thead className="text-[#CA9D14]">
                    <tr>
                      <th className="py-2">Nome Atribuído</th>
                      <th className="py-2 text-center">Editar</th>
                      <th className="py-2 text-center">Excluir</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documentos.map((file, idx) => (
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
              {documentos.length < 2 && (
                <p className="text-red-600 text-sm mt-2">
                  Parece que ficou faltando algum documento, confira se você
                  anexou o Comprovante de Residência.
                </p>
              )}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setStep(6)}
                  className="w-1/2 bg-gray-200 text-[#1A243F] font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-all"
                >
                  Anterior
                </button>
                <button
                  onClick={() => documentos.length >= 2 && setStep(8)}
                  className="w-1/2 bg-yellow text-[#1A243F] font-bold py-3 px-6 rounded-lg"
                  disabled={documentos.length < 2}
                >
                  Próximo
                </button>
              </div>
            </>
          )}

          {/* Step 8 - Procuração e Declaração de Hipossuficiência */}
          {step === 8 && (
            <>
              <p className="text-center text-[#CA9D14] mb-8">
                Envie <span className="font-bold">Procuração</span>{" "}
                <span className="text-red-600">*</span> e/ou{" "}
                <span className="font-bold">
                  Declaração de hipossuficiência
                </span>{" "}
                <span className="text-xs text-gray-500">(caso tenha)</span>
              </p>
              <input
                type="file"
                accept="application/pdf,image/*"
                multiple
                onChange={handleDocumentUpload}
                className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ECC440]"
                required
              />
              {documentos.length === 0 && (
                <p className="text-red-600 text-sm mt-2">
                  Adicione pelo menos um documento para continuar.
                </p>
              )}
              {documentos.length > 0 && (
                <table className="mt-4 w-full text-sm text-left">
                  <thead className="text-[#CA9D14]">
                    <tr>
                      <th className="py-2">Nome Atribuído</th>
                      <th className="py-2 text-center">Editar</th>
                      <th className="py-2 text-center">Excluir</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documentos.map((file, idx) => (
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
              {documentos.length < 3 && (
                <p className="text-red-600 text-sm mt-2">
                  Parece que ficou faltando algum documento, confira se você
                  anexou a Procuração ou a Declaração de Hipossuficiência.
                </p>
              )}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setStep(7)}
                  className="w-1/2 bg-gray-200 text-[#1A243F] font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-all"
                >
                  Anterior
                </button>
                <button
                  onClick={() => documentos.length >= 3 && setStep(9)}
                  className="w-1/2 bg-yellow text-[#1A243F] font-bold py-3 px-6 rounded-lg"
                  disabled={documentos.length < 3}
                >
                  Próximo
                </button>
              </div>
            </>
          )}

          {/* Step 9 - Finalização */}
          {step === 9 && (
            <>
              <p className="text-center text-[#CA9D14] mb-8">
                Descreva o problema ocorrido (opcional)
              </p>
              <textarea
                value={problema}
                onChange={handleProblemaChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ECC440]"
                placeholder="Descreva o problema"
              />
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setStep(8)}
                  className="w-1/2 bg-gray-200 text-[#1A243F] font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-all"
                >
                  Anterior
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleSubmit();
                    setStep(10);
                  }}
                  className="w-1/2 bg-yellow text-[#1A243F] font-bold py-3 px-6 rounded-lg"
                >
                  Enviar
                </button>
              </div>
            </>
          )}

          {/* Step 10 - Agradecimento */}
          {step === 10 && (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-[#1A243F] mb-4">
                Obrigado pelo envio!
              </h2>
              <p className="text-[#CA9D14] mb-8">
                Recebemos suas informações e documentos. Em breve entraremos em
                contato.
              </p>
              <button
                type="button"
                onClick={() => router.push("/")}
                className="w-full bg-primary text-white font-bold py-3 px-6 rounded-lg mt-2 hover:bg-primary/80 transition-all"
              >
                Voltar ao início
              </button>
            </div>
          )}

          {/* Botão "Deixar para depois" sempre visível */}
          <button
            type="button"
            onClick={() => router.push("/")}
            className="w-full bg-gray-200 text-[#1A243F] font-bold py-3 px-6 rounded-lg mt-2 hover:bg-gray-300 transition-all"
          >
            Deixar para depois
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// Funções utilitárias para validação:
function isValidCPF(cpf: string) {
  // Validação simples de CPF (11 dígitos)
  return cpf.length === 11;
}

function isValidDate(date: string) {
  // Valida se a data está preenchida e é uma data válida no formato YYYY-MM-DD
  if (!date) return false;
  const d = new Date(date);
  return !isNaN(d.getTime());
}

// Função utilitária para CNPJ:
function isValidCNPJ(cnpj: string) {
  // Validação simples: 14 dígitos numéricos
  return cnpj.length === 14;
}
