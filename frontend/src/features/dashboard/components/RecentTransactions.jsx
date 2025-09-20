import { useQuery } from '@tanstack/react-query';
import { getRecentTransactions } from '../dashboardApi';
import { ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const TransactionRow = ({ transaction, index }) => {
  const isIncome = transaction.type === 'income';
  const Icon = isIncome ? ArrowUpRight : ArrowDownRight;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 2
    }).format(value || 0);
  };

  const formatDate = (dateString) => {
    try {
      let date = new Date(dateString);
      if (isNaN(date.getTime()) && typeof dateString === 'string') {
        const parts = dateString.split(' ');
        if (parts.length === 2) {
          const [datePart, timePart] = parts;
          const [year, month, day] = datePart.split('-');
          const [hour, minute, second] = timePart.split(':');
          date = new Date(year, month - 1, day, hour, minute, second);
        }
      }

      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        });
      }
      return '-';
    } catch (error) {
      return '-';
    }
  };

  return (
    <motion.tr
      className="border-b border-teal-800/30 last:border-b-0 hover:bg-teal-900/10 transition-colors duration-200"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <td className="py-4 px-3 whitespace-nowrap">
        <div className="flex items-center">
          <div className={`p-2 rounded-lg ${isIncome ? 'bg-teal-900/30 text-teal-300 border border-teal-400/30' : 'bg-red-900/30 text-red-300 border border-red-400/30'}`}>
            <Icon className={`w-4 h-4 ${isIncome ? 'text-teal-400' : 'text-red-400'}`} />
          </div>
          <div className="ml-4">
            <p className="font-rajdhani text-teal-100 text-sm line-clamp-1">{transaction.description}</p>
            <p className="text-xs text-teal-500/80 font-rajdhani">{transaction.category}</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-3">
        <span className={`font-rajdhani font-semibold ${isIncome ? 'text-teal-400' : 'text-red-400'}`}>
          {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
        </span>
      </td>
      <td className="py-4 px-3 text-sm text-teal-300/70 font-rajdhani">
        <div className="flex items-center">
          <Clock className="w-3 h-3 mr-1 text-teal-500/50" />
          {formatDate(transaction.transaction_date)}
        </div>
      </td>
    </motion.tr>
  );
};

const RecentTransactions = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['recentTransactions'],
    queryFn: getRecentTransactions
  });

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-panel rounded-xl p-6 border border-teal-800/50"
      >
        <div className="h-4 bg-teal-900/50 rounded-full w-1/3 mb-6 animate-pulse"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="h-16 bg-teal-900/30 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-red-900/30 text-red-400 p-4 rounded-lg border border-red-500/30 font-rajdhani"
      >
        SYSTEM ALERT: Failed to load transactions ({error.message})
      </motion.div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-panel rounded-xl p-6 border border-teal-800/50 text-center"
      >
        <h3 className="text-lg font-bold font-orbitron text-teal-100 mb-2">RECENT TRANSACTIONS</h3>
        <p className="text-teal-300/70 font-rajdhani">No transaction history available</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass-panel rounded-xl p-6 border border-teal-800/50 hover:border-teal-400/30 transition-all"
    >
      <div className="flex items-center mb-6">
        <div className="w-1 h-8 bg-teal-400 mr-3 rounded-full"></div>
        <h3 className="text-xl font-bold font-orbitron text-teal-100 tracking-wider">
          TRANSACTION LOG
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-teal-300/80 font-rajdhani border-b border-teal-800/30">
              <th className="pb-3 font-medium tracking-wider pl-3">TRANSACTION</th>
              <th className="pb-3 font-medium tracking-wider">AMOUNT</th>
              <th className="pb-3 font-medium tracking-wider pr-3">DATE</th>
            </tr>
          </thead>
          <tbody>
            {data.map((transaction, index) => (
              <TransactionRow key={transaction.id} transaction={transaction} index={index} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-xs text-teal-500/50 font-rajdhani tracking-wider flex justify-between">
        <p>LAST UPDATED: {new Date().toLocaleString()}</p>
        <p>SHOWING: {data.length} RECORDS</p>
      </div>
    </motion.div>
  );
};

export default RecentTransactions;