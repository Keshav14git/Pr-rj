import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Gauge, Building2, Layers3,
  LogOut, ChevronLeft, ChevronRight,
} from 'lucide-react';
import ExperienceDB from '../components/admin/ExperienceDB';
import SectionBuilder from '../components/admin/SectionBuilder';

interface AdminStats {
  totalProjects: number;
  totalExperiences: number;
  totalSections: number;
}

type Module = 'dashboard' | 'experience' | 'builder';

const NAV_ITEMS: { id: Module; label: string; icon: any; description: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Gauge, description: 'Overview & metrics' },
  { id: 'experience', label: 'Experience', icon: Building2, description: 'Timeline manager' },
  { id: 'builder', label: 'Section Builder', icon: Layers3, description: 'Page builder' },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [currentModule, setCurrentModule] = useState<Module>('dashboard');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/portfolio/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
      }
    } catch (err) {
      console.error("Dashboard Stats Error:", err);
    }
  };

  useEffect(() => {
    if (currentModule === 'dashboard') {
      fetchStats();
    }
  }, [currentModule]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/');
  };


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="h-screen w-full bg-white flex font-sans overflow-hidden"
    >
      {/* ── Sidebar ── */}
      <aside
        className={`h-screen sticky top-0 bg-[#FAFAFA] border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out shrink-0 ${
          sidebarCollapsed ? 'w-[72px]' : 'w-[260px]'
        }`}
      >
        {/* Logo / Brand */}
        <div className={`h-16 flex items-center border-b border-gray-200 shrink-0 ${sidebarCollapsed ? 'justify-center px-0' : 'px-5'}`}>
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setCurrentModule('dashboard')}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
              RJ
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-900 leading-tight">Admin Panel</span>
                <span className="text-[10px] text-gray-400">Portfolio CMS</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className={`flex-1 py-4 flex flex-col gap-1 ${sidebarCollapsed ? 'px-2' : 'px-4'}`}>
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = currentModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentModule(item.id)}
                title={sidebarCollapsed ? item.label : undefined}
                className={`group flex items-center justify-between rounded-md transition-none cursor-pointer ${
                  sidebarCollapsed ? 'w-10 h-10 mx-auto justify-center' : 'px-3 py-2.5 w-full'
                } ${
                  isActive
                    ? 'bg-gray-200/50 text-gray-900 font-semibold'
                    : 'bg-transparent text-gray-600 hover:bg-gray-200/30 hover:text-gray-900'
                }`}
              >
                {!sidebarCollapsed ? (
                  <div className="flex items-center gap-3 w-full">
                    <Icon size={18} className="shrink-0" />
                    <div className="flex flex-col items-start gap-0.5 w-full">
                      <span className={`text-[13px] ${isActive ? 'text-gray-900 font-semibold' : 'text-gray-700 font-medium'}`}>
                        {item.label}
                      </span>
                      {item.description && (
                        <span className={`text-[10px] uppercase tracking-wider font-medium ${isActive ? 'text-gray-500' : 'text-gray-400'}`}>
                          {item.description}
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <Icon size={18} className="shrink-0" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom: Collapse toggle + Logout */}
        <div className={`border-t border-gray-200 py-3 flex flex-col gap-1 ${sidebarCollapsed ? 'px-2' : 'px-3'}`}>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`flex items-center gap-2 rounded-md py-2.5 text-gray-500 hover:text-gray-900 hover:bg-gray-200/50 transition-none cursor-pointer ${
              sidebarCollapsed ? 'w-10 justify-center mx-auto' : 'px-3 w-full'
            }`}
          >
            {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            {!sidebarCollapsed && <span className="text-[13px] font-medium">Collapse</span>}
          </button>
          <button
            onClick={handleLogout}
            className={`flex items-center gap-2 rounded-md py-2.5 text-gray-500 hover:text-red-700 hover:bg-red-50 transition-none cursor-pointer ${
              sidebarCollapsed ? 'w-10 justify-center mx-auto' : 'px-3 w-full'
            }`}
          >
            <LogOut size={16} />
            {!sidebarCollapsed && <span className="text-[13px] font-medium">Log out</span>}
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className={`flex-1 flex flex-col h-screen overflow-hidden`}>


        <AnimatePresence mode="wait">
          {currentModule === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex-1 p-8 overflow-y-auto"
            >
              {/* Page Header */}
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
                <p className="text-sm text-gray-500 mt-1">High-level metrics and system status.</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                  { label: 'Total Projects', value: stats?.totalProjects ?? '-' },
                  { label: 'Experience Nodes', value: stats?.totalExperiences ?? '-' },
                  { label: 'Custom Sections', value: stats?.totalSections ?? '-' },
                ].map((stat, i) => {
                  return (
                    <div key={i} className="bg-white border border-gray-200 p-6 flex flex-col justify-between h-36">
                      <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{stat.label}</span>
                      <div className="flex items-end justify-between">
                        <span className="text-4xl font-bold text-gray-900">{stat.value}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Welcome */}
              <div className="bg-white border border-gray-200 p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Welcome back</h2>
                <p className="text-sm font-medium text-gray-600">Select a module from the sidebar to start managing your portfolio.</p>
              </div>
            </motion.div>
          )}



          {currentModule === 'experience' && (
            <motion.div
              key="experience"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex-1 bg-white overflow-hidden"
            >
              <ExperienceDB />
            </motion.div>
          )}

          {currentModule === 'builder' && (
            <motion.div
              key="builder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex-1 overflow-hidden"
            >
              <SectionBuilder />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </motion.div>
  );
};

export default AdminDashboard;
