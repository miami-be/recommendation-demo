import React from 'react';
import { Film } from 'lucide-react';

interface EmptyStateProps {
  message: string;
  submessage?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message, submessage }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 my-12 text-center">
      <div className="bg-blue-50 p-6 rounded-full mb-4">
        <Film className="h-12 w-12 text-blue-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{message}</h3>
      {submessage && (
        <p className="text-gray-500 max-w-md">{submessage}</p>
      )}
    </div>
  );
};

export default EmptyState;