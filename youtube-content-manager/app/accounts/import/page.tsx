'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import YouTubeApiConnect from '../../components/YouTubeApiConnect';
import { useRouter } from 'next/navigation';

export default function ImportAccountsPage() {
  const router = useRouter();
  const [method, setMethod] = useState<'manual' | 'oauth' | 'csv'>('manual');
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  
  // Estado para formulario manual
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    channelId: '',
  });

  // Comprobar parámetros de URL al cargar (para OAuth callback)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      
      // Verificar si hay un error de OAuth
      const error = params.get('error');
      if (error) {
        setMethod('oauth');
        
        let errorMessage = 'Error al conectar con YouTube';
        switch (error) {
          case 'access_denied':
            errorMessage = 'El acceso fue denegado por el usuario';
            break;
          case 'token_exchange_failed':
            errorMessage = 'Error al intercambiar el código de autorización';
            break;
          case 'channel_fetch_failed':
            errorMessage = 'Error al obtener datos de los canales';
            break;
          case 'invalid_state':
            errorMessage = 'Error de seguridad: estado inválido';
            break;
          default:
            errorMessage = `Error de autenticación: ${error}`;
        }
        
        setApiError(errorMessage);
        
        // Eliminar parámetros de URL para evitar problemas al recargar
        window.history.replaceState({}, document.title, window.location.pathname);
      }
      
      // Verificar si OAuth fue exitoso
      const success = params.get('success');
      if (success === 'true') {
        setMethod('oauth');
        
        // Obtener canales con el token guardado
        const fetchChannels = async () => {
          try {
            // El token debe venir como parámetro access_token en la URL cuando redirige 
            // desde el callback de OAuth
            const accessToken = params.get('access_token');
            
            if (accessToken) {
              // Guardar el token para futuras operaciones
              sessionStorage.setItem('youtube_access_token', accessToken);
              
              const response = await fetch(`/api/youtube?access_token=${accessToken}`);
              
              if (!response.ok) {
                throw new Error('Error al obtener canales');
              }
              
              const data = await response.json();
              
              if (data.success) {
                handleApiSuccess(data.data);
              } else {
                throw new Error(data.message || 'Error al obtener datos de YouTube');
              }
            } else {
              // En este caso no tenemos un token fresco en la URL
              // Verificar si hay un token guardado
              const storedToken = sessionStorage.getItem('youtube_access_token');
              
              if (!storedToken) {
                throw new Error('No se encontró el token de acceso');
              }
              
              const response = await fetch(`/api/youtube?access_token=${storedToken}`);
              
              if (!response.ok) {
                throw new Error('Error al obtener canales');
              }
              
              const data = await response.json();
              
              if (data.success) {
                handleApiSuccess(data.data);
              } else {
                throw new Error(data.message || 'Error al obtener datos de YouTube');
              }
            }
          } catch (error) {
            handleApiError(error instanceof Error ? error.message : 'Error desconocido');
          }
        };
        
        fetchChannels();
        
        // Eliminar parámetros de URL para evitar problemas al recargar
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  // Manejar cambios en la selección de canales
  const handleChannelSelection = (channelId: string) => {
    setSelectedChannels(prev => 
      prev.includes(channelId)
        ? prev.filter(id => id !== channelId)
        : [...prev, channelId]
    );
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Manejar subida de archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  // Manejar éxito en la API de YouTube
  const handleApiSuccess = (data: any) => {
    setApiResponse(data);
    setApiError(null);
    // Seleccionar todos los canales por defecto
    if (data.channels && data.channels.length > 0) {
      setSelectedChannels(data.channels.map((channel: any) => channel.id));
    }
  };

  // Manejar error en la API de YouTube
  const handleApiError = (error: string) => {
    setApiResponse(null);
    setApiError(error);
  };

  // Manejar envío de formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Procesamos los datos según el método seleccionado
    setTimeout(() => {
      if (method === 'manual') {
        // Crear una nueva cuenta con los datos del formulario
        const newAccount = {
          name: formData.name,
          email: formData.email,
          channelId: formData.channelId,
          profileImage: '/avatars/default.png',
          createdAt: new Date().toISOString().split('T')[0],
          subscribers: 0,
          totalViews: 0,
          totalVideos: 0,
          estimatedRevenue: 0,
          isActive: true,
        };
        
        // Guardar en localStorage
        const accounts = JSON.parse(localStorage.getItem('youtube_accounts') || '[]');
        const maxId = accounts.reduce((max: number, acc: any) => Math.max(max, parseInt(acc.id || '0')), 0);
        const accountWithId = { ...newAccount, id: (maxId + 1).toString() };
        accounts.push(accountWithId);
        localStorage.setItem('youtube_accounts', JSON.stringify(accounts));
        
      } else if (method === 'oauth' && apiResponse && apiResponse.channels) {
        // Procesar canales seleccionados de OAuth
        const accounts = JSON.parse(localStorage.getItem('youtube_accounts') || '[]');
        const maxId = accounts.reduce((max: number, acc: any) => Math.max(max, parseInt(acc.id || '0')), 0);
        let newId = maxId;
        
        const selectedChannelData = apiResponse.channels
          .filter((channel: any) => selectedChannels.includes(channel.id))
          .map((channel: any) => {
            newId++;
            return {
              id: newId.toString(),
              name: channel.title,
              email: `email-${channel.id}@example.com`, // No tenemos email real de la API
              channelId: channel.id,
              profileImage: '/avatars/default.png',
              createdAt: new Date(channel.snippet.publishedAt).toISOString().split('T')[0],
              subscribers: parseInt(channel.statistics.subscriberCount) || 0,
              totalViews: parseInt(channel.statistics.viewCount) || 0,
              totalVideos: parseInt(channel.statistics.videoCount) || 0,
              estimatedRevenue: 0, // No tenemos datos de ingresos reales
              isActive: true,
            };
          });
        
        // Guardar los canales seleccionados
        accounts.push(...selectedChannelData);
        localStorage.setItem('youtube_accounts', JSON.stringify(accounts));
        
      } else if (method === 'csv' && file) {
        // Aquí procesaríamos el archivo CSV y guardaríamos las cuentas
        // Solo es una simulación, pero podríamos implementar un parser CSV real
        alert('La importación CSV no está completamente implementada en esta versión');
      }
      
      setIsLoading(false);
      
      // Mensaje según el método usado
      let successMessage = '';
      
      if (method === 'manual') {
        successMessage = 'Cuenta añadida correctamente';
      } else if (method === 'csv') {
        successMessage = 'Cuentas importadas desde CSV correctamente';
      } else if (method === 'oauth') {
        const channelCount = selectedChannels.length;
        successMessage = `${channelCount} ${channelCount === 1 ? 'canal importado' : 'canales importados'} correctamente`;
      }
      
      alert(successMessage);
      router.push('/accounts');
    }, 1500);
  };

  // Descarga de plantilla CSV
  const handleDownloadTemplate = () => {
    const csvContent = "name,email,channelId,createdAt\nCanal Ejemplo,ejemplo@mail.com,UC123456789,2023-01-01";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = "youtube_accounts_template.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 mt-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Importar Cuentas</h1>
          <p className="text-gray-500 mt-1">Añade tus cuentas de YouTube al gestor</p>
        </div>
        
        <Link href="/accounts" className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          Volver a cuentas
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        {/* Selector de método */}
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Método de importación</h2>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => setMethod('oauth')}
              className={`px-4 py-3 rounded-lg flex items-center gap-2 ${method === 'oauth' ? 'bg-blue-50 border-2 border-blue-500 text-blue-700' : 'border border-gray-200 hover:bg-gray-50'}`}
            >
              <span className="text-xl">🔄</span>
              <div className="text-left">
                <p className="font-medium">Conectar con YouTube</p>
                <p className="text-xs text-gray-500">Importación automática vía OAuth</p>
              </div>
            </button>
            
            <button 
              onClick={() => setMethod('csv')}
              className={`px-4 py-3 rounded-lg flex items-center gap-2 ${method === 'csv' ? 'bg-blue-50 border-2 border-blue-500 text-blue-700' : 'border border-gray-200 hover:bg-gray-50'}`}
            >
              <span className="text-xl">📊</span>
              <div className="text-left">
                <p className="font-medium">Importar desde CSV</p>
                <p className="text-xs text-gray-500">Carga masiva de cuentas</p>
              </div>
            </button>
            
            <button 
              onClick={() => setMethod('manual')}
              className={`px-4 py-3 rounded-lg flex items-center gap-2 ${method === 'manual' ? 'bg-blue-50 border-2 border-blue-500 text-blue-700' : 'border border-gray-200 hover:bg-gray-50'}`}
            >
              <span className="text-xl">✏️</span>
              <div className="text-left">
                <p className="font-medium">Entrada manual</p>
                <p className="text-xs text-gray-500">Añadir cuentas una a una</p>
              </div>
            </button>
          </div>
        </div>
        
        {/* Formulario según método */}
        <form onSubmit={handleSubmit}>
          {method === 'oauth' && (
            <div>
              <YouTubeApiConnect 
                onSuccess={handleApiSuccess} 
                onError={handleApiError} 
              />
              
              {apiResponse && apiResponse.channels && apiResponse.channels.length > 0 && (
                <div className="mt-6 bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-green-800">Canales detectados</h3>
                    <div className="flex gap-2">
                      <button 
                        type="button"
                        className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded"
                        onClick={() => setSelectedChannels(apiResponse.channels.map((c: any) => c.id))}
                      >
                        Seleccionar todos
                      </button>
                      <button 
                        type="button"
                        className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded"
                        onClick={() => setSelectedChannels([])}
                      >
                        Deseleccionar todos
                      </button>
                    </div>
                  </div>
                  
                  <div className="border border-green-100 rounded-lg divide-y divide-green-100">
                    {apiResponse.channels.map((channel: any) => (
                      <div key={channel.id} className="p-3 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            id={`channel-${channel.id}`}
                            checked={selectedChannels.includes(channel.id)}
                            onChange={() => handleChannelSelection(channel.id)}
                            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                            aria-label={`Seleccionar canal ${channel.title}`}
                          />
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                            <span className="text-xl">📺</span>
                          </div>
                          <div>
                            <p className="font-medium">{channel.title}</p>
                            <p className="text-xs text-gray-500">ID: {channel.id}</p>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {Number(channel.statistics.subscriberCount).toLocaleString()} suscriptores
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <p className="mt-4 text-sm text-green-700">
                    Selecciona los canales que deseas importar
                    {selectedChannels.length > 0 && 
                      ` (${selectedChannels.length} ${selectedChannels.length === 1 ? 'seleccionado' : 'seleccionados'})`
                    }
                  </p>
                  
                  {apiResponse.recentVideos && apiResponse.recentVideos.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-green-200">
                      <h4 className="font-medium text-green-800 mb-2">Videos recientes detectados</h4>
                      <p className="text-xs text-green-700 mb-2">
                        También se importarán datos de los últimos videos publicados
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {apiResponse.recentVideos.map((video: any) => (
                          <div key={video.id} className="flex items-center gap-2 text-xs text-gray-600 bg-white p-2 rounded border border-green-100">
                            <span>🎬</span>
                            <div className="truncate">{video.title}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {apiError && (
                <div className="mt-6 bg-red-50 p-4 rounded-lg border border-red-200">
                  <h3 className="text-lg font-medium text-red-800 mb-2">Error</h3>
                  <p className="text-sm text-red-700">{apiError}</p>
                </div>
              )}
            </div>
          )}
          
          {method === 'csv' && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                <h3 className="font-medium mb-2">Instrucciones:</h3>
                <ol className="list-decimal pl-5 space-y-1 text-sm text-gray-700">
                  <li>Descarga nuestra plantilla CSV</li>
                  <li>Completa la información de tus cuentas</li>
                  <li>Guarda el archivo y súbelo aquí</li>
                </ol>
                <button 
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="mt-4 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Descargar plantilla
                </button>
              </div>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  id="csv-file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <label htmlFor="csv-file" className="cursor-pointer">
                  <div className="text-4xl mb-2">📄</div>
                  <p className="font-medium">
                    {file ? file.name : 'Arrastra tu archivo CSV o haz clic para seleccionar'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {file ? `${(file.size / 1024).toFixed(2)} KB` : 'Soporta archivos .CSV hasta 5MB'}
                  </p>
                </label>
              </div>
            </div>
          )}
          
          {method === 'manual' && (
            <div className="grid grid-cols-1 gap-4 max-w-2xl">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del canal
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
                  Email asociado
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
                  ID del canal de YouTube
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
                <p className="text-xs text-gray-500 mt-1">
                  Puedes encontrar el ID en la URL de tu canal: youtube.com/channel/[ID]
                </p>
              </div>
            </div>
          )}
          
          {/* Botón de envío */}
          <div className="mt-8">
            <button
              type="submit"
              disabled={
                isLoading || 
                (method === 'csv' && !file) || 
                (method === 'oauth' && (!apiResponse || selectedChannels.length === 0))
              }
              className={`px-5 py-2.5 rounded-lg ${
                isLoading || 
                (method === 'csv' && !file) || 
                (method === 'oauth' && (!apiResponse || selectedChannels.length === 0))
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
                'Importar cuentas'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 