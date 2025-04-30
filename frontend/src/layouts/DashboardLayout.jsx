import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../features/Auth/AuthContext";
import { motion } from 'framer-motion';
import { Home, BarChart2, CreditCard, Settings, Menu, X, Bell, User, LogOut } from 'lucide-react';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Accounts', href: '/dashboard/accounts', icon: CreditCard },
    { name: 'Transactions', href: '/dashboard/transactions', icon: BarChart2 },
    { name: 'Goals', href: '/dashboard/goals', icon: Settings },
    { name: 'Budgets', href: '/dashboard/budgets', icon: Settings },
  ];

  const sidebarVariants = {
    open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { x: '-100%', transition: { type: 'spring', stiffness: 300, damping: 30 } }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#f0f9ff] to-[#e0f2fe]">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        className="fixed inset-y-0 left-0 z-30 w-64 bg-gradient-to-b from-[#01332B] to-[#025C4F] shadow-xl"
        initial={false}
        animate={isSidebarOpen ? 'open' : 'closed'}
        variants={sidebarVariants}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-white/10">
          <Link to="/" className="text-xl font-bold text-white">
            Finance Advisor
          </Link>
          <button className="lg:hidden text-white" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                  isActive
                    ? 'bg-white/20 text-white shadow-md'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Logout button */}
        <div className="absolute bottom-0 w-full p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-white/80 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3 " />
            Logout
          </button>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-6 bg-white/80 backdrop-blur-sm border-b border-gray-200">
          <button
            className="lg:hidden text-gray-600 hover:text-gray-900"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-500 rounded-full hover:bg-gray-100 transition-colors">
              <Bell size={20} />
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#01332B] to-[#04B4A0] flex items-center justify-center text-white">
                <User size={16} />
              </div>
              <span className="hidden md:inline-block text-sm font-medium text-gray-700">
                User Name
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-1.5 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors border border-red-100"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-6 border border-gray-200">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
