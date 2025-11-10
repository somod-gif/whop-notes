// src/components/Loader.tsx
'use client';

export default function Loader() {
  return (
    <div className="flex justify-center items-center h-full min-h-[200px]">
      <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
    </div>
  );
}
