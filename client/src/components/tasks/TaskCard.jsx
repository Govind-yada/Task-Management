import React, { useState } from 'react';
import { useTasks } from '../../context/TaskContext';
import { format, isPast, isToday } from 'date-fns';
import { FiEdit2, FiTrash2, FiCalendar, FiFlag, FiCheck, FiClock, FiTag } from 'react-icons/fi';

const PRIORITY_CLASS = {
  low: 'priority-low', medium: 'priority-medium', high: 'priority-high', urgent: 'priority-urgent',
};
const STATUS_CLASS = {
  'todo': 'status-todo', 'in-progress': 'status-in-progress', 'completed': 'status-completed',
};
const STATUS_LABEL = { 'todo': 'To Do', 'in-progress': 'In Progress', 'completed': 'Completed' };
const PRIORITY_DOT = { low: 'bg-emerald-500', medium: 'bg-amber-500', high: 'bg-orange-500', urgent: 'bg-red-500' };

const TaskCard = ({ task, onEdit }) => {
  const { deleteTask, toggleTask } = useTasks();
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('Delete this task?')) return;
    setDeleting(true);
    await deleteTask(task._id);
  };

  const handleToggle = async () => {
    setToggling(true);
    await toggleTask(task._id);
    setToggling(false);
  };

  const dueDate = task.dueDate ? new Date(task.dueDate) : null;
  const overdue = dueDate && isPast(dueDate) && !isToday(dueDate) && task.status !== 'completed';
  const dueToday = dueDate && isToday(dueDate);

  return (
    <div className={`card p-4 hover:shadow-card-hover transition-all duration-200 animate-slide-up group
      ${task.status === 'completed' ? 'opacity-70' : ''}
      ${overdue ? 'border-red-200 dark:border-red-900/50' : ''}`}>

      {/* Top row */}
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={handleToggle}
          disabled={toggling}
          className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all
            ${task.status === 'completed'
              ? 'bg-emerald-500 border-emerald-500 text-white'
              : 'border-slate-300 dark:border-slate-600 hover:border-brand-500'}`}
        >
          {task.status === 'completed' && <FiCheck className="w-3 h-3" />}
          {toggling && <span className="w-2 h-2 border border-current border-t-transparent rounded-full animate-spin" />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-sm text-slate-900 dark:text-white leading-snug mb-1
            ${task.status === 'completed' ? 'line-through text-slate-500 dark:text-slate-500' : ''}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
              {task.description}
            </p>
          )}
        </div>

        {/* Actions (visible on hover) */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button onClick={() => onEdit(task)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-900/20 dark:hover:text-brand-400 transition-colors">
            <FiEdit2 className="w-3.5 h-3.5" />
          </button>
          <button onClick={handleDelete} disabled={deleting}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors">
            <FiTrash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom meta */}
      <div className="flex flex-wrap items-center gap-2 mt-3 pl-8">
        {/* Priority */}
        <span className={PRIORITY_CLASS[task.priority]}>
          <span className={`w-1.5 h-1.5 rounded-full ${PRIORITY_DOT[task.priority]}`} />
          {task.priority}
        </span>

        {/* Status */}
        <span className={STATUS_CLASS[task.status]}>{STATUS_LABEL[task.status]}</span>

        {/* Due date */}
        {dueDate && (
          <span className={`badge ${overdue ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' : dueToday ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
            <FiCalendar className="w-3 h-3" />
            {overdue ? 'Overdue · ' : dueToday ? 'Today · ' : ''}{format(dueDate, 'MMM d')}
          </span>
        )}

        {/* Tags */}
        {task.tags?.slice(0, 2).map(tag => (
          <span key={tag} className="badge bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            <FiTag className="w-3 h-3" />{tag}
          </span>
        ))}
        {task.tags?.length > 2 && (
          <span className="text-xs text-slate-400">+{task.tags.length - 2}</span>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
