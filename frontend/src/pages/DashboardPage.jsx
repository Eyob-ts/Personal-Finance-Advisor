import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import SummarySection from '../components/dashboard/SummarySection';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import SpendingByCategory from '../components/dashboard/SpendingByCategory';
import MonthlyTrend from '../components/dashboard/MonthlyTrend';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import dashboardApi from '../services/dashboardApi';
import authService from '../services/authService';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('summary');
  const navigate = useNavigate();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
    }
  }, [navigate]);

  // Fetch dashboard data using React Query
  const { data: summaryData, isLoading: summaryLoading, error: summaryError } = useQuery({
    queryKey: ['dashboardSummary'],
    queryFn: dashboardApi.getSummary,
    retry: false,
    enabled: authService.isAuthenticated(),
    onError: (error) => {
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  });

  const { data: recentData, isLoading: recentLoading, error: recentError } = useQuery({
    queryKey: ['recentTransactions'],
    queryFn: dashboardApi.getRecentTransactions,
    retry: false,
    enabled: authService.isAuthenticated(),
    onError: (error) => {
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  });

  const { data: categoryData, isLoading: categoryLoading, error: categoryError } = useQuery({
    queryKey: ['spendingByCategory'],
    queryFn: dashboardApi.getSpendingByCategory,
    retry: false,
    enabled: authService.isAuthenticated(),
    onError: (error) => {
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  });

  const { data: trendData, isLoading: trendLoading, error: trendError } = useQuery({
    queryKey: ['monthlyTrend'],
    queryFn: dashboardApi.getMonthlyTrend,
    retry: false,
    enabled: authService.isAuthenticated(),
    onError: (error) => {
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <DashboardLayout>
      <motion.div
        className="p-4 md:p-6 lg:p-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h1
          className="text-2xl md:text-3xl font-bold mb-6"
          variants={itemVariants}
        >
          Financial Dashboard
        </motion.h1>

        {/* Tab Navigation */}
        <motion.div
          className="flex flex-wrap gap-2 mb-6"
          variants={itemVariants}
        >
          {['summary', 'recent', 'categories', 'trends'].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === tab
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </motion.div>

        {/* Content Sections */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'summary' && (
            summaryLoading ? (
              <LoadingSpinner />
            ) : summaryError ? (
              <ErrorMessage message="Failed to load summary data" />
            ) : (
              <SummarySection data={summaryData} />
            )
          )}

          {activeTab === 'recent' && (
            recentLoading ? (
              <LoadingSpinner />
            ) : recentError ? (
              <ErrorMessage message="Failed to load recent transactions" />
            ) : (
              <RecentTransactions data={recentData} />
            )
          )}

          {activeTab === 'categories' && (
            categoryLoading ? (
              <LoadingSpinner />
            ) : categoryError ? (
              <ErrorMessage message="Failed to load category data" />
            ) : (
              <SpendingByCategory data={categoryData} />
            )
          )}

          {activeTab === 'trends' && (
            trendLoading ? (
              <LoadingSpinner />
            ) : trendError ? (
              <ErrorMessage message="Failed to load trend data" />
            ) : (
              <MonthlyTrend data={trendData} />
            )
          )}
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default DashboardPage;
