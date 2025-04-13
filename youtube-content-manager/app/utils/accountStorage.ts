import { YoutubeAccount } from '../types';
import { accounts as initialAccounts } from '../data';

// Clave para almacenar las cuentas en localStorage
const STORAGE_KEY = 'youtube_accounts';

// Función para obtener todas las cuentas
export const getAccounts = (): YoutubeAccount[] => {
  if (typeof window === 'undefined') {
    return initialAccounts; // Retornar datos iniciales en el servidor
  }

  try {
    const storedAccounts = localStorage.getItem(STORAGE_KEY);
    
    // Si no hay cuentas guardadas, inicializar con los datos de ejemplo
    if (!storedAccounts) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialAccounts));
      return initialAccounts;
    }
    
    return JSON.parse(storedAccounts);
  } catch (error) {
    console.error('Error al obtener cuentas:', error);
    return initialAccounts;
  }
};

// Función para agregar una nueva cuenta
export const addAccount = (account: Omit<YoutubeAccount, 'id'>): YoutubeAccount => {
  const accounts = getAccounts();
  
  // Generar un nuevo ID (mayor que el máximo existente)
  const maxId = accounts.reduce(
    (max, account) => Math.max(max, parseInt(account.id)), 
    0
  );
  
  const newAccount: YoutubeAccount = {
    ...account,
    id: (maxId + 1).toString(),
  };
  
  const updatedAccounts = [...accounts, newAccount];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAccounts));
  
  return newAccount;
};

// Función para actualizar una cuenta existente
export const updateAccount = (account: YoutubeAccount): YoutubeAccount | null => {
  const accounts = getAccounts();
  const index = accounts.findIndex(a => a.id === account.id);
  
  if (index === -1) {
    return null;
  }
  
  accounts[index] = account;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
  
  return account;
};

// Función para eliminar una cuenta
export const deleteAccount = (id: string): boolean => {
  const accounts = getAccounts();
  const updatedAccounts = accounts.filter(account => account.id !== id);
  
  if (updatedAccounts.length === accounts.length) {
    return false; // No se encontró la cuenta para eliminar
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAccounts));
  return true;
};

// Función para obtener estadísticas generales
export const getAccountSummary = () => {
  const accounts = getAccounts();
  
  return {
    totalAccounts: accounts.length,
    totalSubscribers: accounts.reduce((sum, account) => sum + account.subscribers, 0),
    totalViews: accounts.reduce((sum, account) => sum + account.totalViews, 0),
    totalVideos: accounts.reduce((sum, account) => sum + account.totalVideos, 0),
    totalRevenue: accounts.reduce((sum, account) => sum + account.estimatedRevenue, 0),
  };
}; 