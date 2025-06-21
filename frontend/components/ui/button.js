// components/ui/button.js
"use client"
import { forwardRef } from "react"
import { twMerge } from "tailwind-merge"
import { motion } from "framer-motion"

export const Button = forwardRef(function Button({ className = "", children, ...props }, ref) {
  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      className={twMerge(
        "inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500",
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  )
})
