'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../src/components/Header';
import Footer from '../src/components/Footer';

const prefix = process.env.NEXT_PUBLIC_BASE_PATH || '';

export default function Inicio() {
  const [startTransition, setStartTransition] = useState(false);
  const [showLayout, setShowLayout] = useState(false);
  const router = useRouter();

  const handleButtonClick = () => {
    setStartTransition(true);
  };

  useEffect(() => {
    if (startTransition) {
      const fadeOut = setTimeout(() => {
        setShowLayout(true);
      }, 1500); // espera a animação do h1 terminar

      const redirect = setTimeout(() => {
        router.push('/changeWAY');
      }, 2200); // tempo total até redirecionar

      return () => {
        clearTimeout(fadeOut);
        clearTimeout(redirect);
      };
    }
  }, [startTransition, router]);

  return (

    // <div
    //   className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat"
    //   style={{
    //     backgroundImage: `url('${getAssetPath('../images/backgroundAzul.jpg')}')`,
    //   }}
    // >
    <div className="min-h-screen flex flex-col bg-cover bg-center">

      <AnimatePresence>
        {!showLayout && (
          <motion.div
            initial={{ y: 0, opacity: 1 }}
            animate={startTransition ? { y: -300, scale: 0.8, opacity: 0 } : {}}
            transition={{ duration: 1.2 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center flex-1 text-center px-4 backdrop-blur-sm bg-black/40"
          >
            <motion.h1
              initial={{ y: 0 }}
              animate={startTransition ? { y: -250 } : {}}
              transition={{ duration: 1.2 }}
              className="text-4xl font-bold text-white underline underline-offset-8 decoration-yellow"
            >
              Alcides e Mosinho Teste
            </motion.h1>

            <p className="text-xs text-lightGray mt-4 font-extralight max-w-xl">
              "Nós somos o que repetidamente fazemos. A excelência, portanto, não é um feito, mas um hábito."
            </p>

            <button
              onClick={handleButtonClick}
              className="mt-8 bg-yellow hover:bg-darkYellow text-primary font-bold py-3 px-6 border-b-4 border-goldYellow hover:border-darkYellow rounded transition-all duration-200 shadow-lg"
            >
              Entrar
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header e Footer com fade-in */}
      <AnimatePresence>
        {showLayout && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <Header />
            </motion.div>

            <main className="flex-1" />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <Footer />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
