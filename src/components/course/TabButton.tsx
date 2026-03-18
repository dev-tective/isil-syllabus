import { Icon } from '@iconify/react';

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
}

export const TabButton = ({ active, onClick, icon, label }: TabButtonProps) => (
  <button
    onClick={onClick}
    className={[
      'flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all',
      active
        ? 'bg-brand-cyan text-brand-dark shadow-md'
        : 'text-gray-400 hover:bg-brand-cyan/5 hover:text-white',
    ].join(' ')}
  >
    <Icon icon={icon} className="text-lg" />
    <span className="hidden sm:inline">{label}</span>
  </button>
);
