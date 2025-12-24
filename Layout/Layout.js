import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import { 
  LayoutDashboard, MapPin, AlertTriangle, 
  Wrench, FileText, Settings, Sun, Menu, X 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Layout({ children, currentPageName }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, page: 'Dashboard' },
    { name: 'Sites', icon: MapPin, page: 'Sites' },
    { name: 'Alerts', icon: AlertTriangle, page: 'Alerts' },
    { name: 'Maintenance', icon: Wrench, page: 'Maintenance' },
    { name: 'Reports', icon: FileText, page: 'Reports' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500">
              <Sun className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">SolarSense AI</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-slate-300"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-40 h-screen w-64 
        bg-slate-900/95 backdrop-blur-xl border-r border-slate-800
        transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full p-4">
          {/* Logo */}
          <div className="hidden lg:flex items-center gap-3 mb-8 px-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500">
              <Sun className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">SolarSense AI</h1>
              <p className="text-xs text-slate-400">Predictive Monitoring</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 mt-16 lg:mt-0">
            {navItems.map((item) => {
              const isActive = currentPageName === item.page;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.page}
                  to={createPageUrl(item.page)}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all
                    ${isActive 
                      ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 text-white' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }
                  `}
                >
                  <Icon size={20} className={isActive ? 'text-emerald-400' : ''} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-slate-800 pt-4 mt-4">
            <div className="px-3 py-2 rounded-xl bg-gradient-to-r from-slate-800/50 to-slate-800/30">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs text-emerald-400">System Online</span>
              </div>
              <p className="text-xs text-slate-500">v1.0.0 • Edge + Cloud</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 min-h-screen lg:pt-0 pt-16">
        {children}
      </main>
    </div>
  );
}