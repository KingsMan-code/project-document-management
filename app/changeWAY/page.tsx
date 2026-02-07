'use client';

import { useRouter } from 'next/navigation';
import Header from '../../src/components/Header';
import Footer from '../../src/components/Footer';
import { useState } from 'react';
import { getAssetPath } from '../../src/utils/paths';
import Spinner from '../../src/components/Spinner';

const prefix = process.env.NEXT_PUBLIC_BASE_PATH || '';

export default function ChangeWAY() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const cards = [
    {
      id: 1,
      title: 'Já sou cliente',
      description: 'Já sou cliente do escritório e quero adicionar os documentos novos solicitados.',

      image: getAssetPath('/images/card1.jpg'),

      buttonText: 'Enviar Documentos',
      redirect: '/clienteSelecao',
    },
    {
      id: 2,
      title: 'Sou novo cliente',
      description: 'Sou novo cliente do escritório e quero enviar meus documentos para análise de caso.',

      image: getAssetPath('/images/card2.jpg'),

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
        onClick={() => {
          setLoading(true);
          router.push(card.redirect);
        }}
        className="flex flex-col h-full relative bg-white rounded-2xl overflow-hidden shadow-xl transform transition-all duration-300 scale-[0.95] hover:scale-100 hover:shadow-2xl cursor-pointer"
        style={{
          background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
          width: '300px',
          height: '300px',
          margin: '0 auto',
        }}
      >
        <div className="relative overflow-hidden">
          <img
            className={`w-full h-40 object-cover transition-all duration-700 ${
              isHovered ? 'grayscale-0' : 'grayscale'
            }`}
            src={card.image}
            alt={card.title}
          />
        </div>

        <div className="flex flex-col flex-1 p-5">
          <div className="font-semibold text-base mb-1 text-primary text-center">{card.title}</div>
          <p className="text-textColor text-xs leading-relaxed text-center">{card.description}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      {loading && <Spinner />}
      <Header />
      <main className="flex-1 px-3 py-4 flex items-center justify-center">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-xl font-semibold text-white mb-1">Juris Portal Solução em gestão de documentos</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 justify-center max-w-2xl mx-auto items-center">
            {cards.map((card) => (
              <div key={card.id} className="flex justify-center items-center">
                <CardComponent card={card} />
              </div>
            ))}
          </div>

          <div className="text-center mt-6">
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
