'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  name: string;
  href: string;
  icon: string;
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: '📊' },
  { name: 'Cuentas', href: '/accounts', icon: '👤' },
  { name: 'Estadísticas', href: '/statistics', icon: '📈' },
  { name: 'Videos', href: '/videos', icon: '🎬' },
  { name: 'Monetización', href: '/monetization', icon: '💰' },
  { name: 'Configuración', href: '/settings', icon: '⚙️' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`bg-gray-900 text-white ${isCollapsed ? 'w-16' : 'w-64'} h-screen transition-all duration-300 fixed top-0 left-0`}>
      <div className="flex justify-between items-center p-4 border-b border-gray-800">
        {!isCollapsed && <h1 className="text-xl font-bold">YouTube Manager</h1>}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-gray-400 hover:text-white"
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>
      <nav className="mt-6">
        <ul>
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center p-4 ${
                  pathname === item.href
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                } transition-colors duration-200`}
              >
                <span className="text-xl mr-3">{item.icon}</span>
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="absolute bottom-0 w-full p-4 border-t border-gray-800">
        {!isCollapsed && (
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-600 text-center flex items-center justify-center mr-2">
              👤
            </div>
            <div>
              <p className="text-sm font-semibold">Usuario</p>
              <p className="text-xs text-gray-400">usuario@example.com</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 