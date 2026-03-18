import { Icon } from '@iconify/react';

interface StatCardProps {
  icon: string;
  title: string;
  value: number;
}

export const StatCard = ({ icon, title, value }: StatCardProps) => (
  <div className="flex flex-col items-center justify-center p-4 bg-brand-cyan/5 border border-brand-cyan/10 rounded-2xl shadow-lg">
    <Icon icon={icon} className="mb-1 text-2xl text-brand-cyan" />
    <span className="text-2xl font-bold text-white">{value}</span>
    <span className="text-xs text-gray-400">{title}</span>
  </div>
);
