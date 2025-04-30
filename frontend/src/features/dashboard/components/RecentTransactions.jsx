import { useQuery } from '@tanstack/react-query';
import { getRecentTransactions } from '../dashboardApi';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'framer-motion';

const TransactionRow = ({ transaction, index }) => {
  const isIncome = transaction.type === 'income';
  const Icon = isIncome ? ArrowUpRight : ArrowDownRight;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ETB'
    }).format(value || 0);
  };

  const formatDate = (dateString) => {
    console.log('Raw date:', dateString);
    try {
      // Try different date formats
      let date;

      // First try standard ISO format
      date = new Date(dateString);

      // If that fails, try Laravel datetime format (YYYY-MM-DD HH:MM:SS)
      if (isNaN(date.getTime()) && typeof dateString === 'string') {
        const parts = dateString.split(' ');
        if (parts.length === 2) {
          const [datePart, timePart] = parts;
          const [year, month, day] = datePart.split('-');
          const [hour, minute, second] = timePart.split(':');
          date = new Date(year, month - 1, day, hour, minute, second);
        }
      }

      if (isNaN(date.getTime())) {
        // Try ISO format with hyphens replaced
        const dateISO = new Date(dateString.replace(/-/g, '/'));
        if (!isNaN(dateISO.getTime())) {
          date = dateISO;
        }
      }

      if (isNaN(date.getTime())) {
        // Try timestamp format
        const dateTimestamp = new Date(parseInt(dateString));
        if (!isNaN(dateTimestamp.getTime())) {
          date = dateTimestamp;
        }
      }

      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
      }

      console.error('Failed to parse date:', dateString);
      return '-'; // Return dash if date cannot be parsed
    } catch (error) {
      console.error('Error parsing date:', error);
      return '-'; // Return dash if parsing fails
    }
  };

  return (
    <motion.tr
      className="border-b last:border-b-0 hover:bg-gray-50 transition-colors"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <td className="py-4">
        <div className="flex items-center">
          <div className={`p-2 rounded-full ${isIncome ? 'bg-emerald-100' : 'bg-rose-100'}`}>
            <Icon className={`w-4 h-4 ${isIncome ? 'text-emerald-600' : 'text-rose-600'}`} />
          </div>
          <div className="ml-4">
            <p className="font-semibold text-gray-800">{transaction.description}</p>
            <p className="text-xs text-gray-500">{transaction.category}</p>
          </div>
        </div>
      </td>
      <td className="py-4">
        <span className={`font-semibold ${isIncome ? 'text-emerald-600' : 'text-rose-600'}`}>
          {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
        </span>
      </td>
      <td className="py-4 text-sm text-gray-500">{formatDate(transaction.transaction_date)}</td>
    </motion.tr>
  );
};

const RecentTransactions = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['recentTransactions'],
    queryFn: getRecentTransactions
  });

  console.log('RecentTransactions data:', data);
  console.log('RecentTransactions isLoading:', isLoading);
  console.log('RecentTransactions error:', error);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="h-16 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        Error loading transactions: {error.message}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 text-center">
        <h3 className="text-lg font-semibold mb-2">Recent Transactions</h3>
        <p className="text-gray-500">No recent transactions</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <motion.h3
        className="text-lg font-bold mb-6 text-gray-800"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Recent Transactions
      </motion.h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-400 border-b">
              <th className="pb-3 font-medium tracking-wide">Transaction</th>
              <th className="pb-3 font-medium tracking-wide">Amount</th>
              <th className="pb-3 font-medium tracking-wide">Date</th>
            </tr>
          </thead>
          <tbody>
            {data.map((transaction, index) => (
              <TransactionRow key={transaction.id} transaction={transaction} index={index} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTransactions;
