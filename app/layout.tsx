import './globals.css';
import { ReduxProvider } from '../store/provider';
import { getAssetPath } from '../src/utils/paths';

export const metadata = {
  title: 'Alcides e Mosinho',
  description: 'Aplicação web de Alcides e Mosinho',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body style={{ position: 'relative', minHeight: '100vh', margin: 0, padding: 0 }}>
        {/* Imagem de fundo */}
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 0,
            backgroundImage: `url('${getAssetPath('/images/backgroundAzul.jpg')}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            width: '100vw',
            height: '100vh',
          }}
          aria-hidden="true"
        />
        {/* Sombreamento */}
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1,
            background: 'rgba(0,0,0,0.5)',
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        />
        {/* Conteúdo */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <ReduxProvider>{children}</ReduxProvider>
        </div>
      </body>
    </html>
  );
}
