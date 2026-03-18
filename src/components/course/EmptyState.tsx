import { Icon } from '@iconify/react';

interface EmptyStateProps {
  icon: string;
  message: string;
}

export const EmptyState = ({ icon, message }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center space-y-4 rounded-2xl border border-dashed border-brand-cyan/20 bg-brand-cyan/5 py-16">
    <Icon icon={icon} className="text-5xl text-brand-cyan/40" />
    <p className="text-center text-gray-400">{message}</p>
  </div>
);
