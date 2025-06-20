// app/cliente/page.tsx - VERSÃO CORRIGIDA
'use client'

import { useRouter } from 'next/navigation'
import Header from '../../src/components/Header'
import Footer from '../../src/components/Footer'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setTipoCliente, setDadosPF, setDadosPJ, adicionarDocumento } from '../../store/clienteSlice'
import { formatCpfCnpj, isValidCPF, isValidCNPJ, isValidDate } from '../../src/utils/validation'

interface DocumentoLocal {
  file: File;
  nomeAtribuido: string;
}

export default function Cliente() {
  const router = useRouter()
  const dispatch = useDispatch()

  // Controle de seções
  const [currentStep, setCurrentStep] = useState(1)

  // Estados do formulário
  const [tipoCliente, setTipoClienteLocal] = useState<'pf' | 'pj' | null>(null)
  const [nome, setNome] = useState('')
  const [cpfCnpj, setCpfCnpj] = useState('')
  const [cpfCnpjRaw, setCpfCnpjRaw] = useState('')
  const [dataNascimentoCriacao, setDataNascimentoCriacao] = useState('')
  const [documentosLocais, setDocumentosLocais] = useState<DocumentoLocal[]>([])

  // Estados para edição de documentos
  const [editandoIndex, setEditandoIndex] = useState<number | null>(null)
  const [novoNomeDocumento, setNovoNomeDocumento] = useState("")

  const handleCpfCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const onlyDigits = value.replace(/\D/g, '');
    setCpfCnpjRaw(onlyDigits);
    setCpfCnpj(formatCpfCnpj(value));
  };

  const isValidDocument = () => {
    if (tipoCliente === 'pf') {
      return isValidCPF(cpfCnpjRaw);
    } else if (tipoCliente === 'pj') {
      return isValidCNPJ(cpfCnpjRaw);
    }
    return false;
  };

  const handleTipoClienteChange = (tipo: 'pf' | 'pj') => {
    setTipoClienteLocal(tipo);
    dispatch(setTipoCliente(tipo));
    setCurrentStep(2);
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

  const handleFinalSubmit = () => {
    // Salva os dados no Redux
    if (tipoCliente === 'pf') {
      dispatch(setDadosPF({ 
        nome, 
        cpf: cpfCnpjRaw, 
        dataNascimento: dataNascimentoCriacao 
      }));
    } else {
      dispatch(setDadosPJ({ 
        nomeEmpresa: nome, 
        cnpj: cpfCnpjRaw, 
        dataCriacaoEmpresa: dataNascimentoCriacao 
      }));
    }

    // Salva os documentos
    documentosLocais.forEach(doc => {
      dispatch(adicionarDocumento({ nome: doc.nomeAtribuido, arquivos: [doc.file] }));
    });

    setCurrentStep(4);
  };

  const canAdvanceFromStep2 = () => {
    return nome.trim() && isValidDocument();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#1A243F]">
      <Header />
      
      <main className="flex-1 px-4 py-8 flex items-center justify-center">
        <div className="bg-white text-[#1A243F] rounded-2xl shadow-lg p-10 max-w-xl w-full relative border-l-8 border-[#ECC440]">
          
          {/* SEÇÃO 1: Escolher entre Empresa ou Não */}
          {currentStep === 1 && (
            <>
              <h1 className="text-3xl font-bold text-center mb-6">Bem-vindo!</h1>
              <p className="text-center text-[#CA9D14] mb-8">
                Você é cliente pessoa física ou cliente empresa?
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button
                  onClick={() => handleTipoClienteChange('pf')}
                  className="flex-1 bg-white border-2 border-[#ECC440] rounded-xl shadow-md p-6 flex flex-col items-center hover:bg-[#FFF8E1] transition-all"
                >
                  <span className="text-3xl mb-2">👤</span>
                  <span className="font-bold text-lg text-[#1A243F]">
                    Pessoa Física
                  </span>
                </button>
                <button
                  onClick={() => handleTipoClienteChange('pj')}
                  className="flex-1 bg-white border-2 border-[#ECC440] rounded-xl shadow-md p-6 flex flex-col items-center hover:bg-[#FFF8E1] transition-all"
                >
                  <span className="text-3xl mb-2">🏢</span>
                  <span className="font-bold text-lg text-[#1A243F]">
                    Empresa
                  </span>
                </button>
              </div>
            </>
          )}

          {/* SEÇÃO 2: Nome, Data e CPF/CNPJ */}
          {currentStep === 2 && (
            <>
              <h1 className="text-3xl font-bold text-center mb-6">
                {tipoCliente === 'pf' ? 'Dados Pessoais' : 'Dados da Empresa'}
              </h1>
              <p className="text-center text-[#CA9D14] mb-8">
                Informe seus dados para prosseguir
              </p>

              <div className="space-y-6">
                <div>
                  <label htmlFor="nome" className="block text-sm font-bold uppercase text-[#CA9D14] mb-2">
                    {tipoCliente === 'pf' ? 'Nome Completo' : 'Nome da Empresa'}
                  </label>
                  <input
                    type="text"
                    id="nome"
                    placeholder={tipoCliente === 'pf' ? "Seu nome completo" : "Nome da empresa"}
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ECC440] transition-all"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="cpfCnpj" className="block text-sm font-bold uppercase text-[#CA9D14] mb-2">
                    {tipoCliente === 'pf' ? 'CPF' : 'CNPJ'}
                  </label>
                  <input
                    type="text"
                    id="cpfCnpj"
                    placeholder={tipoCliente === 'pf' ? "Digite seu CPF" : "Digite o CNPJ"}
                    value={cpfCnpj}
                    onChange={handleCpfCnpjChange}
                    maxLength={tipoCliente === 'pf' ? 14 : 18}
                    className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ECC440] transition-all"
                    required
                  />
                  {!isValidDocument() && cpfCnpjRaw && (
                    <p className="text-red-600 text-sm mt-1">
                      {tipoCliente === 'pf' ? 'CPF inválido' : 'CNPJ inválido'}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="data" className="block text-sm font-bold uppercase text-[#CA9D14] mb-2">
                    {tipoCliente === 'pf' ? 'Data de Nascimento' : 'Data de Criação da Empresa'}
                  </label>
                  <input
                    type="date"
                    id="data"
                    value={dataNascimentoCriacao}
                    onChange={(e) => setDataNascimentoCriacao(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ECC440] transition-all"
                  />
                </div>
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
                  disabled={!canAdvanceFromStep2()}
                  className="w-1/2 bg-yellow text-[#1A243F] font-bold py-3 px-6 rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
                >
                  Próximo
                </button>
              </div>
            </>
          )}

          {/* SEÇÃO 3: Escolher Arquivo */}
          {currentStep === 3 && (
            <>
              <h1 className="text-3xl font-bold text-center mb-6">Documentos</h1>
              <p className="text-center text-[#CA9D14] mb-8">
                Envie seus documentos (opcional)
              </p>

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
                  className="w-1/2 bg-yellow text-[#1A243F] font-bold py-3 px-6 rounded-lg hover:bg-[#D4B91A] transition-all"
                >
                  Próximo
                </button>
              </div>
            </>
          )}

          {/* SEÇÃO 4: Agradecimento */}
          {currentStep === 4 && (
            <>
              <h1 className="text-3xl font-bold text-center mb-6">Obrigado!</h1>
              <p className="text-center text-[#CA9D14] mb-8">
                Seus dados foram registrados com sucesso.
              </p>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h4 className="font-bold mb-2">Resumo dos dados:</h4>
                <p><strong>{tipoCliente === 'pf' ? 'Nome:' : 'Empresa:'}</strong> {nome}</p>
                <p><strong>{tipoCliente === 'pf' ? 'CPF:' : 'CNPJ:'}</strong> {cpfCnpj}</p>
                {dataNascimentoCriacao && (
                  <p><strong>{tipoCliente === 'pf' ? 'Data de Nascimento:' : 'Data de Criação:'}:</strong> {dataNascimentoCriacao}</p>
                )}
                <p><strong>Documentos:</strong> {documentosLocais.length} arquivo(s)</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => router.push('/envioDocumentos')}
                  className="w-1/2 bg-yellow text-[#1A243F] font-bold py-3 px-6 rounded-lg hover:bg-[#D4B91A] transition-all"
                >
                  Continuar
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="w-1/2 bg-gray-200 text-[#1A243F] font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-all"
                >
                  Voltar ao Início
                </button>
              </div>
            </>
          )}

          {/* Indicador de progresso - CORRIGIDO */}
          {currentStep > 1 && currentStep < 4 && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>Progresso</span>
                <span>{currentStep - 1}/3</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

