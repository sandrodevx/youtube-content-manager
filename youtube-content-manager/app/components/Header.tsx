'use client';

import { useState } from 'react';

export default function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementar búsqueda
    console.log('Buscando:', searchTerm);
  };

  return (
    <header className="bg-white shadow-sm px-6 py-3 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-semibold text-gray-800">YouTube Content Manager</h1>
        <p className="text-sm text-gray-500">Gestiona tus canales de YouTube en un solo lugar</p>
      </div>
      
      <div className="flex items-center gap-4">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar contenido..."
            className="px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button 
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            🔍
          </button>
        </form>
        
        <div className="flex items-center gap-3">
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
            🔔
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
            ⚙️
          </button>
        </div>
      </div>
    </header>
  );
} 