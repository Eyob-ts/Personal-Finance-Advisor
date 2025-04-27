import { useQuery } from '@tanstack/react-query';
import { getRecentTransactions } from '../dashboardApi';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const TransactionRow = ({ transaction }) => {
  const isIncome = transaction.type === 'income';
  const Icon = isIncome ? ArrowUpRight : ArrowDownRight;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <tr className="border-b last:border-b-0">
      <td className="py-4">
        <div className="flex items-center">
          <div className={`p-2 rounded-full ${isIncome ? 'bg-green-100' : 'bg-red-100'}`}>
            <Icon className={`w-4 h-4 ${isIncome ? 'text-green-600' : 'text-red-600'}`} />
          </div>
          <div className="ml-4">
            <p className="font-medium">{transaction.description}</p>
            <p className="text-sm text-gray-500">{transaction.category}</p>
          </div>
        </div>
      </td>
      <td className="py-4">
        <span className={`font-medium ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
          {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
        </span>
      </td>
      <td className="py-4 text-gray-500">{formatDate(transaction.date)}</td>
    </tr>
  );
};

const RecentTransactions = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['recentTransactions'],
    queryFn: getRecentTransactions
  });

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

  if (!data?.transactions?.length) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 text-center">
        <h3 className="text-lg font-semibold mb-2">Recent Transactions</h3>
        <p className="text-gray-500">No recent transactions</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-6">Recent Transactions</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-500 border-b">
              <th className="pb-4">Transaction</th>
              <th className="pb-4">Amount</th>
              <th className="pb-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {data.transactions.map((transaction) => (
              <TransactionRow key={transaction.id} transaction={transaction} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTransactions;
