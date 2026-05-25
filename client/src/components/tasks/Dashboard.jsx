import React, { useState, useEffect } from 'react';
import { useTasks } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../ui/Navbar';
import TaskCard from '../tasks/TaskCard';
import TaskModal from '../tasks/TaskModal';
import TaskFilters from '../tasks/TaskFilters';
import StatsBar from '../tasks/StatsBar';
import Pagination from '../tasks/Pagination';
import { FiPlus, FiInbox } from 'react-icons/fi';

const SkeletonCard = () => (
  <div className="card p-4 animate-pulse">
    <div className="flex gap-3">
      <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 mt-0.5 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
        <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-full" />
        <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/2" />
      </div>
    </div>
    <div className="flex gap-2 mt-3 pl-8">
      <div className="h-5 w-14 bg-slate-100 dark:bg-slate-800 rounded-full" />
      <div className="h-5 w-18 bg-slate-100 dark:bg-slate-800 rounded-full" />
    </div>
  </div>
);

const EmptyState = ({ onCreate }) => (
  <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-fade-in">
    <div className="w-16 h-16 bg-brand-50 dark:bg-brand-900/20 rounded-2xl flex items-center justify-center mb-4">
      <FiInbox className="w-8 h-8 text-brand-400" />
    </div>
    <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">No tasks found</h3>
    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mb-6">
      Create your first task to get started, or try adjusting your filters.
    </p>
    <button onClick={onCreate} className="btn-primary">
      <FiPlus className="w-4 h-4" /> New Task
    </button>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const { tasks, loading, fetchTasks, filters, page } = useTasks();
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);

  // Fetch whenever filters or page change
  useEffect(() => {
    fetchTasks();
  }, [filters, page]); // eslint-disable-line

  const handleEdit = (task) => { setEditTask(task); setShowModal(true); };
  const handleCreate = () => { setEditTask(null); setShowModal(true); };
  const handleClose = () => { setShowModal(false); setEditTask(null); };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-slide-up">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {greeting()}, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <button onClick={handleCreate} className="btn-primary self-start sm:self-center">
            <FiPlus className="w-4 h-4" /> New Task
          </button>
        </div>

        {/* Stats */}
        <div className="mb-6 animate-slide-up" style={{ animationDelay: '60ms' }}>
          <StatsBar />
        </div>

        {/* Filters */}
        <div className="mb-4 animate-slide-up" style={{ animationDelay: '120ms' }}>
          <TaskFilters />
        </div>

        {/* Task list */}
        <div className="animate-slide-up" style={{ animationDelay: '180ms' }}>
          {loading ? (
            <div className="flex flex-col gap-3 stagger">
              {[...Array(5)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : tasks.length === 0 ? (
            <EmptyState onCreate={handleCreate} />
          ) : (
            <div className="flex flex-col gap-3 stagger">
              {tasks.map(task => (
                <TaskCard key={task._id} task={task} onEdit={handleEdit} />
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && tasks.length > 0 && (
          <div className="mt-6">
            <Pagination />
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && <TaskModal task={editTask} onClose={handleClose} />}
    </div>
  );
};

export default Dashboard;
