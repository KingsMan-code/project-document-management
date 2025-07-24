'use client';

import { useRouter } from 'next/navigation';
import Header from '../../src/components/Header';
import Footer from '../../src/components/Footer';
import { useState } from 'react';

export default function ChangeWAY() {
  const router = useRouter();

  const cards = [
    {
      id: 1,
      title: 'Já sou cliente',
      description: 'Já sou cliente do escritório e quero adicionar os documentos novos solicitados.',
      image: '/law-card-2.jpg',
      buttonText: 'Enviar Documentos',
      redirect: '/cliente',
    },
    {
      id: 2,
      title: 'Sou novo cliente',
      description: 'Sou novo cliente do escritório e quero enviar meus documentos para análise de caso.',
      image: '/law-card-9.webp',
      buttonText: 'Enviar Documentos',
      redirect: '/novoCliente',
    },
  ];

  const CardComponent = ({ card }: { card: any }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => router.push(card.redirect)}
        className="flex flex-col h-full relative bg-white rounded-xl overflow-hidden shadow-xl transform transition-all duration-300 scale-[0.9] hover:scale-100 hover:shadow-2xl cursor-pointer"
        style={{
          background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
          width: '400px',
          height: '400px',
          margin: '0 auto',
        }}
      >
        <div className="relative overflow-hidden">
          <img
            className={`w-full h-56 object-cover transition-all duration-700 ${
              isHovered ? 'grayscale-0' : 'grayscale'
            }`}
            src={card.image}
            alt={card.title}
          />
        </div>

        <div className="flex flex-col flex-1 p-6">
          <div className="font-semibold text-xl mb-3 text-primary text-center">{card.title}</div>
          <p className="text-textColor text-base leading-relaxed mb-3 text-center">{card.description}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 px-4 py-8 flex items-center justify-center">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-semibold text-white mb-1">Gerenciamento de Documentos Jurídicos</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 justify-center max-w-4xl mx-auto items-center">
            {cards.map((card) => (
              <div key={card.id} className="flex justify-center items-center">
                <CardComponent card={card} />
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => router.back()}
              className="bg-primary hover:bg-primary/80 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg"
            >
              Voltar
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
