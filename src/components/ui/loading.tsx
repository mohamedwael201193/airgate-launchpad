import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export function LoadingSpinner({ size = 'md', className = '', text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin`} />
      {text && <span className="text-sm text-gray-600">{text}</span>}
    </div>
  );
}

interface ProgressBarProps {
  progress: number;
  max?: number;
  className?: string;
  showPercentage?: boolean;
  color?: 'blue' | 'green' | 'purple' | 'yellow';
}

export function ProgressBar({ 
  progress, 
  max = 100, 
  className = '', 
  showPercentage = true,
  color = 'blue'
}: ProgressBarProps) {
  const percentage = Math.min((progress / max) * 100, 100);
  
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    yellow: 'bg-yellow-500'
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div 
          className={`h-full ${colorClasses[color]} transition-all duration-300 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showPercentage && (
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span>{progress}/{max}</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
    </div>
  );
}

interface StatusBadgeProps {
  status: 'idle' | 'loading' | 'success' | 'error';
  text?: string;
  className?: string;
}

export function StatusBadge({ status, text, className = '' }: StatusBadgeProps) {
  const statusConfig = {
    idle: {
      bg: 'bg-gray-100',
      text: 'text-gray-700',
      icon: null,
      defaultText: 'Ready'
    },
    loading: {
      bg: 'bg-blue-100',
      text: 'text-blue-700',
      icon: <Loader2 className="w-3 h-3 animate-spin" />,
      defaultText: 'Processing...'
    },
    success: {
      bg: 'bg-green-100',
      text: 'text-green-700',
      icon: <span className="w-3 h-3 rounded-full bg-green-500" />,
      defaultText: 'Complete'
    },
    error: {
      bg: 'bg-red-100',
      text: 'text-red-700',
      icon: <span className="w-3 h-3 rounded-full bg-red-500" />,
      defaultText: 'Failed'
    }
  };

  const config = statusConfig[status];
  
  return (
    <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} ${className}`}>
      {config.icon}
      {text || config.defaultText}
    </div>
  );
}

interface StepIndicatorProps {
  steps: Array<{
    id: string;
    title: string;
    status: 'pending' | 'loading' | 'complete' | 'error';
  }>;
  currentStep?: number;
  className?: string;
}

export function StepIndicator({ steps, currentStep, className = '' }: StepIndicatorProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center gap-3">
          <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
            step.status === 'complete' ? 'bg-green-500 text-white' :
            step.status === 'loading' ? 'bg-blue-500 text-white' :
            step.status === 'error' ? 'bg-red-500 text-white' :
            'bg-gray-200 text-gray-600'
          }`}>
            {step.status === 'loading' ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : step.status === 'complete' ? (
              '✓'
            ) : step.status === 'error' ? (
              '✗'
            ) : (
              index + 1
            )}
          </div>
          <div className="flex-grow">
            <div className={`text-sm font-medium ${
              step.status === 'complete' ? 'text-green-700' :
              step.status === 'loading' ? 'text-blue-700' :
              step.status === 'error' ? 'text-red-700' :
              'text-gray-700'
            }`}>
              {step.title}
            </div>
          </div>
          <StatusBadge status={
            step.status === 'pending' ? 'idle' :
            step.status === 'complete' ? 'success' :
            step.status
          } />
        </div>
      ))}
    </div>
  );
}

export default {
  LoadingSpinner,
  ProgressBar,
  StatusBadge,
  StepIndicator
};