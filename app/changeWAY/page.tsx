'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../src/components/Header';
import Footer from '../../src/components/Footer';

export default function ChangeWAY() {
  const router = useRouter();

  const existingClientCard = {
    id: 1,
    title: 'Já sou cliente',
    description: 'Já sou cliente do escritório e quero adicionar os documentos novos solicitados.',
    image: '/law-card-2.jpg',
    tags: ['#processo', '#acompanhamento', '#atualização'],
    buttonText: 'Enviar Documentos',
  };

  const newClientCard = {
    id: 2,
    title: 'Sou novo cliente',
    description: 'Sou novo cliente do escritório e quero enviar meus documentos para análise de caso.',
    image: '/law-card-9.webp',
    tags: ['#análise', '#caso', '#estratégia'],
    buttonText: 'Enviar Documentos',
  };

  // 👉 Versão 1: Card tradicional com botão
  const CardComponent = ({ card }: { card: any }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="flex flex-col h-full relative bg-white rounded-xl overflow-hidden shadow-xl transform transition-all duration-300 scale-[0.9] hover:scale-[0.95] hover:shadow-2xl cursor-pointer"
        style={{
          background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
          width: '400px',
          height: '400px',
          margin: '0 auto',
        }}
      >
        <div className="relative overflow-hidden">
          <img
            className={`w-full h-48 object-cover transition-all duration-700 ${
              isHovered ? 'grayscale-0' : 'grayscale'
            }`}
            src={card.image}
            alt={card.title}
          />
        </div>

        <div className="flex flex-col flex-1 p-4">
          <div className="font-semibold text-lg mb-2 text-primary text-center">{card.title}</div>
          <p className="text-textColor text-sm leading-snug mb-3 text-center">{card.description}</p>
          <button
            onClick={() => {
              if (card.id === 2) router.push('/novo-cliente');
            }}
            className="w-full font-semibold py-2 px-3 rounded-md transition-all duration-300 shadow-md transform hover:scale-105 bg-yellow hover:bg-darkYellow text-primary text-sm mt-auto"
          >
            {card.buttonText}
          </button>
        </div>
      </div>
    );
  };

  // 👉 Versão 2: CardLink – todo o card é clicável, sem botão
  const CardLinkComponent = ({ card }: { card: any }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => {
          if (card.id === 2) router.push('/novo-cliente');
        }}
        className="flex flex-col h-full relative bg-white rounded-xl overflow-hidden shadow-xl transform transition-all duration-300 scale-[0.9] hover:scale-100 hover:shadow-2xl cursor-pointer"
        style={{
          background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
          width: '300px',
          height: '300px',
          margin: '0 auto',
        }}
      >
        <div className="relative overflow-hidden">
          <img
            className={`w-full h-48 object-cover transition-all duration-700 ${
              isHovered ? 'grayscale-0' : 'grayscale'
            }`}
            src={card.image}
            alt={card.title}
          />
        </div>

        <div className="flex flex-col flex-1 p-4">
          <div className="font-semibold text-lg mb-2 text-primary text-center">{card.title}</div>
          <p className="text-textColor text-sm leading-snug mb-3 text-center">{card.description}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-semibold text-white mb-1">Gerenciamento de Documentos Jurídicos</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 justify-center max-w-4xl mx-auto items-center">
            <div className="flex justify-center items-center">
              <CardComponent card={existingClientCard} />
            </div>
            <div className="flex justify-center items-center">
              <CardLinkComponent card={newClientCard} />
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
  );
}
