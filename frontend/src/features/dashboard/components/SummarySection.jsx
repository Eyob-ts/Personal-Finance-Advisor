import { useQuery } from '@tanstack/react-query';
import { getFinancialSummary } from '../dashboardApi';
import { DollarSign, TrendingUp, ArrowDownRight, PiggyBank } from 'lucide-react';
import { motion } from 'framer-motion';

const SummaryCard = ({ title, value, icon: Icon, isPositive, change }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="glass-panel rounded-xl p-6 border border-teal-800/50 hover:border-teal-400/30 transition-all relative overflow-hidden"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    {/* Holographic accent */}
    <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-teal-400/50 to-transparent"></div>

    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs text-teal-300/80 font-rajdhani uppercase tracking-wider mb-1">
          {title}
        </p>
        <h3 className="text-2xl font-bold font-orbitron text-teal-100">
          {value}
        </h3>
        {change && (
          <p className={`text-xs mt-2 font-rajdhani ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? '↑' : '↓'} <span className="text-teal-300/70">{change}</span>
          </p>
        )}
      </div>
      <div className={`p-3 rounded-lg ${isPositive ? 'bg-green-900/30' : 'bg-red-900/30'} border ${isPositive ? 'border-green-500/30' : 'border-red-500/30'}`}>
        <Icon className={`w-5 h-5 ${isPositive ? 'text-green-400' : 'text-red-400'}`} />
      </div>
    </div>
  </motion.div>
);

const SummarySection = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['financialSummary'],
    queryFn: getFinancialSummary
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="glass-panel rounded-xl p-6 border border-teal-800/50"
          >
            <div className="h-4 bg-teal-900/50 rounded-full w-1/2 mb-4 animate-pulse"></div>
            <div className="h-8 bg-teal-900/50 rounded-full w-3/4 animate-pulse"></div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-red-900/30 text-red-400 p-4 rounded-lg border border-red-500/30 font-rajdhani"
      >
        SYSTEM ALERT: Failed to load financial data ({error.message})
      </motion.div>
    );
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 2
    }).format(value || 0);
  };

  const calculateSavingsRate = (income, expense) => {
    if (!income) return 0;
    return ((income - expense) / income) * 100;
  };

  const savingsRate = calculateSavingsRate(data?.monthly_income, data?.monthly_expense);
  const isSavingsPositive = savingsRate > 0;

  const cards = [
    {
      title: 'Total Assets',
      value: formatCurrency(data?.balance),
      icon: DollarSign,
      isPositive: true,
      change: 'All accounts'
    },
    {
      title: 'Monthly Income',
      value: formatCurrency(data?.monthly_income),
      icon: TrendingUp,
      isPositive: true,
      change: 'Current cycle'
    },
    {
      title: 'Monthly Outflow',
      value: formatCurrency(data?.monthly_expense),
      icon: ArrowDownRight,
      isPositive: false,
      change: 'Current cycle'
    },
    {
      title: 'Savings Rate',
      value: `${Math.abs(savingsRate).toFixed(1)}%`,
      icon: PiggyBank,
      isPositive: isSavingsPositive,
      change: isSavingsPositive ? 'Optimal' : 'Review'
    }
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center mb-6">
        <div className="w-1 h-8 bg-teal-400 mr-3 rounded-full"></div>
        <h2 className="text-xl font-bold font-orbitron text-teal-100 tracking-wider">
          FINANCIAL DASHBOARD
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <SummaryCard
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon}
            isPositive={card.isPositive}
            change={card.change}
          />
        ))}
      </div>

      {/* System status bar */}
      <div className="mt-6 text-xs text-teal-500/50 font-rajdhani tracking-wider">
        <p>LAST UPDATED: {new Date().toLocaleString()} | DATA SOURCE: PRIMARY LEDGER</p>
      </div>
    </div>
  );
};

export default SummarySection;
