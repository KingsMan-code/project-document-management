'use client';

import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/');
  };

  return (
    <header className="bg-primary shadow-lg border-b-4 border-yellow">
      <div className="container mx-auto px-4 py-3">
        <div
          className="flex items-center justify-center cursor-pointer"
          onClick={handleClick}
        >
          <h1 className="text-xl font-bold text-white">
            Juris Portal
          </h1>
        </div>
      </div>
    </header>
  );
}
