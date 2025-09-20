import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Target, Trophy, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getGoals } from '../goalApi';
import GoalCard from '../components/GoalCard';
import GoalForm from '../components/GoalForm';
import { Button } from '../../../components/ui/button';

const GoalsPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { data: goals, isLoading, error } = useQuery({
    queryKey: ['goals'],
    queryFn: getGoals
  });

  // Stats calculation
  const stats = {
    total: goals?.length || 0,
    completed: goals?.filter(g => g.status === 'completed').length || 0,
    inProgress: goals?.filter(g => g.status === 'in-progress').length || 0,
    overdue: goals?.filter(g =>
      g.deadline && new Date(g.deadline) < new Date() && g.status !== 'completed'
    ).length || 0
  };

  if (isLoading) {
    return (
      <div className="glass-panel rounded-xl p-6 border border-teal-800/50">
        <div className="h-8 bg-teal-900/50 rounded-full w-1/3 mb-6 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 bg-teal-900/30 rounded-lg animate-pulse"></div>
          ))}
        </div>
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
        SYSTEM ERROR: Failed to load goals ({error.message})
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="glass-panel rounded-xl p-6 border border-teal-800/50"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <div className="w-1 h-8 bg-teal-400 mr-3 rounded-full"></div>
          <h1 className="text-xl font-bold font-orbitron text-teal-100 tracking-wider">
            FINANCIAL GOALS
          </h1>
        </div>
        <Button
          onClick={() => setIsFormOpen(true)}
          className="bg-teal-700 hover:bg-teal-600 text-teal-100 font-rajdhani"
        >
          <Plus className="w-4 h-4 mr-2" /> NEW GOAL
        </Button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<Target className="w-5 h-5 text-teal-400" />}
          value={stats.total}
          label="Total Goals"
        />
        <StatCard
          icon={<Trophy className="w-5 h-5 text-green-400" />}
          value={stats.completed}
          label="Completed"
        />
        <StatCard
          icon={<Clock className="w-5 h-5 text-yellow-400" />}
          value={stats.inProgress}
          label="In Progress"
        />
        <StatCard
          icon={<Clock className="w-5 h-5 text-red-400" />}
          value={stats.overdue}
          label="Overdue"
        />
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals?.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>

      {/* Empty State */}
      {goals?.length === 0 && (
        <div className="text-center py-12">
          <Target className="w-12 h-12 mx-auto text-teal-400/50 mb-4" />
          <h3 className="text-lg font-orbitron text-teal-100 mb-2">NO GOALS FOUND</h3>
          <p className="text-teal-300/70 font-rajdhani mb-4">Create your first financial goal to get started</p>
          <Button
            onClick={() => setIsFormOpen(true)}
            className="bg-teal-700 hover:bg-teal-600 text-teal-100 font-rajdhani"
          >
            <Plus className="w-4 h-4 mr-2" /> CREATE GOAL
          </Button>
        </div>
      )}

      {/* Goal Form Modal */}
      {isFormOpen && (
        <GoalForm
          onClose={() => setIsFormOpen(false)}
          onSuccess={() => {
            setIsFormOpen(false);
            // Query will automatically refetch due to TanStack Query
          }}
        />
      )}
    </motion.div>
  );
};

const StatCard = ({ icon, value, label }) => (
  <motion.div
    whileHover={{ y: -2 }}
    className="glass-panel rounded-lg p-4 border border-teal-800/30"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-2xl font-bold font-orbitron text-teal-100">{value}</p>
        <p className="text-xs text-teal-300/70 font-rajdhani">{label}</p>
      </div>
      <div className="p-2 rounded-lg bg-teal-900/20 border border-teal-400/20">
        {icon}
      </div>
    </div>
  </motion.div>
);

export default GoalsPage;