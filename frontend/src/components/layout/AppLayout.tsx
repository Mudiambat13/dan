import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, BookOpen, PlusCircle, List,
  LogOut, Menu, X, Sparkles, GraduationCap, ChevronRight
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
  { to: '/create', icon: PlusCircle, label: 'Nouveau plan' },
  { to: '/plans', icon: List, label: 'Mes plans' },
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-surface-700/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/30">
            <Sparkles size={18} className="text-white" />
          </div>
          <div>
            <span className="font-display text-xl font-bold text-white">DAN</span>
            <p className="text-[10px] text-surface-400 -mt-0.5 font-mono uppercase tracking-widest">Pédagogique IA</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-brand-500/15 text-brand-400 border border-brand-500/25'
                  : 'text-surface-400 hover:text-surface-100 hover:bg-surface-700/50'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className={isActive ? 'text-brand-400' : 'text-surface-500 group-hover:text-surface-300'} />
                <span>{label}</span>
                {isActive && <ChevronRight size={14} className="ml-auto text-brand-400/60" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="px-3 pb-5 border-t border-surface-700/50 pt-4 space-y-2">
        <div className="px-4 py-3 rounded-xl bg-surface-700/40 border border-surface-700/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <GraduationCap size={15} className="text-brand-400" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-surface-100 truncate">{user?.first_name} {user?.last_name}</p>
              <p className="text-xs text-surface-400 truncate">{user?.email}</p>
            </div>
          </div>
          {user?.school && (
            <p className="text-xs text-surface-500 mt-1.5 pl-11 truncate">{user.school}</p>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-surface-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut size={16} />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface-950 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 bg-surface-900 border-r border-surface-700/50 flex-col fixed h-full z-20">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-30" onClick={() => setSidebarOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <aside className="absolute left-0 top-0 h-full w-64 bg-surface-900 border-r border-surface-700/50 flex flex-col animate-slide-up">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <div className="hidden lg:flex items-center justify-between px-8 py-4 border-b border-surface-700/50 bg-surface-900/90 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-surface-800 border border-surface-700 flex items-center justify-center">
              <Sparkles size={20} className="text-brand-400" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-surface-500 mb-1">Espace enseignant</p>
              <p className="text-base font-semibold text-white">DAN — Assistant pédagogique</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden xl:flex flex-col text-right">
              <span className="text-sm font-medium text-white">{user?.first_name} {user?.last_name}</span>
              <span className="text-xs text-surface-500">{user?.email}</span>
            </div>
            <button onClick={handleLogout} className="btn-secondary px-4 py-2 text-sm gap-2">
              <LogOut size={16} />
              Déconnexion
            </button>
          </div>
        </div>

        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between px-4 py-4 border-b border-surface-700/50 bg-surface-900">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center">
              <Sparkles size={14} className="text-white" />
            </div>
            <span className="font-display text-lg font-bold text-white">DAN</span>
          </div>
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-surface-400 hover:text-white">
            <Menu size={20} />
          </button>
        </div>

        <div className="flex-1 p-4 lg:p-8 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
