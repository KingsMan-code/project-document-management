"use client";

export default function Spinner() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="h-16 w-16 border-4 border-yellow border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
