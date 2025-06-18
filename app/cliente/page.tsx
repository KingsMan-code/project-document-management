'use client'

import { useRouter } from 'next/navigation'
import Header from '../../src/components/Header'
import Footer from '../../src/components/Footer'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setCliente } from '../../store/clienteSlice'

function formatCpfCnpj(value: string) {
  // Remove tudo que não for número
  const digits = value.replace(/\D/g, '');

  if (digits.length <= 11) {
    // CPF: 000.000.000-00
    return digits
      .replace(/^(\d{3})(\d)/, '$1.$2')
      .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1-$2')
      .slice(0, 14);
  } else {
    // CNPJ: 00.000.000/0000-00
    return digits
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .slice(0, 18);
  }
}

export default function Cliente() {
  const router = useRouter()
  const dispatch = useDispatch()

  const [nome, setNome] = useState('')
  const [cpf, setCpf] = useState('')
  const [cpfRaw, setCpfRaw] = useState('')
  const [nomeTouched, setNomeTouched] = useState(false)
  const [cpfTouched, setCpfTouched] = useState(false)

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Remove tudo que não for número para enviar ao redux depois
    const onlyDigits = value.replace(/\D/g, '');
    setCpfRaw(onlyDigits);
    setCpf(formatCpfCnpj(value));
    setCpfTouched(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Envia apenas os dígitos para o Redux
    dispatch(setCliente({ nome, cpf: cpfRaw }))
    router.push('/envioDocumentos')
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#1A243F]">
      <Header />

      <main className="flex-1 px-4 py-8 flex items-center justify-center">
        <div className="bg-white text-[#1A243F] rounded-2xl shadow-lg p-10 max-w-xl w-full relative border-l-8 border-[#ECC440] transition-transform transform hover:scale-[1.01] hover:shadow-[0_0_20px_#ECC44050]">
          <h1 className="text-3xl font-bold text-center mb-6">Novo Cliente</h1>
          <p className="text-center text-[#CA9D14] mb-8">Informe seu nome completo e CPF para prosseguir</p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="nome" className="block text-sm font-bold uppercase text-[#CA9D14] mb-2">
                Nome
                {!nome && !nomeTouched && (
                  <span className="text-red-600 ml-1">*</span>
                )}
              </label>
              <input
                type="text"
                id="nome"
                placeholder="Seu nome completo"
                value={nome}
                onChange={e => { setNome(e.target.value); setNomeTouched(true); }}
                className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ECC440] transition-all"
                required
              />
            </div>

            <div>
              <label htmlFor="cpf" className="block text-sm font-bold uppercase text-[#CA9D14] mb-2">
                CPF ou CNPJ
                {!cpf && !cpfTouched && (
                  <span className="text-red-600 ml-1">*</span>
                )}
              </label>
              <input
                type="text"
                id="cpf"
                placeholder="Digite seu CPF ou CNPJ"
                value={cpf}
                onChange={handleCpfChange}
                maxLength={18}
                className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ECC440] transition-all"
                required
              />
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
  )
}
