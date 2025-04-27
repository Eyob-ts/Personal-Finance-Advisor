import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SummarySection from '../components/SummarySection';
import SpendingByCategory from '../components/SpendingByCategory';
import RecentTransactions from '../components/RecentTransactions';
import MonthlyTrends from '../components/MonthlyTrends';

const queryClient = new QueryClient();

const DashboardPage = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
        <div className="space-y-8">
          <SummarySection />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <SpendingByCategory />
            <MonthlyTrends />
          </div>
          <RecentTransactions />
        </div>
      </div>
    </QueryClientProvider>
  );
};

export default DashboardPage;
