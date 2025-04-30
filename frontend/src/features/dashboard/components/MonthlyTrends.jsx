import { useQuery } from '@tanstack/react-query';
import { getMonthlyTrends } from '../dashboardApi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const MonthlyTrends = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['monthlyTrends'],
    queryFn: getMonthlyTrends
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 h-[400px] animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-[300px] bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        Error loading trends: {error.message}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 text-center">
        <h3 className="text-lg font-semibold mb-2">Monthly Trends</h3>
        <p className="text-gray-500">No trend data available</p>
      </div>
    );
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ETB'
    }).format(value || 0);
  };

  const formatDate = (dateString) => {
    console.log('Raw month:', dateString);
    try {
      // Try different date formats
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        // Try ISO format
        const dateISO = new Date(dateString.replace(/-/g, '/'));
        if (!isNaN(dateISO.getTime())) {
          return dateISO.toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric'
          });
        }
        // Try timestamp format
        const dateTimestamp = new Date(parseInt(dateString));
        if (!isNaN(dateTimestamp.getTime())) {
          return dateTimestamp.toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric'
          });
        }
      }
      return date.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error parsing month:', error);
      return dateString; // Return raw date if parsing fails
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-md border">
          <p className="font-semibold">{formatDate(label)}</p>
          <p className="text-green-600">Income: {formatCurrency(payload[0].value)}</p>
          <p className="text-red-600">Expenses: {formatCurrency(payload[1].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-6">Monthly Trends</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tickFormatter={formatDate} />
            <YAxis tickFormatter={(value) => formatCurrency(value)} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="income"
              stroke="#22c55e"
              strokeWidth={2}
              dot={{ fill: '#22c55e' }}
            />
            <Line
              type="monotone"
              dataKey="expense"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ fill: '#ef4444' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyTrends;
