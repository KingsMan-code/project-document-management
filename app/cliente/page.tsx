'use client'

import { useRouter } from 'next/navigation'
import Header from '../../src/components/Header'
import Footer from '../../src/components/Footer'
import { useState } from 'react'

export default function Cliente() {
  const router = useRouter()
  const [nome, setNome] = useState('')
  const [cpf, setCpf] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Aqui você pode validar ou salvar os dados antes de redirecionar

    router.push('/envioDocumentos') // redireciona para a nova página
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
              </label>
              <input
                type="text"
                id="nome"
                placeholder="Seu nome completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ECC440] transition-all"
              />
            </div>

            <div>
              <label htmlFor="cpf" className="block text-sm font-bold uppercase text-[#CA9D14] mb-2">
                CPF
              </label>
              <input
                type="text"
                id="cpf"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ECC440] transition-all"
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
              onClick={() => router.push('/')}
              className="text-sm text-[#CA9D14] hover:underline"
            >
              Voltar ao Início
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
