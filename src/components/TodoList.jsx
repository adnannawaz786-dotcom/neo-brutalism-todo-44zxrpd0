import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './ui/Button'
import { Trash2, Plus, Check, X, Edit2, Save } from 'lucide-react'
import { cn } from '../lib/utils'

const TodoList = () => {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editingText, setEditingText] = useState('')
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
        text: newTodo.trim(),
        completed: false,
        createdAt: new Date().toISOString()
      }
      setTodos([...todos, todo])
      setNewTodo('')
    }
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const startEditing = (id, text) => {
    setEditingId(id)
    setEditingText(text)
  }

  const saveEdit = (id) => {
    if (editingText.trim() !== '') {
      setTodos(todos.map(todo =>
        todo.id === id ? { ...todo, text: editingText.trim() } : todo
      ))
    }
    setEditingId(null)
    setEditingText('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingText('')
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  const handleKeyPress = (e, action, ...args) => {
    if (e.key === 'Enter') {
      action(...args)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 300 }}
        className="mb-8"
      >
        <h1 className="text-6xl font-black text-black mb-2 transform -rotate-1 drop-shadow-[4px_4px_0px_#ff6b35]">
          TODO
        </h1>
        <p className="text-xl font-bold text-gray-700 transform rotate-1">
          Get stuff done, brutally!
        </p>
      </motion.div>

      {/* Add Todo Form */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="mb-8 bg-yellow-300 border-4 border-black p-4 shadow-[8px_8px_0px_#000] transform -rotate-1"
      >
        <div className="flex gap-3">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => handleKeyPress(e, addTodo)}
            placeholder="What needs to be done?"
            className="flex-1 px-4 py-3 border-4 border-black font-bold text-lg bg-white shadow-[4px_4px_0px_#000] focus:outline-none focus:shadow-[6px_6px_0px_#000] transform rotate-1"
          />
          <Button
            onClick={addTodo}
            className="bg-green-400 hover:bg-green-500 border-4 border-black shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] font-black text-lg px-6 transform rotate-1 hover:rotate-0 transition-all duration-200"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </div>
      </motion.div>

      {/* Filter Buttons */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="mb-6 flex gap-2 flex-wrap"
      >
        {['all', 'active', 'completed'].map((filterType) => (
          <Button
            key={filterType}
            onClick={() => setFilter(filterType)}
            className={cn(
              "font-black text-sm px-4 py-2 border-4 border-black shadow-[3px_3px_0px_#000] transform rotate-1 hover:rotate-0 transition-all duration-200",
              filter === filterType
                ? "bg-purple-400 shadow-[1px_1px_0px_#000]"
                : "bg-white hover:bg-gray-100 hover:shadow-[1px_1px_0px_#000]"
            )}
          >
            {filterType.toUpperCase()}
          </Button>
        ))}
      </motion.div>

      {/* Todo List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredTodos.map((todo, index) => (
            <motion.div
              key={todo.id}
              initial={{ x: -300, opacity: 0, rotate: -5 }}
              animate={{ x: 0, opacity: 1, rotate: index % 2 === 0 ? 1 : -1 }}
              exit={{ x: 300, opacity: 0, rotate: 10, scale: 0.8 }}
              transition={{
                duration: 0.4,
                type: "spring",
                stiffness: 300,
                damping: 25
              }}
              whileHover={{ scale: 1.02, rotate: 0 }}
              className={cn(
                "p-4 border-4 border-black shadow-[6px_6px_0px_#000] transition-all duration-200",
                todo.completed
                  ? "bg-gray-300 opacity-75"
                  : "bg-white"
              )}
            >
              <div className="flex items-center gap-3">
                {/* Checkbox */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleTodo(todo.id)}
                  className={cn(
                    "w-8 h-8 border-4 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center font-black",
                    todo.completed
                      ? "bg-green-400"
                      : "bg-white hover:bg-green-100"
                  )}
                >
                  {todo.completed && <Check className="w-5 h-5" />}
                </motion.button>

                {/* Todo Text */}
                <div className="flex-1">
                  {editingId === todo.id ? (
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, saveEdit, todo.id)}
                      className="w-full px-3 py-2 border-4 border-black font-bold text-lg bg-yellow-100 shadow-[2px_2px_0px_#000] focus:outline-none focus:shadow-[4px_4px_0px_#000]"
                      autoFocus
                    />
                  ) : (
                    <span
                      className={cn(
                        "font-bold text-lg",
                        todo.completed && "line-through text-gray-600"
                      )}
                    >
                      {todo.text}
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {editingId === todo.id ? (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => saveEdit(todo.id)}
                        className="p-2 bg-green-400 hover:bg-green-500 border-4 border-black shadow-[2px_2px_0px_#000] hover:shadow-[1px_1px_0px_#000]"
                      >
                        <Save className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={cancelEdit}
                        className="p-2 bg-gray-400 hover:bg-gray-500 border-4 border-black shadow-[2px_2px_0px_#000] hover:shadow-[1px_1px_0px_#000]"
                      >
                        <X className="w-4 h-4" />
                      </motion.button>
                    </>
                  ) : (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => startEditing(todo.id, todo.text)}
                        className="p-2 bg-blue-400 hover:bg-blue-500 border-4 border-black shadow-[2px_2px_0px_#000] hover:shadow-[1px_1px_0px_#000]"
                      >
                        <Edit2 className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => deleteTodo(todo.id)}
                        className="p-2 bg-red-400 hover:bg-red-500 border-4 border-black shadow-[2px_2px_0px_#000] hover:shadow-[1px_1px_0px_#000]"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Empty State */}
        {filteredTodos.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-black text-gray-600 mb-2 transform -rotate-1">
              {filter === 'completed' && todos.some(t => !t.completed)
                ? 'No completed todos yet!'
                : filter === 'active' && todos.some(t => t.completed)
                ? 'All done! Great job!'
                : 'No todos yet!'}
            </h3>
            <p className="text-lg font-bold text-gray-500 transform rotate-1">
              {todos.length === 0 ? 'Add your first todo above!' : 'Keep going!'}
            </p>
          </motion.div>
        )}
      </div>

      {/* Stats */}
      {todos.length > 0 && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="mt-8 p-4 bg-pink-300 border-4 border-black shadow-[6px_6px_0px_#000] transform rotate-1"
        >
          <div className="flex justify-between items-center font-black text-lg">
            <span>Total: {todos.length}</span>
            <span>Completed: {todos.filter(t => t.completed).length}</span>
            <span>Remaining: {todos.filter(t => !t.completed).length}</span>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default TodoList