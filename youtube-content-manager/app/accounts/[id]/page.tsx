'use client';

import { useEffect, useState } from 'react';
import { lastWeekStats } from '../../data';
import StatCard from '../../components/StatCard';
import Link from 'next/link';
import { getAccounts, updateAccount } from '../../utils/accountStorage';
import { YoutubeAccount } from '../../types';
import { useRouter } from 'next/navigation';

interface AccountDetailPageProps {
  params: {
    id: string;
  };
}

export default function AccountDetailPage({ params }: AccountDetailPageProps) {
  const router = useRouter();
  const [account, setAccount] = useState<YoutubeAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<YoutubeAccount | null>(null);
  
  useEffect(() => {
    const loadAccount = () => {
      setIsLoading(true);
      const accounts = getAccounts();
      const foundAccount = accounts.find(acc => acc.id === params.id);
      
      setAccount(foundAccount || null);
      setFormData(foundAccount ? { ...foundAccount } : null);
      setIsLoading(false);
    };
    
    loadAccount();
    
    // Escuchar eventos de almacenamiento para actualizar si cambia
    const handleStorageChange = () => {
      loadAccount();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('accountsUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('accountsUpdated', handleStorageChange);
    };
  }, [params.id]);
  
  // Manejar cambios en el formulario de edición
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!formData) return;
    
    const { name, value, type } = e.target as HTMLInputElement;
    
    // Manejar checkboxes
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => prev ? { ...prev, [name]: checked } : null);
    } 
    // Manejar campos numéricos
    else if (type === 'number') {
      setFormData(prev => prev ? { ...prev, [name]: Number(value) } : null);
    }
    // Manejar otros campos
    else {
      setFormData(prev => prev ? { ...prev, [name]: value } : null);
    }
  };
  
  // Guardar cambios
  const handleSave = () => {
    if (!formData) return;
    
    try {
      updateAccount(formData);
      setAccount(formData);
      setIsEditing(false);
      
      // Notificar cambios
      const event = new Event('accountsUpdated');
      window.dispatchEvent(event);
      
      alert('Cuenta actualizada correctamente');
    } catch (error) {
      console.error('Error al actualizar la cuenta:', error);
      alert('Error al actualizar la cuenta');
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <div className="animate-spin text-4xl">⟳</div>
        <p className="mt-4 text-gray-500">Cargando datos de la cuenta...</p>
      </div>
    );
  }
  
  if (!account) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <h1 className="text-2xl font-bold text-gray-800">Cuenta no encontrada</h1>
        <p className="text-gray-500 mt-2">La cuenta que estás buscando no existe</p>
        <Link href="/accounts" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Volver a cuentas
        </Link>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 mt-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            <span className="text-4xl">👤</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{account.name}</h1>
            <p className="text-gray-500">{account.email}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button 
                onClick={handleSave} 
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Guardar
              </button>
              <button 
                onClick={() => {
                  setIsEditing(false);
                  setFormData(account);
                }} 
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setIsEditing(true)} 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Editar
              </button>
              <Link href="/accounts" className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Volver
              </Link>
            </>
          )}
        </div>
      </div>
      
      {/* Detalles y estadísticas */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Suscriptores" 
          value={account.subscribers.toLocaleString()} 
          icon="👥" 
          change={{ value: 12.5, isPositive: true }}
          color="blue"
        />
        <StatCard 
          title="Visualizaciones" 
          value={account.totalViews.toLocaleString()} 
          icon="👁️" 
          change={{ value: 8.3, isPositive: true }}
          color="green"
        />
        <StatCard 
          title="Videos" 
          value={account.totalVideos} 
          icon="🎬" 
          change={{ value: 5.2, isPositive: true }}
          color="purple"
        />
        <StatCard 
          title="Ingresos" 
          value={`$${account.estimatedRevenue.toLocaleString()}`} 
          icon="💰" 
          change={{ value: 15.7, isPositive: true }}
          color="yellow"
        />
      </div>
      
      {isEditing && formData ? (
        /* Formulario de edición */
        <div className="bg-white rounded-lg shadow overflow-hidden p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Editar información de la cuenta</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del canal
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email asociado
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="subscribers" className="block text-sm font-medium text-gray-700 mb-1">
                Suscriptores
              </label>
              <input
                type="number"
                id="subscribers"
                name="subscribers"
                value={formData.subscribers}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>
            
            <div>
              <label htmlFor="totalViews" className="block text-sm font-medium text-gray-700 mb-1">
                Visualizaciones totales
              </label>
              <input
                type="number"
                id="totalViews"
                name="totalViews"
                value={formData.totalViews}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>
            
            <div>
              <label htmlFor="totalVideos" className="block text-sm font-medium text-gray-700 mb-1">
                Total de videos
              </label>
              <input
                type="number"
                id="totalVideos"
                name="totalVideos"
                value={formData.totalVideos}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>
            
            <div>
              <label htmlFor="estimatedRevenue" className="block text-sm font-medium text-gray-700 mb-1">
                Ingresos estimados ($)
              </label>
              <input
                type="number"
                id="estimatedRevenue"
                name="estimatedRevenue"
                value={formData.estimatedRevenue}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                Canal activo
              </label>
            </div>
          </div>
        </div>
      ) : (
        /* Vista de información */
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-medium text-gray-900">Información de la cuenta</h2>
          </div>
          <div className="px-6 py-4">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
              <div>
                <dt className="text-sm font-medium text-gray-500">ID de la cuenta</dt>
                <dd className="mt-1 text-sm text-gray-900">{account.id}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Estado</dt>
                <dd className="mt-1 text-sm">
                  <span className={`px-2 py-1 text-xs rounded-full ${account.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {account.isActive ? 'Activa' : 'Inactiva'}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Fecha de creación</dt>
                <dd className="mt-1 text-sm text-gray-900">{account.createdAt}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">URL del canal</dt>
                <dd className="mt-1 text-sm text-blue-600 hover:underline">
                  <a href={`https://youtube.com/channel/${account.channelId || account.id}`} target="_blank" rel="noopener noreferrer">
                    youtube.com/channel/{account.channelId || account.id}
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      )}
      
      {/* Gráfico de rendimiento */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Rendimiento Semanal</h2>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-md">Suscriptores</button>
            <button className="px-3 py-1 text-sm text-gray-500 hover:bg-gray-50 rounded-md">Visualizaciones</button>
            <button className="px-3 py-1 text-sm text-gray-500 hover:bg-gray-50 rounded-md">Ingresos</button>
          </div>
        </div>
        <div className="p-6">
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Gráfico de Rendimiento</p>
          </div>
        </div>
      </div>
      
      {/* Tabla de estadísticas */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-medium text-gray-900">Estadísticas diarias</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Día
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Suscriptores
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Visualizaciones
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ingresos
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {lastWeekStats.map((stat, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {stat.day}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {Math.round(stat.subscribers * 0.2).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {Math.round(stat.views * 0.2).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${Math.round(stat.revenue * 0.2).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 