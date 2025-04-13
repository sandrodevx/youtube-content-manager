'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { addAccount } from '../../utils/accountStorage';

export default function NewAccountPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  // Estado para formulario
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    channelId: '',
    isAutomated: true,
    description: '',
    content_niche: '',
    upload_frequency: 'weekly',
    profileImage: '/avatars/default.png',
    createdAt: new Date().toISOString().split('T')[0],
    subscribers: 0,
    totalViews: 0,
    totalVideos: 0,
    estimatedRevenue: 0,
    isActive: true
  });

  // Manejar cambios en el formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    // Manejar checkboxes
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Manejar envío de formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Añadir la cuenta al almacenamiento
      addAccount(formData);
      
      // Disparar un evento personalizado para notificar que las cuentas han cambiado
      const event = new Event('accountsUpdated');
      window.dispatchEvent(event);
      
      setTimeout(() => {
        setIsLoading(false);
        alert('Cuenta creada correctamente');
        router.push('/accounts');
      }, 800);
    } catch (error) {
      console.error('Error al crear la cuenta:', error);
      setIsLoading(false);
      alert('Error al crear la cuenta. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="space-y-6 mt-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Añadir Nueva Cuenta</h1>
          <p className="text-gray-500 mt-1">Crea una nueva cuenta de YouTube automatizada</p>
        </div>
        
        <Link href="/accounts" className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          Cancelar
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del canal *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email asociado *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="channelId" className="block text-sm font-medium text-gray-700 mb-1">
                ID del canal de YouTube *
              </label>
              <input
                type="text"
                id="channelId"
                name="channelId"
                value={formData.channelId}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: UC1234567890abcdef"
                required
              />
            </div>
            
            <div>
              <label htmlFor="content_niche" className="block text-sm font-medium text-gray-700 mb-1">
                Nicho de contenido
              </label>
              <select
                id="content_niche"
                name="content_niche"
                value={formData.content_niche}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar...</option>
                <option value="tech">Tecnología</option>
                <option value="gaming">Gaming</option>
                <option value="education">Educación</option>
                <option value="entertainment">Entretenimiento</option>
                <option value="news">Noticias</option>
                <option value="other">Otro</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="upload_frequency" className="block text-sm font-medium text-gray-700 mb-1">
                Frecuencia de subida
              </label>
              <select
                id="upload_frequency"
                name="upload_frequency"
                value={formData.upload_frequency}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="daily">Diaria</option>
                <option value="weekly">Semanal</option>
                <option value="biweekly">Quincenal</option>
                <option value="monthly">Mensual</option>
              </select>
            </div>
            
            {/* Campos adicionales para estadísticas iniciales */}
            <div>
              <label htmlFor="subscribers" className="block text-sm font-medium text-gray-700 mb-1">
                Suscriptores iniciales
              </label>
              <input
                type="number"
                id="subscribers"
                name="subscribers"
                value={formData.subscribers}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>
            
            <div>
              <label htmlFor="totalViews" className="block text-sm font-medium text-gray-700 mb-1">
                Vistas iniciales
              </label>
              <input
                type="number"
                id="totalViews"
                name="totalViews"
                value={formData.totalViews}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Descripción del canal
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe el propósito y contenido del canal"
              />
            </div>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isAutomated"
              name="isAutomated"
              checked={formData.isAutomated}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isAutomated" className="ml-2 block text-sm text-gray-900">
              Este es un canal automatizado
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
              Canal activo
            </label>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 mb-2">¿Qué significa "canal automatizado"?</h3>
            <p className="text-xs text-blue-700">
              Un canal automatizado utiliza herramientas y scripts para generar y publicar contenido regularmente
              sin intervención manual constante. Esto incluye canales que utilizan IA para generar contenido,
              compilaciones automáticas, o sistemas de reprogramación de contenido.
            </p>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={isLoading}
              className={`px-5 py-2.5 rounded-lg ${
                isLoading 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              } transition-colors`}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span>Procesando...</span>
                  <span className="animate-spin">⟳</span>
                </span>
              ) : (
                'Crear cuenta'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 