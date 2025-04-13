'use client';

import { useState } from 'react';
import { YoutubeAccount } from '../types';
import Link from 'next/link';
import { deleteAccount, updateAccount } from '../utils/accountStorage';

interface AccountListProps {
  accounts: YoutubeAccount[];
}

export default function AccountList({ accounts }: AccountListProps) {
  const [filter, setFilter] = useState('all');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  
  const filteredAccounts = filter === 'all' 
    ? accounts 
    : accounts.filter(account => filter === 'active' ? account.isActive : !account.isActive);

  // Manejar eliminación de cuenta
  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta cuenta?')) {
      setIsDeleting(id);
      
      try {
        const success = deleteAccount(id);
        
        if (success) {
          // Disparar evento para notificar el cambio
          const event = new Event('accountsUpdated');
          window.dispatchEvent(event);
          alert('Cuenta eliminada correctamente');
        } else {
          alert('No se pudo eliminar la cuenta');
        }
      } catch (error) {
        console.error('Error al eliminar la cuenta:', error);
        alert('Error al eliminar la cuenta');
      } finally {
        setIsDeleting(null);
      }
    }
  };

  // Manejar cambio de estado activo/inactivo
  const handleToggleActive = (account: YoutubeAccount) => {
    setIsUpdating(account.id);
    
    try {
      const updatedAccount = { ...account, isActive: !account.isActive };
      updateAccount(updatedAccount);
      
      // Disparar evento para notificar el cambio
      const event = new Event('accountsUpdated');
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Error al actualizar la cuenta:', error);
      alert('Error al actualizar la cuenta');
    } finally {
      setIsUpdating(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="border-b border-gray-200 p-4 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Cuentas de YouTube</h2>
        <div className="flex space-x-2">
          <button 
            className={`px-3 py-1 text-sm rounded-md ${filter === 'all' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
            onClick={() => setFilter('all')}
          >
            Todas
          </button>
          <button 
            className={`px-3 py-1 text-sm rounded-md ${filter === 'active' ? 'bg-green-50 text-green-600' : 'text-gray-500 hover:bg-gray-50'}`}
            onClick={() => setFilter('active')}
          >
            Activas
          </button>
          <button 
            className={`px-3 py-1 text-sm rounded-md ${filter === 'inactive' ? 'bg-red-50 text-red-600' : 'text-gray-500 hover:bg-gray-50'}`}
            onClick={() => setFilter('inactive')}
          >
            Inactivas
          </button>
        </div>
      </div>
      
      {filteredAccounts.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          No se encontraron cuentas con el filtro seleccionado.
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {filteredAccounts.map(account => (
            <li key={account.id} className="hover:bg-gray-50 relative">
              <div className="block p-1">
                <div className="px-6 py-4 flex items-center">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    <span className="text-2xl">👤</span>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <Link href={`/accounts/${account.id}`} className="text-sm font-medium text-gray-900 hover:text-blue-600">
                        {account.name}
                      </Link>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleActive(account)}
                          disabled={isUpdating === account.id}
                          className={`px-2 py-1 text-xs rounded-full transition-colors ${
                            account.isActive 
                              ? 'bg-green-100 text-green-800 hover:bg-red-100 hover:text-red-800' 
                              : 'bg-red-100 text-red-800 hover:bg-green-100 hover:text-green-800'
                          }`}
                        >
                          {isUpdating === account.id ? (
                            <span className="animate-pulse">Actualizando...</span>
                          ) : (
                            account.isActive ? 'Activa' : 'Inactiva'
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(account.id)}
                          disabled={isDeleting === account.id}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          title="Eliminar cuenta"
                        >
                          {isDeleting === account.id ? '⟳' : '🗑️'}
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">{account.email}</p>
                    <div className="mt-1 flex space-x-4 text-xs text-gray-500">
                      <span>{account.subscribers.toLocaleString()} suscriptores</span>
                      <span>{account.totalVideos} videos</span>
                      <span>{account.totalViews.toLocaleString()} vistas</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-semibold text-gray-900">${account.estimatedRevenue.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Ingresos estimados</p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 