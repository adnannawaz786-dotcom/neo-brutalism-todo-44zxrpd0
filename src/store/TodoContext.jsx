import React, { createContext, useContext, useReducer, useEffect } from 'react';

const TodoContext = createContext();

const todoReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TODOS':
      return {
        ...state,
        todos: action.payload,
        loading: false
      };
    
    case 'ADD_TODO':
      const newTodo = {
        id: Date.now().toString(),
        text: action.payload.text,
        completed: false,
        createdAt: new Date().toISOString(),
        priority: action.payload.priority || 'medium',
        category: action.payload.category || 'general'
      };
      return {
        ...state,
        todos: [newTodo, ...state.todos]
      };
    
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      };
    
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload)
      };
    
    case 'UPDATE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id
            ? { ...todo, ...action.payload.updates }
            : todo
        )
      };
    
    case 'SET_FILTER':
      return {
        ...state,
        filter: action.payload
      };
    
    case 'SET_SORT':
      return {
        ...state,
        sortBy: action.payload
      };
    
    case 'SET_CATEGORY':
      return {
        ...state,
        selectedCategory: action.payload
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    
    case 'CLEAR_COMPLETED':
      return {
        ...state,
        todos: state.todos.filter(todo => !todo.completed)
      };
    
    case 'MARK_ALL_COMPLETED':
      return {
        ...state,
        todos: state.todos.map(todo => ({ ...todo, completed: true }))
      };
    
    default:
      return state;
  }
};

const initialState = {
  todos: [],
  filter: 'all', // all, active, completed
  sortBy: 'created', // created, priority, alphabetical
  selectedCategory: 'all',
  loading: true,
  error: null
};

export const TodoProvider = ({ children }) => {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  // Load todos from localStorage on mount
  useEffect(() => {
    try {
      const savedTodos = localStorage.getItem('neo-brutalism-todos');
      if (savedTodos) {
        const parsedTodos = JSON.parse(savedTodos);
        dispatch({ type: 'SET_TODOS', payload: parsedTodos });
      } else {
        dispatch({ type: 'SET_TODOS', payload: [] });
      }
    } catch (error) {
      console.error('Error loading todos from localStorage:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load todos' });
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    if (!state.loading) {
      try {
        localStorage.setItem('neo-brutalism-todos', JSON.stringify(state.todos));
      } catch (error) {
        console.error('Error saving todos to localStorage:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to save todos' });
      }
    }
  }, [state.todos, state.loading]);

  // Action creators
  const addTodo = (text, priority = 'medium', category = 'general') => {
    if (!text.trim()) return;
    dispatch({
      type: 'ADD_TODO',
      payload: { text: text.trim(), priority, category }
    });
  };

  const toggleTodo = (id) => {
    dispatch({ type: 'TOGGLE_TODO', payload: id });
  };

  const deleteTodo = (id) => {
    dispatch({ type: 'DELETE_TODO', payload: id });
  };

  const updateTodo = (id, updates) => {
    dispatch({
      type: 'UPDATE_TODO',
      payload: { id, updates }
    });
  };

  const setFilter = (filter) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  };

  const setSortBy = (sortBy) => {
    dispatch({ type: 'SET_SORT', payload: sortBy });
  };

  const setSelectedCategory = (category) => {
    dispatch({ type: 'SET_CATEGORY', payload: category });
  };

  const clearCompleted = () => {
    dispatch({ type: 'CLEAR_COMPLETED' });
  };

  const markAllCompleted = () => {
    dispatch({ type: 'MARK_ALL_COMPLETED' });
  };

  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  // Computed values
  const getFilteredTodos = () => {
    let filteredTodos = [...state.todos];

    // Apply category filter
    if (state.selectedCategory !== 'all') {
      filteredTodos = filteredTodos.filter(
        todo => todo.category === state.selectedCategory
      );
    }

    // Apply completion filter
    switch (state.filter) {
      case 'active':
        filteredTodos = filteredTodos.filter(todo => !todo.completed);
        break;
      case 'completed':
        filteredTodos = filteredTodos.filter(todo => todo.completed);
        break;
      default:
        // 'all' - no additional filtering
        break;
    }

    // Apply sorting
    switch (state.sortBy) {
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        filteredTodos.sort((a, b) => 
          priorityOrder[b.priority] - priorityOrder[a.priority]
        );
        break;
      case 'alphabetical':
        filteredTodos.sort((a, b) => a.text.localeCompare(b.text));
        break;
      case 'created':
      default:
        filteredTodos.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
    }

    return filteredTodos;
  };

  const getStats = () => {
    const total = state.todos.length;
    const completed = state.todos.filter(todo => todo.completed).length;
    const active = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      active,
      completionRate
    };
  };

  const getCategories = () => {
    const categories = [...new Set(state.todos.map(todo => todo.category))];
    return categories.sort();
  };

  const value = {
    // State
    todos: state.todos,
    filter: state.filter,
    sortBy: state.sortBy,
    selectedCategory: state.selectedCategory,
    loading: state.loading,
    error: state.error,
    
    // Actions
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    setFilter,
    setSortBy,
    setSelectedCategory,
    clearCompleted,
    markAllCompleted,
    clearError,
    
    // Computed values
    filteredTodos: getFilteredTodos(),
    stats: getStats(),
    categories: getCategories()
  };

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodos = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
};

export default TodoContext;