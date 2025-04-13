'use client';

import { useState } from 'react';
import { accounts, lastWeekStats } from '../data';

const metrics = [
  { id: 'subscribers', name: 'Suscriptores', color: 'text-blue-600' },
  { id: 'views', name: 'Visualizaciones', color: 'text-green-600' },
  { id: 'revenue', name: 'Ingresos', color: 'text-yellow-600' }
];

const periods = [
  { id: 'week', name: 'Última Semana' },
  { id: 'month', name: 'Último Mes' },
  { id: 'quarter', name: 'Último Trimestre' },
  { id: 'year', name: 'Último Año' }
];

export default function StatisticsPage() {
  const [selectedAccount, setSelectedAccount] = useState('all');
  const [selectedMetric, setSelectedMetric] = useState('subscribers');
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  
  return (
    <div className="space-y-6 mt-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Estadísticas</h1>
        <p className="text-gray-500 mt-1">Rendimiento general y métricas detalladas</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="account" className="block text-sm font-medium text-gray-700 mb-1">Cuenta</label>
              <select 
                id="account"
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="all">Todas las cuentas</option>
                {accounts.map(account => (
                  <option key={account.id} value={account.id}>{account.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="metric" className="block text-sm font-medium text-gray-700 mb-1">Métrica</label>
              <select 
                id="metric"
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {metrics.map(metric => (
                  <option key={metric.id} value={metric.id}>{metric.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="period" className="block text-sm font-medium text-gray-700 mb-1">Periodo</label>
              <select 
                id="period"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {periods.map(period => (
                  <option key={period.id} value={period.id}>{period.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Exportar datos
          </button>
        </div>
        
        {/* Gráfico de estadísticas */}
        <div className="bg-gray-50 rounded-lg p-6 h-80 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-medium text-gray-800">Gráfico de {metrics.find(m => m.id === selectedMetric)?.name}</p>
            <p className="text-sm text-gray-500">
              {selectedAccount === 'all' 
                ? 'Todas las cuentas' 
                : accounts.find(a => a.id === selectedAccount)?.name}
            </p>
            <p className="mt-2 text-xs text-gray-400">Para {periods.find(p => p.id === selectedPeriod)?.name.toLowerCase()}</p>
          </div>
        </div>
        
        {/* Tabla de datos */}
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Datos detallados</h3>
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
                      {stat.subscribers.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {stat.views.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${stat.revenue.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 