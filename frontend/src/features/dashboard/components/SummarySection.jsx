import { useQuery } from '@tanstack/react-query';
import { getFinancialSummary } from '../dashboardApi';
import { DollarSign, TrendingUp, ArrowDownRight, PiggyBank } from 'lucide-react';

const SummaryCard = ({ title, value, icon: Icon, isPositive }) => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
      </div>
      <div className={`p-3 rounded-full ${isPositive ? 'bg-green-100' : 'bg-red-100'}`}>
        <Icon className={`w-6 h-6 ${isPositive ? 'text-green-600' : 'text-red-600'}`} />
      </div>
    </div>
  </div>
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
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        Error loading financial summary: {error.message}
      </div>
    );
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ETB'
    }).format(value || 0);
  };

  const calculateSavingsRate = (income, expense) => {
    if (!income) return 0;
    return ((income - expense) / income) * 100;
  };

  const cards = [
    {
      title: 'Total Balance',
      value: formatCurrency(data?.balance),
      icon: DollarSign,
      isPositive: true
    },
    {
      title: 'Monthly Income',
      value: formatCurrency(data?.monthly_income),
      icon: TrendingUp,
      isPositive: true
    },
    {
      title: 'Monthly Expenses',
      value: formatCurrency(data?.monthly_expense),
      icon: ArrowDownRight,
      isPositive: false
    },
    {
      title: 'Savings',
      value: formatCurrency(data?.savings),
      change: `${calculateSavingsRate(data?.monthly_income, data?.monthly_expense).toFixed(1)}%`,
      icon: PiggyBank,
      isPositive: (data?.savings || 0) > 0
    }
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Financial Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <SummaryCard
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon}
            isPositive={card.isPositive}
          />
        ))}
      </div>
    </div>
  );
};

export default SummarySection;
