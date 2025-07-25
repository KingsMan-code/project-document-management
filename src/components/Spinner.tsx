"use client";

export default function Spinner() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className="w-20 h-20 rounded-full animate-spin"
        style={{
          boxSizing: 'border-box',
          border: '10px solid rgba(236, 196, 64, 0.2)',
          borderTopColor: '#ECC440',
        }}
      />
    </div>
  );
}
