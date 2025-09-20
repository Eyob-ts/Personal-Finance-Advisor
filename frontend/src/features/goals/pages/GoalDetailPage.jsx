import { useParams } from 'react-router-dom';
import React, { useState } from "react";
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Target, Calendar, Wallet, CheckCircle, Clock } from 'lucide-react';
import { getGoal, calculateProgress } from '../goalApi';
import GoalForm from '../components/GoalForm';
import { Button } from '../../../components/ui/button';
import { useNavigate } from 'react-router-dom';

const GoalDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const { data: goal, isLoading, error } = useQuery({
    queryKey: ['goal', id],
    queryFn: () => getGoal(id)
  });

  if (isLoading) {
    return (
      <div className="glass-panel rounded-xl p-6 border border-teal-800/50">
        <div className="h-8 bg-teal-900/50 rounded-full w-1/3 mb-6 animate-pulse"></div>
        <div className="h-64 bg-teal-900/30 rounded-lg animate-pulse"></div>
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
        SYSTEM ERROR: Failed to load goal ({error.message})
      </motion.div>
    );
  }

  if (!goal) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-panel rounded-xl p-6 border border-teal-800/50 text-center"
      >
        <Target className="w-12 h-12 mx-auto text-teal-400/50 mb-4" />
        <h3 className="text-lg font-orbitron text-teal-100 mb-2">GOAL NOT FOUND</h3>
        <Button
          onClick={() => navigate('dashboard/goals')}
          className="bg-teal-700 hover:bg-teal-600 text-teal-100 font-rajdhani mt-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> BACK TO GOALS
        </Button>
      </motion.div>
    );
  }

  const progress = calculateProgress(goal.current_amount, goal.target_amount);
  const isOverdue = goal.deadline && new Date(goal.deadline) < new Date() && goal.status !== 'completed';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="glass-panel rounded-xl p-6 border border-teal-800/50"
    >
      <div className="flex items-center justify-between mb-8">
        <Button
          onClick={() => navigate('dashboard/goals')}
          variant="ghost"
          className="text-teal-300 hover:bg-teal-900/30 font-rajdhani"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> BACK
        </Button>

        <div className="flex gap-2">
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-teal-700 hover:bg-teal-600 text-teal-100 font-rajdhani"
          >
            EDIT
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Goal Info */}
        <div>
          <h1 className="text-2xl font-bold font-orbitron text-teal-100 mb-2">
            {goal.title}
          </h1>

          <div className="flex items-center gap-2 mb-6">
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
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-rajdhani text-teal-300">
                Progress: {progress}%
              </span>
              <span className="text-sm font-rajdhani text-teal-300">
                {goal.current_amount} / {goal.target_amount} ETB
              </span>
            </div>
            <div className="h-3 bg-teal-900/50 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1 }}
                className={`h-full ${
                  progress >= 100 ? 'bg-green-500' : 'bg-teal-500'
                } rounded-full`}
              />
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <DetailItem
              icon={<Wallet className="w-5 h-5 text-teal-400" />}
              label="Target Amount"
              value={new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'ETB'
              }).format(goal.target_amount)}
            />

            <DetailItem
              icon={<Wallet className="w-5 h-5 text-teal-400" />}
              label="Current Amount"
              value={new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'ETB'
              }).format(goal.current_amount)}
            />

            {goal.deadline && (
              <DetailItem
                icon={<Calendar className="w-5 h-5 text-teal-400" />}
                label="Deadline"
                value={new Date(goal.deadline).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
                subtext={isOverdue ? (
                  <span className="text-red-400 text-xs">Past deadline</span>
                ) : (
                  <span className="text-teal-400 text-xs">
                    {Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24))} days remaining
                  </span>
                )}
              />
            )}

            <DetailItem
              icon={goal.status === 'completed'
                ? <CheckCircle className="w-5 h-5 text-green-400" />
                : <Clock className="w-5 h-5 text-yellow-400" />}
              label="Status"
              value={goal.status === 'completed' ? 'Completed' : 'In Progress'}
            />
          </div>
        </div>

        {/* Contribution History (placeholder) */}
        <div>
          <h3 className="text-lg font-orbitron text-teal-100 mb-4">CONTRIBUTIONS</h3>
          <div className="glass-panel rounded-lg p-4 border border-teal-800/30 h-full">
            <p className="text-teal-300/70 font-rajdhani text-center py-12">
              Contribution history will appear here
            </p>
          </div>
        </div>
      </div>

      {/* Edit Form Modal */}
      {isEditing && (
        <GoalForm
          goal={goal}
          onClose={() => setIsEditing(false)}
          onSuccess={() => {
            setIsEditing(false);
            // Query will automatically refetch due to TanStack Query
          }}
        />
      )}
    </motion.div>
  );
};

const DetailItem = ({ icon, label, value, subtext }) => (
  <div className="flex items-start gap-4">
    <div className="p-2 rounded-lg bg-teal-900/20 border border-teal-400/20 mt-1">
      {icon}
    </div>
    <div>
      <p className="text-xs text-teal-300/70 font-rajdhani">{label}</p>
      <p className="text-teal-100 font-rajdhani">{value}</p>
      {subtext && <div className="mt-1">{subtext}</div>}
    </div>
  </div>
);

export default GoalDetailPage;