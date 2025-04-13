import StatCard from './components/StatCard';
import AccountList from './components/AccountList';
import { accounts, accountSummary, lastWeekStats } from './data';

export default function Home() {
  return (
    <div className="space-y-6 mt-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Resumen general de tus cuentas de YouTube</p>
      </div>
      
      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Cuentas" 
          value={accountSummary.totalAccounts} 
          icon="👤" 
          color="blue"
        />
        <StatCard 
          title="Total Suscriptores" 
          value={accountSummary.totalSubscribers.toLocaleString()} 
          icon="📊" 
          change={{ value: 12.5, isPositive: true }}
          color="green"
        />
        <StatCard 
          title="Total Vistas" 
          value={accountSummary.totalViews.toLocaleString()} 
          icon="👁️" 
          change={{ value: 8.3, isPositive: true }}
          color="purple"
        />
        <StatCard 
          title="Ingresos Totales" 
          value={`$${accountSummary.totalRevenue.toLocaleString()}`} 
          icon="💰" 
          change={{ value: 15.7, isPositive: true }}
          color="yellow"
        />
      </div>
      
      {/* Gráfica y lista de cuentas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Rendimiento Semanal</h2>
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500">Gráfico de Rendimiento</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Publicaciones Recientes</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <p className="text-sm font-medium">Video Title #{item}</p>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Hace 2 días</span>
                  <span>1.2K vistas</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Lista de cuentas */}
      <div className="mt-6">
        <AccountList accounts={accounts} />
      </div>
    </div>
  );
}
