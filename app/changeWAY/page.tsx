'use client'

import { useRouter } from 'next/navigation'
import Header from '../../src/components/Header'
import Footer from '../../src/components/Footer'

export default function ChangeWAY() {
  const router = useRouter()

  // Card para clientes existentes - Acompanhamento Processual
  const existingClientCard = {
    id: 2,
    title: "Acompanhamento Processual",
    description: "Acompanhe o andamento dos seus processos em curso. Receba atualizações e envie documentação complementar.",
    image: "/law-card-2.jpg",
    tags: ["#processo", "#acompanhamento", "#atualização"],
    buttonText: "Ver Processo"
  }

  // Card para novos clientes - Análise de Caso
  const newClientCard = {
    id: 9,
    title: "Análise de Caso",
    description: "Receba uma análise detalhada do seu caso. Nossa equipe avaliará a viabilidade e estratégias legais.",
    image: "/law-card-9.webp",
    tags: ["#análise", "#caso", "#estratégia"],
    buttonText: "Solicitar Análise"
  }

  // CardComponent com tamanho igual para ambos e botão sempre amarelo
  const CardComponent = ({ card }: { card: any }) => (
    <div 
      className="flex flex-col h-full relative bg-white rounded-xl overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-105 hover:shadow-3xl cursor-pointer group"
      style={{
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)'
      }}
    >
      <div className="relative overflow-hidden">
        <img 
          className="w-full h-64 object-cover transition-all duration-700 grayscale group-hover:grayscale-0"
          src={card.image} 
          alt={card.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300"></div>
      </div>
      
      <div className="flex flex-col flex-1 p-6">
        <div className="font-bold text-xl mb-3 text-primary">
          {card.title}
        </div>
        <p className="text-textColor text-base leading-relaxed mb-4 flex-1">
          {card.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {card.tags.map((tag: string, index: number) => (
            <span 
              key={index}
              className="inline-block bg-lightYellow rounded-full px-3 py-1 text-sm font-semibold text-primary shadow-sm"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <button 
          className="w-full font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg transform hover:scale-105 bg-yellow hover:bg-darkYellow text-primary hover:shadow-xl mt-auto"
        >
          {card.buttonText}
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Gerenciamento de Documentos Jurídicos
            </h1>
            <p className="text-lightGray text-lg max-w-3xl mx-auto">
              Escolha o serviço adequado para gerenciar seus documentos legais. 
              Nosso sistema seguro permite upload, acompanhamento e gestão completa da sua documentação jurídica.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 justify-center max-w-4xl mx-auto">
            {/* Card para Clientes Existentes */}
            <div className="flex flex-col h-full">
              <h2 className="text-2xl font-bold text-yellow mb-6 text-center">
                Para Clientes Existentes
              </h2>
              <CardComponent 
                card={existingClientCard} 
              />
            </div>

            {/* Card para Novos Clientes */}
            <div className="flex flex-col h-full">
              <h2 className="text-2xl font-bold text-yellow mb-6 text-center">
                Para Novos Clientes
              </h2>
              <CardComponent 
                card={newClientCard} 
              />
            </div>
          </div>
          
          <div className="text-center mt-12">
            <button 
              onClick={() => router.push('/')}
              className="bg-primary hover:bg-primary/80 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg"
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

