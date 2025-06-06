"use client";

import React from "react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full flex justify-around py-2 px-5 md:px-2 bg-red-600">
      <div className="flex gap-6 bg-orange-600">
        <Link href="/HomePage">
          <button className="bg-transparent bg-blue-600 font-semibold py-2 px-6 rounded focus:outline-none border-0 transition transform hover:translate-x-2 hover:underline hover:underline-offset-8 hover:decoration-[#7a582a]">
            Home
          </button>
        </Link>
        <Link href="/ChangeWayPage">
          <button className="bg-transparent bg-blue-600 font-semibold py-2 px-6 rounded focus:outline-none border-0 transition transform hover:translate-x-2 hover:underline hover:underline-offset-8 hover:decoration-[#7a582a]">
            Mudar Caminho
          </button>
        </Link>
      </div>
      <div className="flex gap-6 bg-orange-600">
        <Link href="/">
          <h1 className="cursor-pointer text-2xl font-bold text-white text-center underline underline-offset-8 decoration-[#7a582a]">
            Alcides e Mosinho
          </h1>
        </Link>
      </div>
      <div className="flex gap-6 bg-orange-600">
        <Link href="/LoginPage">
          <button className="bg-transparent bg-blue-600 font-semibold py-2 px-6 rounded focus:outline-none border-0 transition transform hover:translate-x-2 hover:underline hover:underline-offset-8 hover:decoration-[#7a582a]">
            Login
          </button>
        </Link>
        <Link href="/LoginPage">
          <button className="bg-transparent bg-blue-600 font-semibold py-2 px-6 rounded focus:outline-none border-0 transition transform hover:translate-x-2 hover:underline hover:underline-offset-8 hover:decoration-[#7a582a]">
            Outros
          </button>
        </Link>
      </div>
    </header>
  );
}
