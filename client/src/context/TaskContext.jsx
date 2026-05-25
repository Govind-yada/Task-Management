import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { tasksAPI } from '../utils/api';
import toast from 'react-hot-toast';

const TaskContext = createContext(null);

const initialState = {
  tasks: [],
  pagination: { total: 0, page: 1, pages: 1, limit: 10 },
  stats: { todo: 0, 'in-progress': 0, completed: 0 },
  loading: false,
  submitting: false,
  filters: { search: '', status: 'all', priority: 'all' },
  page: 1,
};

const taskReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':    return { ...state, loading: action.payload };
    case 'SET_SUBMITTING': return { ...state, submitting: action.payload };
    case 'SET_TASKS':
      return { ...state, tasks: action.payload.tasks, pagination: action.payload.pagination, stats: action.payload.stats, loading: false };
    case 'ADD_TASK':
      return { ...state, tasks: [action.payload, ...state.tasks], stats: { ...state.stats, [action.payload.status]: (state.stats[action.payload.status] || 0) + 1 }, submitting: false };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) => (t._id === action.payload._id ? action.payload : t)),
        submitting: false,
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((t) => t._id !== action.payload),
      };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload }, page: 1 };
    case 'SET_PAGE':
      return { ...state, page: action.payload };
    case 'RESET_FILTERS':
      return { ...state, filters: initialState.filters, page: 1 };
    default:
      return state;
  }
};

export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  const fetchTasks = useCallback(async (extraParams = {}) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const params = {
        ...state.filters,
        page: state.page,
        limit: state.pagination.limit,
        ...extraParams,
      };
      // Remove 'all' filters so backend ignores them
      if (params.status === 'all') delete params.status;
      if (params.priority === 'all') delete params.priority;
      if (!params.search) delete params.search;

      const { data } = await tasksAPI.getAll(params);
      dispatch({ type: 'SET_TASKS', payload: data });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch tasks');
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.filters, state.page, state.pagination.limit]);

  const createTask = useCallback(async (taskData) => {
    dispatch({ type: 'SET_SUBMITTING', payload: true });
    try {
      const { data } = await tasksAPI.create(taskData);
      dispatch({ type: 'ADD_TASK', payload: data.task });
      toast.success('Task created!');
      return data.task;
    } catch (err) {
      dispatch({ type: 'SET_SUBMITTING', payload: false });
      toast.error(err.response?.data?.message || 'Failed to create task');
      throw err;
    }
  }, []);

  const updateTask = useCallback(async (id, taskData) => {
    dispatch({ type: 'SET_SUBMITTING', payload: true });
    try {
      const { data } = await tasksAPI.update(id, taskData);
      dispatch({ type: 'UPDATE_TASK', payload: data.task });
      toast.success('Task updated!');
      return data.task;
    } catch (err) {
      dispatch({ type: 'SET_SUBMITTING', payload: false });
      toast.error(err.response?.data?.message || 'Failed to update task');
      throw err;
    }
  }, []);

  const deleteTask = useCallback(async (id) => {
    try {
      await tasksAPI.delete(id);
      dispatch({ type: 'DELETE_TASK', payload: id });
      toast.success('Task deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete task');
    }
  }, []);

  const toggleTask = useCallback(async (id) => {
    try {
      const { data } = await tasksAPI.toggle(id);
      dispatch({ type: 'UPDATE_TASK', payload: data.task });
      toast.success(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update task');
    }
  }, []);

  const setFilters = useCallback((filters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  }, []);

  const setPage = useCallback((page) => {
    dispatch({ type: 'SET_PAGE', payload: page });
  }, []);

  const resetFilters = useCallback(() => {
    dispatch({ type: 'RESET_FILTERS' });
  }, []);

  return (
    <TaskContext.Provider value={{ ...state, fetchTasks, createTask, updateTask, deleteTask, toggleTask, setFilters, setPage, resetFilters }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTasks must be used within TaskProvider');
  return ctx;
};
