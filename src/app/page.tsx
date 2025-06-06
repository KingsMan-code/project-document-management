export default function inicio() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-4xl font-bold text-white animate-bounce-slow transition transform hover:-translate-y-3 hover:scale-110 duration-500 underline underline-offset-8 decoration-[#7a582a]">
        Alcides e Mosinho
      </h1>

      <p className="text-xs text-gray-300 mt-4 font-extralight max-w-xl">
        "Nós somos o que repetidamente fazemos. A excelência, portanto, não é um
        feito, mas um hábito."
      </p>
      <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">
        Button
      </button>
    </div>
  );
}
