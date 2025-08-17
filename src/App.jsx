import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './components/ui/Button'
import { cn } from './lib/utils'
import { Plus, Trash2, Check, X } from 'lucide-react'

function App() {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const savedTodos = localStorage.getItem('neo-brutalism-todos')
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('neo-brutalism-todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = () => {
    if (newTodo.trim() !== '') {
      const todo = {
        id: Date.now(),
        text: newTodo,
        completed: false,
        createdAt: new Date().toISOString()
      }
      setTodos([todo, ...todos])
      setNewTodo('')
    }
  }

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'completed') return todo.completed
    if (filter === 'active') return !todo.completed
    return true
  })

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo()
    }
  }

  return (
    <div className="min-h-screen bg-yellow-300 p-4 font-mono">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-8"
        >
          <h1 className="text-6xl font-black text-black mb-2 transform -rotate-1">
            TODO
          </h1>
          <div className="bg-black text-yellow-300 px-4 py-2 inline-block transform rotate-1 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <span className="font-bold">NEO BRUTALISM STYLE</span>
          </div>
        </motion.div>

        {/* Add Todo Form */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
            <div className="flex gap-4">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a new task..."
                className="flex-1 px-4 py-3 text-lg font-bold border-4 border-black focus:outline-none focus:ring-0 bg-yellow-100"
              />
              <Button
                onClick={addTodo}
                className="px-6 py-3 bg-green-400 hover:bg-green-500 text-black font-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transform hover:translate-x-1 hover:translate-y-1 transition-all"
              >
                <Plus className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="mb-6 flex gap-4 flex-wrap"
        >
          {['all', 'active', 'completed'].map((filterType) => (
            <Button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={cn(
                "px-4 py-2 font-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transform hover:translate-x-1 hover:translate-y-1 transition-all uppercase",
                filter === filterType
                  ? "bg-black text-yellow-300"
                  : "bg-white text-black hover:bg-gray-100"
              )}
            >
              {filterType}
            </Button>
          ))}
        </motion.div>

        {/* Todo List */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredTodos.map((todo, index) => (
              <motion.div
                key={todo.id}
                initial={{ x: -100, opacity: 0, scale: 0.9 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                exit={{ x: 100, opacity: 0, scale: 0.9 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.05,
                  ease: "easeOut"
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-4",
                  todo.completed && "bg-gray-100"
                )}
              >
                <div className="flex items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleTodo(todo.id)}
                    className={cn(
                      "w-8 h-8 border-4 border-black flex items-center justify-center font-black",
                      todo.completed
                        ? "bg-green-400 text-black"
                        : "bg-white text-transparent hover:bg-green-100"
                    )}
                  >
                    {todo.completed && <Check className="w-4 h-4" />}
                  </motion.button>

                  <span
                    className={cn(
                      "flex-1 text-lg font-bold",
                      todo.completed
                        ? "line-through text-gray-600"
                        : "text-black"
                    )}
                  >
                    {todo.text}
                  </span>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => deleteTodo(todo.id)}
                    className="w-8 h-8 bg-red-400 hover:bg-red-500 border-4 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transform hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                  >
                    <Trash2 className="w-4 h-4 text-black" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredTodos.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center py-12"
          >
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 transform -rotate-1">
              <h3 className="text-2xl font-black text-black mb-2">
                {filter === 'completed' && 'NO COMPLETED TASKS'}
                {filter === 'active' && 'NO ACTIVE TASKS'}
                {filter === 'all' && 'NO TASKS YET'}
              </h3>
              <p className="text-lg font-bold text-gray-600">
                {filter === 'all' ? 'Add your first task above!' : `Switch to "all" to see other tasks`}
              </p>
            </div>
          </motion.div>
        )}

        {/* Stats */}
        {todos.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="mt-8 bg-black text-yellow-300 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-4"
          >
            <div className="flex justify-between items-center font-black">
              <span>TOTAL: {todos.length}</span>
              <span>COMPLETED: {todos.filter(t => t.completed).length}</span>
              <span>ACTIVE: {todos.filter(t => !t.completed).length}</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default App