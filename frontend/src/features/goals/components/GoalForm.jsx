import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createGoal, updateGoal } from '../goalApi';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { format } from 'date-fns';
import { Calendar as CalendarPicker } from '../../../components/ui/calendars';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../components/ui/popover';

const GoalForm = ({ goal, onClose, onSuccess }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: '',
    target_amount: '',
    current_amount: '',
    deadline: null
  });
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  useEffect(() => {
    if (goal) {
      setFormData({
        title: goal.title,
        target_amount: goal.target_amount.toString(),
        current_amount: goal.current_amount.toString(),
        deadline: goal.deadline ? new Date(goal.deadline) : null
      });
    }
  }, [goal]);

  const mutation = useMutation({
    mutationFn: goal
      ? (data) => updateGoal(goal.id, data)
      : (data) => createGoal(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['goals']);
      if (goal) queryClient.invalidateQueries(['goal', goal.id]);
      onSuccess();
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      target_amount: parseFloat(formData.target_amount),
      current_amount: formData.current_amount ? parseFloat(formData.current_amount) : 0,
      deadline: formData.deadline
        ? formData.deadline.toISOString().split('T')[0]
        : null
    };
    mutation.mutate(data);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="glass-panel rounded-xl p-6 border border-teal-800/50 w-full max-w-md relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-teal-300 hover:text-teal-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center mb-6">
          <div className="w-1 h-8 bg-teal-400 mr-3 rounded-full"></div>
          <h2 className="text-xl font-bold font-orbitron text-teal-100 tracking-wider">
            {goal ? 'EDIT GOAL' : 'NEW GOAL'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-teal-300 font-rajdhani">
              Goal Title
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="bg-teal-900/20 border-teal-800/50 text-teal-100 mt-1"
              required
            />
          </div>

          <div>
            <Label
              htmlFor="target_amount"
              className="text-teal-300 font-rajdhani"
            >
              Target Amount (ETB)
            </Label>
            <Input
              id="target_amount"
              type="number"
              min="1"
              step="0.01"
              value={formData.target_amount}
              onChange={(e) =>
                setFormData({ ...formData, target_amount: e.target.value })
              }
              className="bg-teal-900/20 border-teal-800/50 text-teal-100 mt-1"
              required
            />
          </div>

          <div>
            <Label
              htmlFor="current_amount"
              className="text-teal-300 font-rajdhani"
            >
              Current Amount (ETB)
            </Label>
            <Input
              id="current_amount"
              type="number"
              min="0"
              step="0.01"
              value={formData.current_amount}
              onChange={(e) =>
                setFormData({ ...formData, current_amount: e.target.value })
              }
              className="bg-teal-900/20 border-teal-800/50 text-teal-100 mt-1"
            />
          </div>

          <div>
            <Label
              htmlFor="deadline"
              className="text-teal-300 font-rajdhani"
            >
              Deadline
            </Label>
            <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full bg-teal-900/20 border-teal-800/50 text-teal-100 hover:bg-teal-800/30 hover:text-teal-100 justify-start text-left font-normal mt-1"
                >
                  <Calendar className="mr-2 h-4 w-4 text-teal-400" />
                  {formData.deadline ? (
                    format(formData.deadline, 'PPP')
                  ) : (
                    <span className="text-teal-300/70">Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 glass-panel border-teal-800/50">
                <CalendarPicker
                  mode="single"
                  selected={formData.deadline}
                  onSelect={(date) => {
                    setFormData({ ...formData, deadline: date });
                    setDatePickerOpen(false);
                  }}
                  initialFocus
                  className="border-0"
                />
              </PopoverContent>
            </Popover>
          </div>

          {goal && (
            <div>
              <Label className="text-teal-300 font-rajdhani">Status</Label>
              <div className="bg-teal-800/20 px-3 py-2 rounded text-teal-100 mt-1">
                {goal.status === 'completed' ? '🎉 Completed' : '🚀 In Progress'}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="text-teal-300 hover:bg-teal-900/30 font-rajdhani"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-teal-700 hover:bg-teal-600 text-teal-100 font-rajdhani"
              disabled={mutation.isLoading}
            >
              {mutation.isLoading
                ? 'Processing...'
                : goal
                ? 'Update Goal'
                : 'Create Goal'}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default GoalForm;
