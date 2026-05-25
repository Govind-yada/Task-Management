import React, { useState, useEffect } from 'react';
import { useTasks } from '../../context/TaskContext';
import { useDebounce } from '../../hooks/useDebounce';
import { FiSearch, FiX, FiFilter } from 'react-icons/fi';

const TaskFilters = () => {
  const { filters, setFilters, resetFilters } = useTasks();
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const debouncedSearch = useDebounce(searchInput, 400);

  useEffect(() => {
    setFilters({ search: debouncedSearch });
  }, [debouncedSearch]); // eslint-disable-line

  const hasActive = filters.status !== 'all' || filters.priority !== 'all' || filters.search;

  const handleReset = () => {
    setSearchInput('');
    resetFilters();
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search */}
      <div className="relative flex-1">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search tasks…"
          className="input-field pl-9 pr-8"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        {searchInput && (
          <button onClick={() => setSearchInput('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
            <FiX className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Status filter */}
      <select
        className="input-field sm:w-40"
        value={filters.status}
        onChange={(e) => setFilters({ status: e.target.value })}
      >
        <option value="all">All Status</option>
        <option value="todo">To Do</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>

      {/* Priority filter */}
      <select
        className="input-field sm:w-40"
        value={filters.priority}
        onChange={(e) => setFilters({ priority: e.target.value })}
      >
        <option value="all">All Priority</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="urgent">Urgent</option>
      </select>

      {/* Reset */}
      {hasActive && (
        <button onClick={handleReset}
          className="btn-secondary gap-1.5 whitespace-nowrap">
          <FiX className="w-3.5 h-3.5" /> Clear
        </button>
      )}
    </div>
  );
};

export default TaskFilters;
