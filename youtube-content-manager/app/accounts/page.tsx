'use client';

import { useState, useEffect } from 'react';
import AccountList from '../components/AccountList';
import Link from 'next/link';
import { YoutubeAccount, AccountSummary } from '../types';

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<YoutubeAccount[]>([]);
  const [summary, setSummary] = useState<AccountSummary>({
    totalAccounts: 0,
    totalSubscribers: 0,
    totalViews: 0,
    totalVideos: 0,
    totalRevenue: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  // Cargar cuentas desde localStorage al iniciar
  useEffect(() => {
    // Intentar cargar las cuentas desde localStorage
    try {
      const storedAccounts = localStorage.getItem('youtube_accounts');
      if (storedAccounts) {
        const parsedAccounts = JSON.parse(storedAccounts);
        setAccounts(parsedAccounts);
        
        // Calcular resumen
        const accountSummary = {
          totalAccounts: parsedAccounts.length,
          totalSubscribers: parsedAccounts.reduce((sum: number, account: YoutubeAccount) => sum + (account.subscribers || 0), 0),
          totalViews: parsedAccounts.reduce((sum: number, account: YoutubeAccount) => sum + (account.totalViews || 0), 0),
          totalVideos: parsedAccounts.reduce((sum: number, account: YoutubeAccount) => sum + (account.totalVideos || 0), 0),
          totalRevenue: parsedAccounts.reduce((sum: number, account: YoutubeAccount) => sum + (account.estimatedRevenue || 0), 0)
        };
        setSummary(accountSummary);
      } else {
        // Si no hay cuentas en localStorage, usar las de datos iniciales
        import('../data').then(({ accounts: initialAccounts }) => {
          setAccounts(initialAccounts);
          
          // Calcular resumen con los datos iniciales
          const accountSummary = {
            totalAccounts: initialAccounts.length,
            totalSubscribers: initialAccounts.reduce((sum: number, account: YoutubeAccount) => sum + (account.subscribers || 0), 0),
            totalViews: initialAccounts.reduce((sum: number, account: YoutubeAccount) => sum + (account.totalViews || 0), 0),
            totalVideos: initialAccounts.reduce((sum: number, account: YoutubeAccount) => sum + (account.totalVideos || 0), 0),
            totalRevenue: initialAccounts.reduce((sum: number, account: YoutubeAccount) => sum + (account.estimatedRevenue || 0), 0)
          };
          setSummary(accountSummary);
          
          // Guardar los datos iniciales en localStorage para futuros usos
          localStorage.setItem('youtube_accounts', JSON.stringify(initialAccounts));
        });
      }
    } catch (error) {
      console.error('Error al cargar cuentas:', error);
      // En caso de error, cargar los datos iniciales
      import('../data').then(({ accounts: initialAccounts }) => {
        setAccounts(initialAccounts);
      });
    } finally {
      // Desactivar el estado de carga después de procesar los datos
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  }, []);

  return (
    <div className="space-y-6 mt-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cuentas de YouTube</h1>
          <p className="text-gray-500 mt-1">Gestiona todas tus cuentas automatizadas</p>
        </div>
        
        <div className="flex gap-2">
          <Link 
            href="/accounts/import" 
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1"
          >
            <span>🔄</span>
            <span>Importar Cuentas</span>
          </Link>
          <Link 
            href="/accounts/new" 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Añadir Cuenta
          </Link>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600 font-medium">Total Cuentas</p>
            <p className="text-2xl font-bold text-gray-900">{summary.totalAccounts}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600 font-medium">Cuentas Activas</p>
            <p className="text-2xl font-bold text-gray-900">{accounts.filter(a => a.isActive).length}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-red-600 font-medium">Cuentas Inactivas</p>
            <p className="text-2xl font-bold text-gray-900">{accounts.filter(a => !a.isActive).length}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-600 font-medium">Promedio Ingresos</p>
            <p className="text-2xl font-bold text-gray-900">
              ${accounts.length > 0 
                ? Math.round(summary.totalRevenue / accounts.length).toLocaleString() 
                : 0}
            </p>
          </div>
        </div>
        
        <AccountList accounts={accounts} />
      </div>
    </div>
  );
} 