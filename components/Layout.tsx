import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Calendar, Users, DollarSign, Menu, X, LogOut, Sun, Moon } from 'lucide-react';
import BrandLogo from './BrandLogo';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Layout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', label: 'Agenda', icon: <Calendar size={20} /> },
    { path: '/students', label: 'Alumnos', icon: <Users size={20} /> },
    { path: '/billing', label: 'Facturación', icon: <DollarSign size={20} /> },
  ];

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-900 overflow-hidden transition-colors duration-200">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 dark:bg-slate-950 text-white shadow-xl z-20">
        <div className="p-6 flex flex-col items-center justify-center border-b border-slate-700 bg-slate-950/30">
          {/* Branding Container */}
          <BrandLogo className="w-16 h-16" />
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive || (item.path !== '/' && location.pathname.startsWith(item.path))
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 translate-x-1'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white hover:translate-x-1'
                }`
              }
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700 space-y-2">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-slate-400 hover:bg-slate-800 hover:text-yellow-400 transition-all duration-200"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            <span className="font-medium">{theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-slate-400 hover:bg-red-900/20 hover:text-red-400 transition-all duration-200"
          >
            <LogOut size={20} />
            <span className="font-medium">Cerrar Sesión</span>
          </button>
          <div className="text-[10px] text-center text-slate-600 mt-4">
            v1.5.0 AR
          </div>
        </div>
      </aside>

      {/* Mobile Header & Menu */}
      <div className="md:hidden fixed top-0 w-full bg-slate-900 dark:bg-slate-950 text-white z-50 flex flex-col shadow-lg">
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 text-orange-500 bg-white/10 rounded-full p-1.5">
              {/* Simple Icon for header */}
              <BrandLogo className="w-full h-full" showText={false} />
            </div>
            <div>
              <h1 className="font-black text-xl leading-none tracking-tight">MAURO</h1>
              <p className="text-[9px] text-orange-500 font-bold uppercase tracking-widest">Clases de Manejo</p>
            </div>
          </div>
          <button onClick={toggleMenu} className="p-2 hover:bg-slate-800 rounded-md">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isMobileMenuOpen && (
          <nav className="bg-slate-800 dark:bg-slate-900 border-t border-slate-700 animate-fade-in h-screen pb-20 flex flex-col">
            <div className="flex flex-col items-center justify-center py-8 bg-slate-900/50 gap-4">
              <BrandLogo className="w-16 h-16" />
            </div>
            <div className="flex-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-6 py-5 border-b border-slate-700/50 ${isActive ? 'bg-blue-600 text-white' : 'text-slate-300'
                    }`
                  }
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              ))}
            </div>
            <div className="p-4 border-t border-slate-700 bg-slate-900 dark:bg-slate-950 space-y-2">
              <button
                onClick={() => { toggleTheme(); setIsMobileMenuOpen(false); }}
                className="flex items-center justify-center gap-2 w-full py-3 text-slate-400 font-medium hover:text-yellow-400"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                {theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
              </button>
              <button
                onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }}
                className="flex items-center justify-center gap-2 w-full py-3 text-red-400 font-medium"
              >
                <LogOut size={20} /> Cerrar Sesión
              </button>
            </div>
          </nav>
        )}
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden w-full relative bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
        <div className="md:hidden h-[64px] shrink-0" /> {/* Spacer for mobile header */}
        <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;