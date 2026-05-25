import React, { useState, useEffect } from 'react';
import { useTasks } from '../../context/TaskContext';
import { FiX, FiCalendar, FiFlag, FiAlignLeft, FiTag } from 'react-icons/fi';

const PRIORITIES = [
  { value: 'low',    label: 'Low',    color: 'text-emerald-600' },
  { value: 'medium', label: 'Medium', color: 'text-amber-600' },
  { value: 'high',   label: 'High',   color: 'text-orange-600' },
  { value: 'urgent', label: 'Urgent', color: 'text-red-600' },
];

const STATUSES = [
  { value: 'todo',        label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed',   label: 'Completed' },
];

const defaultForm = { title: '', description: '', priority: 'medium', status: 'todo', dueDate: '', tags: '' };

const TaskModal = ({ task, onClose }) => {
  const { createTask, updateTask, submitting } = useTasks();
  const isEdit = Boolean(task);

  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        status: task.status || 'todo',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        tags: task.tags?.join(', ') || '',
      });
    }
  }, [task]);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    else if (form.title.trim().length > 100) e.title = 'Max 100 characters';
    if (form.description.length > 500) e.description = 'Max 500 characters';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      priority: form.priority,
      status: form.status,
      dueDate: form.dueDate || null,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    };
    try {
      if (isEdit) await updateTask(task._id, payload);
      else await createTask(payload);
      onClose();
    } catch { /* handled in context */ }
  };

  const set = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg card shadow-modal animate-slide-up max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <h2 className="font-bold text-slate-900 dark:text-white text-lg">
            {isEdit ? 'Edit Task' : 'New Task'}
          </h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 transition-colors">
            <FiX className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-5">
          {/* Title */}
          <div>
            <label className="label">Title *</label>
            <input
              type="text"
              placeholder="What needs to be done?"
              className={`input-field ${errors.title ? 'border-red-400 focus:ring-red-400' : ''}`}
              value={form.title}
              onChange={set('title')}
              autoFocus
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="label flex items-center gap-1"><FiAlignLeft className="w-3.5 h-3.5" /> Description</label>
            <textarea
              rows={3}
              placeholder="Add details (optional)…"
              className={`input-field resize-none ${errors.description ? 'border-red-400 focus:ring-red-400' : ''}`}
              value={form.description}
              onChange={set('description')}
            />
            <div className="flex items-center justify-between mt-1">
              {errors.description ? <p className="text-red-500 text-xs">{errors.description}</p> : <span />}
              <span className="text-xs text-slate-400">{form.description.length}/500</span>
            </div>
          </div>

          {/* Priority + Status row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label flex items-center gap-1"><FiFlag className="w-3.5 h-3.5" /> Priority</label>
              <select className="input-field" value={form.priority} onChange={set('priority')}>
                {PRIORITIES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Status</label>
              <select className="input-field" value={form.status} onChange={set('status')}>
                {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="label flex items-center gap-1"><FiCalendar className="w-3.5 h-3.5" /> Due Date</label>
            <input type="date" className="input-field" value={form.dueDate} onChange={set('dueDate')} />
          </div>

          {/* Tags */}
          <div>
            <label className="label flex items-center gap-1"><FiTag className="w-3.5 h-3.5" /> Tags</label>
            <input
              type="text"
              placeholder="design, frontend, bug (comma-separated)"
              className="input-field"
              value={form.tags}
              onChange={set('tags')}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={submitting} className="btn-primary flex-1">
              {submitting
                ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                : isEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
