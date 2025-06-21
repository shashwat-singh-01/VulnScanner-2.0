// components/ui/input.js
"use client"
import { forwardRef } from "react"
import { twMerge } from "tailwind-merge"

export const Input = forwardRef(function Input({ className = "", ...props }, ref) {
  return (
    <input
      ref={ref}
      className={twMerge(
        "w-full rounded-md border border-slate-600 bg-slate-800 px-4 py-2 text-white placeholder-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500",
        className
      )}
      {...props}
    />
  )
})
