import { useQuery } from '@tanstack/react-query';
import { getMonthlyTrends } from '../dashboardApi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';

const MonthlyTrends = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['monthlyTrends'],
    queryFn: getMonthlyTrends
  });

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-panel rounded-xl p-6 border border-teal-800/50 h-[400px]"
      >
        <div className="h-4 bg-teal-900/50 rounded-full w-1/3 mb-4 animate-pulse"></div>
        <div className="h-[300px] bg-teal-900/50 rounded-lg animate-pulse"></div>
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
        SYSTEM ALERT: Failed to load trend data ({error.message})
      </motion.div>
    );
  }

  if (!data) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-panel rounded-xl p-6 border border-teal-800/50 text-center"
      >
        <h3 className="text-lg font-semibold font-orbitron text-teal-100 mb-2">MONTHLY TRENDS</h3>
        <p className="text-teal-300/70 font-rajdhani">No trend data available</p>
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

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        const dateISO = new Date(dateString.replace(/-/g, '/'));
        if (!isNaN(dateISO.getTime())) {
          return dateISO.toLocaleDateString('en-US', { month: 'short' });
        }
        const dateTimestamp = new Date(parseInt(dateString));
        if (!isNaN(dateTimestamp.getTime())) {
          return dateTimestamp.toLocaleDateString('en-US', { month: 'short' });
        }
      }
      return date.toLocaleDateString('en-US', { month: 'short' });
    } catch (error) {
      return dateString;
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel p-3 rounded-lg border border-teal-400/30 font-rajdhani">
          <p className="font-bold text-teal-100">{formatDate(label)}</p>
          <p className="text-green-400">Income: {formatCurrency(payload[0].value)}</p>
          <p className="text-red-400">Expenses: {formatCurrency(payload[1].value)}</p>
        </div>
      );
    }
    return null;
  };

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
          CASHFLOW TRENDS
        </h3>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2dd4bf20" />
            <XAxis
              dataKey="month"
              tickFormatter={formatDate}
              tick={{ fill: '#5eead4', fontSize: 12 }}
              axisLine={{ stroke: '#2dd4bf50' }}
            />
            <YAxis
              tickFormatter={(value) => formatCurrency(value)}
              tick={{ fill: '#5eead4', fontSize: 12 }}
              axisLine={{ stroke: '#2dd4bf50' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => (
                <span className="text-teal-100 font-rajdhani text-sm">{value}</span>
              )}
            />
            <Line
              type="monotone"
              dataKey="income"
              stroke="#22c55e"
              strokeWidth={2}
              dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#86efac', strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="expense"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#fca5a5', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 text-xs text-teal-500/50 font-rajdhani tracking-wider">
        <p>DATA RANGE: LAST 12 MONTHS | SOURCE: PRIMARY LEDGER</p>
      </div>
    </motion.div>
  );
};

export default MonthlyTrends;