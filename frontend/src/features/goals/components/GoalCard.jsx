import { motion } from 'framer-motion';
import { Target, Calendar, Wallet } from 'lucide-react';
import { calculateProgress } from '../goalApi';
import { Link } from 'react-router-dom';

const GoalCard = ({ goal }) => {
  const progress = calculateProgress(goal.current_amount, goal.target_amount);
  const isOverdue = goal.deadline && new Date(goal.deadline) < new Date() && goal.status !== 'completed';

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="glass-panel rounded-xl p-6 border border-teal-800/50 hover:border-teal-400/30 transition-all relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Holographic accent */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-teal-400/50 to-transparent"></div>

      <Link to={`/dashboard/goals/${goal.id}`} className="block">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-bold font-orbitron text-teal-100 line-clamp-2">
            {goal.title}
          </h3>
          <div className={`px-2 py-1 rounded text-xs font-rajdhani ${
            goal.status === 'completed'
              ? 'bg-green-900/30 text-green-400 border border-green-500/30'
              : isOverdue
                ? 'bg-red-900/30 text-red-400 border border-red-500/30'
                : 'bg-yellow-900/30 text-yellow-400 border border-yellow-500/30'
          }`}>
            {goal.status === 'completed' ? 'COMPLETED' : isOverdue ? 'OVERDUE' : 'IN PROGRESS'}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-teal-300/80 font-rajdhani mb-1">
            <span>{progress}%</span>
            <span>
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'ETB',
                maximumFractionDigits: 0
              }).format(goal.current_amount)} /{' '}
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'ETB',
                maximumFractionDigits: 0
              }).format(goal.target_amount)}
            </span>
          </div>
          <div className="h-2 bg-teal-900/50 rounded-full overflow-hidden">
            <div
              className={`h-full ${
                progress >= 100 ? 'bg-green-500' : 'bg-teal-500'
              } rounded-full`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-teal-300/70 font-rajdhani">
          {goal.deadline ? (
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(goal.deadline).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              })}
            </div>
          ) : (
            <div>No deadline</div>
          )}
          <div className="flex items-center">
            <Wallet className="w-4 h-4 mr-1" />
            {progress}%
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default GoalCard;