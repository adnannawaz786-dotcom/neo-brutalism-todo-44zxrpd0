import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Edit3, Check, X } from 'lucide-react'
import { Button } from './ui/Button'

const TodoItem = ({ todo, onToggle, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)

  const handleEdit = () => {
    if (editText.trim()) {
      onEdit(todo.id, editText.trim())
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setEditText(todo.text)
    setIsEditing(false)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleEdit()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group relative"
    >
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 p-4 mb-4">
        <div className="flex items-center gap-4">
          {/* Checkbox */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onToggle(todo.id)}
            className={`w-6 h-6 border-3 border-black transition-all duration-200 flex items-center justify-center ${
              todo.completed 
                ? 'bg-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' 
                : 'bg-white hover:bg-gray-100'
            }`}
          >
            <AnimatePresence>
              {todo.completed && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Check size={16} className="text-black font-bold" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Todo Text / Edit Input */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {isEditing ? (
                <motion.input
                  key="edit-input"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={handleKeyPress}
                  onBlur={handleEdit}
                  autoFocus
                  className="w-full px-3 py-2 text-lg font-bold bg-white border-2 border-black focus:outline-none focus:border-blue-500 focus:shadow-[4px_4px_0px_0px_rgba(59,130,246,0.5)]"
                />
              ) : (
                <motion.span
                  key="todo-text"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`text-lg font-bold transition-all duration-200 ${
                    todo.completed 
                      ? 'line-through text-gray-600' 
                      : 'text-black'
                  }`}
                >
                  {todo.text}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <AnimatePresence>
              {isEditing ? (
                <motion.div
                  key="edit-actions"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex gap-2"
                >
                  <Button
                    onClick={handleEdit}
                    className="w-8 h-8 p-0 bg-green-400 hover:bg-green-500 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <Check size={16} />
                  </Button>
                  <Button
                    onClick={handleCancel}
                    className="w-8 h-8 p-0 bg-gray-400 hover:bg-gray-500 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <X size={16} />
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="default-actions"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex gap-2"
                >
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="w-8 h-8 p-0 bg-blue-400 hover:bg-blue-500 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <Edit3 size={16} />
                  </Button>
                  <Button
                    onClick={() => onDelete(todo.id)}
                    className="w-8 h-8 p-0 bg-red-400 hover:bg-red-500 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <Trash2 size={16} />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Completion Animation Overlay */}
        <AnimatePresence>
          {todo.completed && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              exit={{ scaleX: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-yellow-400 opacity-20 origin-left"
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default TodoItem