import './globals.css'

export const metadata = {
  title: 'Alcides e Mosinho',
  description: 'Aplicação web de Alcides e Mosinho',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt">
      {/* <body className="bg-gradient-to-br from-primary via-primary to-secondary min-h-screen"> */}
      <body
        style={{
          position: "relative",
          minHeight: "100vh",
          margin: 0,
          padding: 0,
        }}
      >
        {/* Imagem de fundo */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            backgroundImage: "url('/images/3.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            width: "100vw",
            height: "100vh",
          }}
          aria-hidden="true"
        />
        {/* Sombreamento */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1,
            background: "rgba(0,0,0,0.5)",
            pointerEvents: "none",
          }}
          aria-hidden="true"
        />
        {/* Conteúdo acima do background e do sombreado */}
        <div style={{ position: "relative", zIndex: 2 }}>
          {children}
        </div>
      </body>
    </html>
  )
}

