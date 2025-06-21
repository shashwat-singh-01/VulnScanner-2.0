// components/ui/checkbox.js
"use client"
import { motion } from "framer-motion"

export const Checkbox = ({ id, checked, onCheckedChange, className = "" }) => {
  return (
    <motion.input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={(e) => onCheckedChange(e.target.checked)}
      whileTap={{ scale: 0.95 }}
      className={`h-5 w-5 rounded border border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500 transition ${className}`}
    />
  )
}
