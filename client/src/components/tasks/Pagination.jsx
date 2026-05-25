import React from 'react';
import { useTasks } from '../../context/TaskContext';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Pagination = () => {
  const { pagination, page, setPage } = useTasks();
  const { total, pages, limit } = pagination;

  if (pages <= 1) return null;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  const getPages = () => {
    const arr = [];
    const delta = 2;
    const range = { start: Math.max(2, page - delta), end: Math.min(pages - 1, page + delta) };

    arr.push(1);
    if (range.start > 2) arr.push('…');
    for (let i = range.start; i <= range.end; i++) arr.push(i);
    if (range.end < pages - 1) arr.push('…');
    if (pages > 1) arr.push(pages);
    return arr;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Showing <span className="font-semibold text-slate-700 dark:text-slate-300">{from}–{to}</span> of{' '}
        <span className="font-semibold text-slate-700 dark:text-slate-300">{total}</span> tasks
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <FiChevronLeft className="w-4 h-4" />
        </button>

        {getPages().map((p, i) => (
          <button
            key={i}
            onClick={() => typeof p === 'number' && setPage(p)}
            disabled={p === '…'}
            className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors
              ${p === page ? 'bg-brand-500 text-white shadow-sm' :
                p === '…' ? 'text-slate-400 cursor-default' :
                'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            {p}
          </button>
        ))}

        <button
          onClick={() => setPage(page + 1)}
          disabled={page === pages}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <FiChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
