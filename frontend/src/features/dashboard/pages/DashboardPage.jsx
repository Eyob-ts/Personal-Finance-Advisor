import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SummarySection from '../components/SummarySection';
import SpendingByCategory from '../components/SpendingByCategory';
import RecentTransactions from '../components/RecentTransactions';
import MonthlyTrends from '../components/MonthlyTrends';

const queryClient = new QueryClient();

const DashboardPage = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-br from-[#01332B] to-[#025C4F] text-white">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8 py-2 bg-gradient-to-r from-[#04B4A0] to-[#01332B] bg-clip-text text-transparent">
            Dashboard
          </h1>

          <div className="space-y-8">
            <SummarySection />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
                <SpendingByCategory />
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
                <MonthlyTrends />
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
              <RecentTransactions />
            </div>
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
};

export default DashboardPage;