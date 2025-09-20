import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SummarySection from '../components/SummarySection';
import SpendingByCategory from '../components/SpendingByCategory';
import RecentTransactions from '../components/RecentTransactions';
import MonthlyTrends from '../components/MonthlyTrends';

const queryClient = new QueryClient();

const DashboardPage = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen  bg-gradient-to-br from-[#001A16] to-[#01332B] text-white">
        <div className="container mx-auto px-3 sm:px-4  py-6 sm:py-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 py-2 bg-gradient-to-r from-teal-400 to-[#01332B] bg-clip-text text-transparent font-orbitron tracking-wide">
            Dashboard
          </h1>

          <div className="space-y-6 sm:space-y-8">
            <SummarySection />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              <div className="bg-[#01332B]/80  backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-teal-800/20 shadow-lg">
                <SpendingByCategory />
              </div>

              <div className="bg-[#01332B]/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-teal-800/30 shadow-lg">
                <MonthlyTrends />
              </div>
            </div>

            <div className="bg-[#01332B]/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-teal-800/30 shadow-lg">
              <RecentTransactions />
            </div>
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
};

export default DashboardPage;