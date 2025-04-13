import { YoutubeAccount, Video, ChannelStats, AccountSummary } from './types';

// Datos de ejemplo para las cuentas de YouTube
export const accounts: YoutubeAccount[] = [
  {
    id: '1',
    name: 'Canal Automatizado 1',
    email: 'canal1@tudominio.com',
    profileImage: '/avatars/tech.png',
    createdAt: '2022-05-15',
    subscribers: 12500,
    totalViews: 450000,
    totalVideos: 87,
    estimatedRevenue: 1250,
    isActive: true,
  },
  {
    id: '2',
    name: 'Canal Automatizado 2',
    email: 'canal2@tudominio.com',
    profileImage: '/avatars/gaming.png',
    createdAt: '2021-08-22',
    subscribers: 34500,
    totalViews: 1280000,
    totalVideos: 156,
    estimatedRevenue: 3560,
    isActive: true,
  },
  {
    id: '3',
    name: 'Canal Automatizado 3',
    email: 'canal3@tudominio.com',
    profileImage: '/avatars/cooking.png',
    createdAt: '2022-01-10',
    subscribers: 7800,
    totalViews: 210000,
    totalVideos: 45,
    estimatedRevenue: 680,
    isActive: true,
  },
  {
    id: '4',
    name: 'Canal Automatizado 4',
    email: 'canal4@tudominio.com',
    profileImage: '/avatars/travel.png',
    createdAt: '2021-11-05',
    subscribers: 21300,
    totalViews: 570000,
    totalVideos: 68,
    estimatedRevenue: 1890,
    isActive: true,
  },
  {
    id: '5',
    name: 'Canal Automatizado 5',
    email: 'canal5@tudominio.com',
    profileImage: '/avatars/education.png',
    createdAt: '2020-03-28',
    subscribers: 56700,
    totalViews: 1560000,
    totalVideos: 210,
    estimatedRevenue: 4530,
    isActive: false,
  }
];

// Datos de ejemplo para las estadísticas
export const lastWeekStats: ChannelStats[] = [
  { day: 'Lunes', subscribers: 150, views: 2500, revenue: 12 },
  { day: 'Martes', subscribers: 180, views: 2800, revenue: 14.5 },
  { day: 'Miércoles', subscribers: 220, views: 3200, revenue: 18 },
  { day: 'Jueves', subscribers: 190, views: 3000, revenue: 16 },
  { day: 'Viernes', subscribers: 250, views: 3800, revenue: 22 },
  { day: 'Sábado', subscribers: 310, views: 4500, revenue: 31 },
  { day: 'Domingo', subscribers: 280, views: 4200, revenue: 28 },
];

// Resumen de las cuentas
export const accountSummary: AccountSummary = {
  totalAccounts: 5,
  totalSubscribers: 132800,
  totalViews: 4070000,
  totalVideos: 566,
  totalRevenue: 11910
}; 