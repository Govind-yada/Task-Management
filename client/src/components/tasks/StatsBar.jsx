import React from 'react';
import { useTasks } from '../../context/TaskContext';
import { FiCheckSquare, FiClock, FiLoader, FiList } from 'react-icons/fi';

const StatCard = ({ icon: Icon, label, value, color, onClick, active }) => (
  <button
    onClick={onClick}
    className={`card flex items-center gap-3 p-3.5 flex-1 min-w-0 transition-all duration-150
      ${active ? 'ring-2 ring-brand-500 shadow-card-hover' : 'hover:shadow-card-hover'}
    `}
  >
    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
      <Icon className="w-4.5 h-4.5" />
    </div>
    <div className="text-left min-w-0">
      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{label}</p>
      <p className="text-xl font-bold text-slate-900 dark:text-white leading-none">{value}</p>
    </div>
  </button>
);

const StatsBar = () => {
  const { stats, filters, setFilters } = useTasks();
  const total = (stats.todo || 0) + (stats['in-progress'] || 0) + (stats.completed || 0);

  const click = (status) => () => setFilters({ status: filters.status === status ? 'all' : status });

  return (
    <div className="flex gap-3 overflow-x-auto pb-1 -mb-1 snap-x">
      <StatCard icon={FiList} label="Total" value={total}
        color="bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400"
        onClick={() => setFilters({ status: 'all' })} active={filters.status === 'all'} />
      <StatCard icon={FiClock} label="To Do" value={stats.todo || 0}
        color="bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
        onClick={click('todo')} active={filters.status === 'todo'} />
      <StatCard icon={FiLoader} label="In Progress" value={stats['in-progress'] || 0}
        color="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
        onClick={click('in-progress')} active={filters.status === 'in-progress'} />
      <StatCard icon={FiCheckSquare} label="Completed" value={stats.completed || 0}
        color="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
        onClick={click('completed')} active={filters.status === 'completed'} />
    </div>
  );
};

export default StatsBar;
