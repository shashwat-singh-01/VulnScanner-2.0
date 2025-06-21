// components/ui/select.js
"use client"
import { useState } from "react"

export const Select = ({ value, onValueChange, children }) => {
  return <div className="relative">{children}</div>
}

export const SelectTrigger = ({ onClick, children, className = "" }) => (
  <button
    onClick={onClick}
    className={`w-full rounded border border-slate-600 bg-slate-800 px-4 py-2 text-left text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
  >
    {children}
  </button>
)

export const SelectContent = ({ isOpen, children, className = "" }) =>
  isOpen ? (
    <div
      className={`absolute z-50 mt-1 w-full rounded-md bg-slate-900 border border-slate-600 shadow-lg ${className}`}
    >
      {children}
    </div>
  ) : null

export const SelectItem = ({ value, onClick, children, className = "" }) => (
  <div
    onClick={() => onClick(value)}
    className={`cursor-pointer px-4 py-2 text-white hover:bg-blue-600 transition ${className}`}
  >
    {children}
  </div>
)

export const SelectValue = ({ value }) => (
  <span className="text-white">{value}</span>
)
