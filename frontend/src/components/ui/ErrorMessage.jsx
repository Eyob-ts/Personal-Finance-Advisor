import { AlertTriangle } from 'lucide-react';

const ErrorMessage = ({ message = 'An error occurred' }) => {
  return (
    <div className="flex items-center p-4 mb-4 text-red-800 rounded-lg bg-red-50">
      <AlertTriangle className="flex-shrink-0 w-5 h-5 mr-2" />
      <span className="font-medium">{message}</span>
    </div>
  );
};

export default ErrorMessage;
