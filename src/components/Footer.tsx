export default function Footer() {
  return (
    <footer className="bg-primary border-t-4 border-yellow mt-auto">
      <div className="container mx-auto px-4 py-4">
        <div className="text-center">
          <p className="text-lightGray text-sm">
            © {new Date().getFullYear()} Alcides e Mosinho. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}

